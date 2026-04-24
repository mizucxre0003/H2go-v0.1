import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';

interface Order {
  id: string;
  orderNumber: number;
  name: string;
  priceOriginal: number;
  currency: string;
  status: string;
}

const statusColors: Record<string, string> = {
  NEW: 'text-blue-400',
  UNDER_REVIEW: 'text-yellow-400',
  AWAITING_CLIENT_CONFIRMATION: 'text-orange-400',
  CLIENT_CONFIRMED: 'text-emerald-400',
  PURCHASING: 'text-purple-400',
  PURCHASED: 'text-indigo-400',
  IN_TRANSIT: 'text-cyan-400',
  ARRIVED_IN_COUNTRY: 'text-teal-400',
  READY_FOR_PICKUP: 'text-green-400',
  COMPLETED: 'text-gray-400',
  CANCELLED: 'text-red-400'
};

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

export const Orders: React.FC = () => {
  const { userId } = useTelegram();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/orders?telegramId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Мои заявки</h1>
        <p className="text-gray-400 text-sm">История ваших заказов</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Загрузка...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 px-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">У вас пока нет активных заявок.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-4 flex items-center justify-between" hoverEffect>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">#{order.orderNumber} • {order.name}</span>
                  <span className="text-xs text-gray-400">{order.priceOriginal} {order.currency}</span>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 bg-white/5 rounded-md border border-white/10 ${statusColors[order.status] || 'text-white'}`}>
                  {statusNames[order.status] || order.status}
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
