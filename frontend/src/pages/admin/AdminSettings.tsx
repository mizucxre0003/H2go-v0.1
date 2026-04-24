import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';
import { Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { userId } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    support_telegram: '',
    support_whatsapp: '',
    support_phone: ''
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setFormData({
          support_telegram: data.support_telegram || '',
          support_whatsapp: data.support_whatsapp || '',
          support_phone: data.support_phone || ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: userId, settings: formData })
      });
      if (res.ok) {
        alert('Настройки успешно сохранены!');
      } else {
        alert('Ошибка при сохранении (проверьте ваши права)');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Настройки</h1>
        <p className="text-gray-400 text-sm">Контакты службы поддержки</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Загрузка...</p>
      ) : (
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 ml-1">Telegram (ссылка на аккаунт)</label>
            <input
              name="support_telegram"
              value={formData.support_telegram}
              onChange={handleChange}
              placeholder="https://t.me/username"
              className="glass-input p-3 rounded-xl w-full text-sm outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 ml-1">WhatsApp (ссылка)</label>
            <input
              name="support_whatsapp"
              value={formData.support_whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/79001234567"
              className="glass-input p-3 rounded-xl w-full text-sm outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 ml-1">Телефон (для звонков)</label>
            <input
              name="support_phone"
              value={formData.support_phone}
              onChange={handleChange}
              placeholder="+7 (900) 123-45-67"
              className="glass-input p-3 rounded-xl w-full text-sm outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="glow-button mt-4 bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </GlassCard>
      )}
    </motion.div>
  );
};
