"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const db_1 = require("../db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.BOT_TOKEN;
if (!token) {
    console.warn('BOT_TOKEN is not set. Bot will not start.');
}
// export bot instance so it can be used or started
exports.bot = token ? new grammy_1.Bot(token) : null;
if (exports.bot) {
    exports.bot.command('start', async (ctx) => {
        if (!ctx.from)
            return;
        const telegramId = ctx.from.id;
        // Register or update user
        try {
            await db_1.prisma.user.upsert({
                where: { telegramId: BigInt(telegramId) },
                update: {
                    username: ctx.from.username,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name,
                },
                create: {
                    telegramId: BigInt(telegramId),
                    username: ctx.from.username,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name,
                },
            });
            await ctx.reply(`Добро пожаловать в H2Go, ${ctx.from.first_name}! 🚀\n\nЯ помогу вам выкупить и доставить товары из-за границы. Нажмите кнопку ниже, чтобы открыть приложение.`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '📱 Открыть Mini App',
                                web_app: { url: process.env.MINI_APP_URL || 'https://example.com' },
                            },
                        ],
                    ],
                },
            });
        }
        catch (e) {
            console.error('Error in /start:', e);
            await ctx.reply('Произошла ошибка при регистрации.');
        }
    });
    exports.bot.command('menu', async (ctx) => {
        await ctx.reply('Главное меню:', {
            reply_markup: {
                keyboard: [
                    [{ text: '📦 Мои заявки' }, { text: '🧮 Калькулятор' }],
                    [{ text: '📞 Поддержка' }, { text: 'ℹ️ О сервисе' }],
                ],
                resize_keyboard: true,
            },
        });
    });
    exports.bot.command('myorders', async (ctx) => {
        await ctx.reply('Перейдите в Mini App, чтобы посмотреть ваши заявки.', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '📦 Открыть заявки',
                            web_app: { url: `${process.env.MINI_APP_URL}/orders` || 'https://example.com/orders' },
                        },
                    ],
                ],
            },
        });
    });
    exports.bot.command('calc', async (ctx) => {
        await ctx.reply('Откройте калькулятор стоимости в приложении:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🧮 Калькулятор',
                            web_app: { url: `${process.env.MINI_APP_URL}/calc` || 'https://example.com/calc' },
                        },
                    ],
                ],
            },
        });
    });
    // Handle errors
    exports.bot.catch((err) => {
        console.error('Error in bot:', err);
    });
}
