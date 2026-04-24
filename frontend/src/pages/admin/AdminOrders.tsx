import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';

interface Order {
  id: string;
  orderNumber: number;
  name: string;
  priceOriginal: number;
  currency: string;
  status: string;
  createdAt: string;
  client: { firstName: string; telegramId: string };
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

export const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useTelegram();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`/api/admin/orders?telegramId=${userId}&status=${filter}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [userId, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Заявки</h1>
        <p className="text-gray-400 text-sm">Управление заказами</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'NEW', 'PURCHASING', 'COMPLETED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 border border-white/10 text-gray-300'
            }`}
          >
            {f === 'ALL' ? 'Все' : f === 'NEW' ? 'Новые' : f === 'PURCHASING' ? 'В работе' : 'Завершенные'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Заявок не найдено</p>
        ) : (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard 
                className="p-4 flex items-center justify-between cursor-pointer" 
                hoverEffect
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                <div className="flex flex-col gap-1 w-2/3">
                  <span className="font-medium text-sm truncate">#{order.orderNumber} • {order.name}</span>
                  <span className="text-xs text-gray-400 truncate">
                    Клиент: {order.client?.firstName || order.client?.telegramId}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`text-xs font-semibold px-2 py-1 bg-white/5 rounded-md border border-white/10 ${statusColors[order.status] || 'text-white'}`}>
                    {statusNames[order.status] || order.status}
                  </div>
                  <span className="text-xs font-medium text-gray-300">{order.priceOriginal} {order.currency}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
