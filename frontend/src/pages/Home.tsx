import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { PlusCircle, Package, Calculator, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Создать заявку', icon: <PlusCircle size={24} className="text-blue-400" />, path: '/create' },
    { title: 'Мои заявки', icon: <Package size={24} className="text-emerald-400" />, path: '/orders' },
    { title: 'Калькулятор', icon: <Calculator size={24} className="text-purple-400" />, path: '/calc' },
    { title: 'Поддержка', icon: <HeadphonesIcon size={24} className="text-pink-400" />, path: '/support' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold mb-1">Привет, Имя!</h1>
        <p className="text-gray-400 text-sm">Что вы хотите сделать сегодня?</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
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
              className="flex flex-col items-center justify-center p-6 h-32 gap-3"
            >
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-center">{item.title}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
