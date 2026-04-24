import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

export const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useTelegram();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    link: '',
    name: '',
    priceOriginal: '',
    quantity: '1',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Ошибка: Не удалось определить пользователя Telegram.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: userId,
          link: formData.link,
          name: formData.name,
          priceOriginal: formData.priceOriginal,
          quantity: parseInt(formData.quantity) || 1,
          description: formData.description,
          currency: 'CNY' // По умолчанию юани
        })
      });

      if (res.ok) {
        alert('Заявка успешно создана!');
        navigate('/orders');
      } else {
        alert('Ошибка при создании заявки');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при соединении с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Новая заявка</h1>
        <p className="text-gray-400 text-sm">Заполните данные о товаре</p>
      </div>

      <GlassCard className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300">Ссылка на товар (необязательно)</label>
            <input 
              name="link"
              value={formData.link}
              onChange={handleChange}
              type="url" 
              placeholder="https://taobao.com/item..."
              className="glass-input w-full p-3 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300">Название *</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text" 
              required
              placeholder="Кроссовки Nike"
              className="glass-input w-full p-3 rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm text-gray-300">Цена (юань) *</label>
              <input 
                name="priceOriginal"
                value={formData.priceOriginal}
                onChange={handleChange}
                type="number" 
                required
                placeholder="299"
                className="glass-input w-full p-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm text-gray-300">Количество</label>
              <input 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number" 
                min="1"
                className="glass-input w-full p-3 rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300">Комментарий (размер, цвет)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Черный цвет, размер 42"
              className="glass-input w-full p-3 rounded-lg resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="glow-button w-full py-3.5 rounded-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
            <span>{loading ? 'Отправка...' : 'Отправить заявку'}</span>
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
};
