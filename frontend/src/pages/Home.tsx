import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { PlusCircle, Package, Calculator, HeadphonesIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, userId } = useTelegram();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (userId) {
      fetch(`/api/auth/me?telegramId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && (data.role === 'ADMIN' || data.role === 'SUPERADMIN')) {
            setIsAdmin(true);
          }
        })
        .catch(console.error);
    }
  }, [userId]);

  const menuItems = [
    { title: 'Создать заявку', icon: <PlusCircle size={24} className="text-blue-400" />, path: '/create' },
    { title: 'Мои заявки', icon: <Package size={24} className="text-emerald-400" />, path: '/orders' },
    { title: 'Калькулятор', icon: <Calculator size={24} className="text-purple-400" />, path: '/calc' },
    { title: 'Поддержка', icon: <HeadphonesIcon size={24} className="text-pink-400" />, path: '/support' },
  ];

  if (isAdmin) {
    menuItems.push({
      title: 'Админ-панель',
      icon: <Settings size={24} className="text-yellow-400" />,
      path: '/admin'
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold mb-1">Привет, {user?.first_name || 'Гость'}!</h1>
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
