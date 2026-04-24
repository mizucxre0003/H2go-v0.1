import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';
import { Save } from 'lucide-react';

export const AdminCurrency: React.FC = () => {
  const { userId } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rate, setRate] = useState('');

  useEffect(() => {
    fetch('/api/admin/rates')
      .then(res => res.json())
      .then(data => {
        const cny = data.find((r: any) => r.currency === 'CNY');
        if (cny) setRate(cny.rate.toString());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!userId || !rate) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: userId, currency: 'CNY', rate })
      });
      if (res.ok) {
        alert('Курс успешно обновлен!');
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Курсы валют</h1>
        <p className="text-gray-400 text-sm">Управление конвертацией в Калькуляторе</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Загрузка...</p>
      ) : (
        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 ml-1">Курс Юаня (1 CNY в KZT)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Например, 65"
              className="glass-input p-3 rounded-xl w-full text-lg font-bold outline-none transition-all placeholder:text-gray-500"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="glow-button mt-4 bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Сохранение...' : 'Сохранить курс'}
          </button>
        </GlassCard>
      )}
    </motion.div>
  );
};
