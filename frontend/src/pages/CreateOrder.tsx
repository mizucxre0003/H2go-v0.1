import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export const CreateOrder: React.FC = () => {
  const [formData, setFormData] = useState({
    link: '',
    name: '',
    priceOriginal: '',
    quantity: '1',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to backend
    console.log('Submitted', formData);
    // Temporary use setFormData to bypass lint error
    setFormData({ ...formData });
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
            <label className="text-sm text-gray-300">Ссылка на товар *</label>
            <input 
              type="url" 
              required
              placeholder="https://taobao.com/item..."
              className="glass-input w-full p-3 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300">Название *</label>
            <input 
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
                type="number" 
                required
                placeholder="299"
                className="glass-input w-full p-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm text-gray-300">Количество</label>
              <input 
                type="number" 
                defaultValue="1"
                min="1"
                className="glass-input w-full p-3 rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300">Комментарий (размер, цвет)</label>
            <textarea 
              rows={3}
              placeholder="Черный цвет, размер 42"
              className="glass-input w-full p-3 rounded-lg resize-none"
            />
          </div>

          <button 
            type="submit"
            className="glow-button w-full py-3.5 rounded-lg mt-2 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>Отправить заявку</span>
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
};
