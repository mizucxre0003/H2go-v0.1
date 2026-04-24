import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';
import { Shield, User } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { userId } = useTelegram();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const fetchUsers = () => {
    if (userId) {
      setLoading(true);
      fetch(`/api/admin/users?telegramId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  const toggleRole = async (targetId: string, currentRole: string) => {
    if (!userId) return;
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    const confirmChange = window.confirm(`Сменить роль пользователя на ${newRole}?`);
    if (!confirmChange) return;

    try {
      const res = await fetch(`/api/admin/users/${targetId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: userId, role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert('Ошибка при смене роли');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при смене роли');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6 pb-10"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Пользователи</h1>
        <p className="text-gray-400 text-sm">Управление ролями</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Загрузка...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Пользователи не найдены</p>
        ) : (
          users.map((u, index) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4 flex items-center justify-between" hoverEffect>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 shrink-0">
                    {u.role === 'ADMIN' || u.role === 'SUPERADMIN' ? <Shield size={20} className="text-yellow-400" /> : <User size={20} className="text-gray-400" />}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm truncate">{u.firstName || 'Без имени'} {u.username ? `(@${u.username})` : ''}</span>
                    <span className="text-xs text-gray-400">ID: {u.telegramId}</span>
                  </div>
                </div>
                
                {u.role !== 'SUPERADMIN' && u.telegramId !== userId && (
                  <button 
                    onClick={() => toggleRole(u.id, u.role)}
                    className="text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors"
                  >
                    {u.role === 'ADMIN' ? 'Забрать права' : 'Сделать админом'}
                  </button>
                )}
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
