import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';

const mockOrders = [
  { id: '1001', name: 'Кроссовки Nike Air', price: '299 CNY', status: 'В пути', statusColor: 'text-blue-400' },
  { id: '1002', name: 'Чехол iPhone 15', price: '45 CNY', status: 'Выкуплен', statusColor: 'text-purple-400' },
  { id: '1003', name: 'Рюкзак Xiaomi', price: '120 CNY', status: 'Готов к выдаче', statusColor: 'text-emerald-400' },
];

export const Orders: React.FC = () => {
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
        {mockOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-4 flex items-center justify-between" hoverEffect>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">#{order.id} • {order.name}</span>
                <span className="text-xs text-gray-400">{order.price}</span>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 bg-white/5 rounded-md border border-white/10 ${order.statusColor}`}>
                {order.status}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
