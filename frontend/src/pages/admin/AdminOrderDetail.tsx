import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';
import { Save, ArrowLeft } from 'lucide-react';

export const AdminOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useTelegram();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    priceKzt: '',
    commission: '',
    deliveryCost: '',
    totalPrice: '',
    trackNumber: '',
    managerComment: ''
  });

  const statuses = [
    { value: 'NEW', label: 'Новая' },
    { value: 'UNDER_REVIEW', label: 'На рассмотрении' },
    { value: 'AWAITING_CLIENT_CONFIRMATION', label: 'Ожидает оплаты' },
    { value: 'CLIENT_CONFIRMED', label: 'Оплачено' },
    { value: 'PURCHASING', label: 'Выкупаем' },
    { value: 'PURCHASED', label: 'Выкуплен' },
    { value: 'IN_TRANSIT', label: 'В пути' },
    { value: 'ARRIVED_IN_COUNTRY', label: 'Прибыл в страну' },
    { value: 'READY_FOR_PICKUP', label: 'Готов к выдаче' },
    { value: 'COMPLETED', label: 'Завершен' },
    { value: 'CANCELLED', label: 'Отменен' }
  ];

  useEffect(() => {
    if (userId && id) {
      fetch(`/api/admin/orders/${id}?telegramId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setOrder(data);
            setFormData({
              status: data.status || 'NEW',
              priceKzt: data.priceKzt || '',
              commission: data.commission || '',
              deliveryCost: data.deliveryCost || '',
              totalPrice: data.totalPrice || '',
              trackNumber: data.trackNumber || '',
              managerComment: data.managerComment || ''
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [userId, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId || !id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: userId, ...formData })
      });
      if (res.ok) {
        alert('Заявка обновлена! (Уведомление отправлено)');
        navigate('/admin/orders');
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-center py-8">Загрузка...</p>;
  if (!order) return <p className="text-gray-400 text-center py-8">Заказ не найден</p>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6 pb-20"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full border border-white/10 text-gray-300">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold mb-1">Заказ #{order.orderNumber}</h1>
          <p className="text-gray-400 text-xs">Клиент: {order.client.firstName} (@{order.client.username || order.client.telegramId})</p>
        </div>
      </div>

      <GlassCard className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Товар:</span>
          <span className="font-medium text-sm">{order.name}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Ссылка:</span>
          <a href={order.link} target="_blank" rel="noreferrer" className="text-blue-400 text-sm truncate">{order.link}</a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Исходная цена:</span>
            <span className="font-semibold">{order.priceOriginal} {order.currency}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Количество:</span>
            <span className="font-semibold">{order.quantity} шт.</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 ml-1">Текущий статус</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="glass-input p-3 rounded-xl w-full text-sm outline-none bg-[#1A1A2E]"
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 ml-1">Цена (KZT)</label>
            <input name="priceKzt" type="number" value={formData.priceKzt} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600" placeholder="0" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 ml-1">Комиссия (KZT)</label>
            <input name="commission" type="number" value={formData.commission} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600" placeholder="0" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 ml-1">Доставка (KZT)</label>
            <input name="deliveryCost" type="number" value={formData.deliveryCost} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600" placeholder="0" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 ml-1">ИТОГО (KZT)</label>
            <input name="totalPrice" type="number" value={formData.totalPrice} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600 font-bold text-emerald-400" placeholder="0" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 ml-1">Трек-номер</label>
          <input name="trackNumber" value={formData.trackNumber} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600" placeholder="YT123456789" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 ml-1">Комментарий менеджера (для клиента)</label>
          <textarea name="managerComment" value={formData.managerComment} onChange={handleChange} className="glass-input p-3 rounded-xl w-full text-sm outline-none placeholder:text-gray-600 min-h-[80px]" placeholder="Напишите комментарий..." />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="glow-button mt-2 bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Сохранение...' : 'Сохранить и уведомить'}
        </button>
      </GlassCard>
    </motion.div>
  );
};
