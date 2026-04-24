import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { Settings, Users, Package, CircleDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Заявки', description: 'Управление заказами пользователей', icon: <Package size={24} className="text-blue-400" />, path: '/admin/orders' },
    { title: 'Курсы валют', description: 'Настройка конвертации', icon: <CircleDollarSign size={24} className="text-emerald-400" />, path: '/admin/rates' },
    { title: 'Пользователи', description: 'Управление ролями', icon: <Users size={24} className="text-cyan-400" />, path: '/admin/users' },
    { title: 'Настройки', description: 'Контакты поддержки', icon: <Settings size={24} className="text-yellow-400" />, path: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold mb-1">Панель управления</h1>
        <p className="text-gray-400 text-sm">Секретная зона администратора</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              hoverEffect 
              onClick={() => navigate(item.path)}
              className="flex items-center p-4 gap-4"
            >
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{item.title}</span>
                <span className="text-xs text-gray-400">{item.description}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
