import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bot } from './bot';
import { webhookCallback } from 'grammy';
import { prisma } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Telegram Bot Webhook endpoint (for production on Koyeb)
if (bot) {
  // If webhook URL is set, use webhooks
  if (process.env.WEBHOOK_URL) {
    const baseUrl = process.env.WEBHOOK_URL.replace(/\/$/, '');
    const webhookPath = '/api/bot-webhook';
    
    app.post(webhookPath, (req, res, next) => {
      console.log('Incoming webhook request:', req.body?.update_id);
      next();
    }, webhookCallback(bot, 'express'));
    
    // Set webhook in Telegram
    bot.api.setWebhook(`${baseUrl}${webhookPath}`)
      .then(() => console.log(`Webhook is set to ${baseUrl}${webhookPath}`))
      .catch(console.error);
  } else {
    // Local dev: start polling
    bot.start({
      onStart: (info) => {
        console.log(`Bot started as @${info.username}`);
      },
    });
  }
}

import { createAdminRouter } from './adminRoutes';

// API Endpoints for Mini App
const api = express.Router();

api.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public GET rates endpoint for Calculator
api.get('/rates', async (req, res) => {
  try {
    const rates = await prisma.currencyRate.findMany();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints
api.use('/admin', createAdminRouter(bot));

// GET user info and role
api.get('/auth/me', async (req, res) => {
  const telegramId = req.query.telegramId as string;
  if (!telegramId) return res.status(400).json({ error: 'telegramId is required' });

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { id: true, role: true, firstName: true, status: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET system settings
api.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    // Convert array to object { key: value }
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST system settings (Admin only)
api.post('/settings', async (req, res) => {
  const { telegramId, settings } = req.body;
  if (!telegramId || !settings) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Upsert each setting
    for (const [key, value] of Object.entries(settings)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user orders (Dummy auth for now, later need initData validation)
api.get('/orders', async (req, res) => {
  const telegramId = req.query.telegramId as string;
  if (!telegramId) return res.status(400).json({ error: 'telegramId is required' });

  try {
    const orders = await prisma.order.findMany({
      where: {
        client: {
          telegramId: BigInt(telegramId),
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Convert BigInt to string for JSON serialization
    const serializedOrders = orders.map((order: any) => ({
      ...order,
      id: order.id.toString()
    }));
    
    res.json(serializedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new order
api.post('/orders', async (req, res) => {
  const { telegramId, link, name, description, quantity, priceOriginal, currency } = req.body;
  if (!telegramId || !name || !priceOriginal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = await prisma.order.create({
      data: {
        clientId: user.id,
        link,
        name,
        description,
        quantity: quantity || 1,
        priceOriginal: parseFloat(priceOriginal),
        currency: currency || 'USD',
        status: 'NEW',
      },
    });

    // Notify user in bot
    if (bot) {
      bot.api.sendMessage(
        Number(telegramId),
        `✅ Ваша заявка #${newOrder.orderNumber} на "${name}" успешно создана и отправлена на рассмотрение!`
      ).catch(console.error);
    }

    res.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount API
app.use('/api', api);

// Serve frontend static files
import path from 'path';

// Раздача статики React (Vite)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Для всех остальных маршрутов (клиентский роутинг) отдаем index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
