import { Router } from 'express';
import { prisma } from './db';

// This function must receive the "bot" instance from server.ts so it can send notifications
export const createAdminRouter = (bot: any) => {
  const router = Router();

  // Middleware to check admin role
  const checkAdmin = async (req: any, res: any, next: any) => {
    const telegramId = req.query.telegramId || req.body.telegramId;
    if (!telegramId) return res.status(401).json({ error: 'Unauthorized: missing telegramId' });

    try {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) }
      });
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }
      req.adminUser = user;
      next();
    } catch (e) {
      console.error('Auth error', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  router.use(checkAdmin);

  // GET /api/admin/orders
  router.get('/orders', async (req, res) => {
    try {
      const { status } = req.query;
      const whereClause: any = {};
      if (status && status !== 'ALL') {
        whereClause.status = status;
      }
      const orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { firstName: true, telegramId: true } } }
      });
      
      // Serialize BigInt for JSON response
      const serializedOrders = orders.map(o => ({
        ...o,
        client: { ...o.client, telegramId: o.client.telegramId.toString() }
      }));
      res.json(serializedOrders);
    } catch (error) {
      console.error('Error fetching admin orders', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // GET /api/admin/orders/:id
  router.get('/orders/:id', async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { client: true }
      });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json({
        ...order,
        client: { ...order.client, telegramId: order.client.telegramId.toString() }
      });
    } catch (error) {
      console.error('Error fetching order', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // PATCH /api/admin/orders/:id
  router.patch('/orders/:id', async (req, res) => {
    try {
      const { status, priceKzt, internalRate, trackNumber, managerComment, commission, deliveryCost, totalPrice } = req.body;
      const orderId = req.params.id;

      // Get current order to check if status changed
      const currentOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { client: true }
      });

      if (!currentOrder) return res.status(404).json({ error: 'Order not found' });

      // Update the order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: status || undefined,
          priceKzt: priceKzt !== undefined ? parseFloat(priceKzt) : undefined,
          internalRate: internalRate !== undefined ? parseFloat(internalRate) : undefined,
          commission: commission !== undefined ? parseFloat(commission) : undefined,
          deliveryCost: deliveryCost !== undefined ? parseFloat(deliveryCost) : undefined,
          totalPrice: totalPrice !== undefined ? parseFloat(totalPrice) : undefined,
          trackNumber: trackNumber !== undefined ? trackNumber : undefined,
          managerComment: managerComment !== undefined ? managerComment : undefined,
        }
      });

      // Status translation mapping
      const statusNames: Record<string, string> = {
        NEW: 'Новая',
        UNDER_REVIEW: 'На рассмотрении',
        AWAITING_CLIENT_CONFIRMATION: 'Ожидает оплаты',
        CLIENT_CONFIRMED: 'Оплачено',
        PURCHASING: 'Выкупаем',
        PURCHASED: 'Выкуплен',
        IN_TRANSIT: 'В пути',
        ARRIVED_IN_COUNTRY: 'Прибыл в страну',
        READY_FOR_PICKUP: 'Готов к выдаче',
        COMPLETED: 'Завершен',
        CANCELLED: 'Отменен'
      };

      // If status changed, send notification
      if (status && status !== currentOrder.status) {
        const readableStatus = statusNames[status] || status;
        const msg = `📦 Ваш заказ #${updatedOrder.orderNumber} ("${updatedOrder.name}") перешел в статус: *${readableStatus}*.`;
        
        try {
          await bot.api.sendMessage(currentOrder.client.telegramId.toString(), msg, { parse_mode: 'Markdown' });
        } catch (botErr) {
          console.error(`Failed to send notification to ${currentOrder.client.telegramId}:`, botErr);
        }
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  // GET /api/admin/users
  router.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(users.map(u => ({ ...u, telegramId: u.telegramId.toString() })));
    } catch (error) {
      console.error('Error fetching users', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // PATCH /api/admin/users/:id/role
  router.patch('/users/:id/role', async (req, res) => {
    try {
      const { role } = req.body;
      if (!['CLIENT', 'ADMIN', 'SUPERADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role }
      });
      res.json({ ...user, telegramId: user.telegramId.toString() });
    } catch (error) {
      console.error('Error updating user role', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // GET /api/admin/rates
  router.get('/rates', async (req, res) => {
    try {
      const rates = await prisma.currencyRate.findMany();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rates' });
    }
  });

  // POST /api/admin/rates
  router.post('/rates', async (req, res) => {
    try {
      const { currency, rate } = req.body;
      if (!currency || !rate) return res.status(400).json({ error: 'Missing data' });

      const updated = await prisma.currencyRate.upsert({
        where: { currency },
        update: { rate: parseFloat(rate) },
        create: { currency, rate: parseFloat(rate) }
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update rate' });
    }
  });

  return router;
};
