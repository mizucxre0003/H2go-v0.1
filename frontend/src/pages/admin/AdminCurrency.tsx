import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { motion } from 'framer-motion';
import { useTelegram } from '../../hooks/useTelegram';
import { Save, Plus } from 'lucide-react';

interface CurrencyRate {
  currency: string;
  rate: number;
}

export const AdminCurrency: React.FC = () => {
  const { userId } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [newCurrency, setNewCurrency] = useState({ code: '', rate: '' });

  const fetchRates = () => {
    setLoading(true);
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRates(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSave = async (currencyCode: string, currencyRate: string) => {
    if (!userId || !currencyCode || !currencyRate) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: userId, currency: currencyCode.toUpperCase(), rate: currencyRate })
      });
      if (res.ok) {
        setNewCurrency({ code: '', rate: '' });
        fetchRates();
        alert(`Курс ${currencyCode.toUpperCase()} успешно сохранен!`);
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

      <GlassCard className="p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-blue-400">Добавить новую валюту</h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
              placeholder="Код (USD, EUR...)"
              className="glass-input p-3 rounded-xl w-full text-sm outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={newCurrency.rate}
              onChange={(e) => setNewCurrency({ ...newCurrency, rate: e.target.value })}
              placeholder="Курс в KZT"
              className="glass-input p-3 rounded-xl w-full text-sm outline-none transition-all"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave(newCurrency.code, newCurrency.rate)}
          disabled={saving || !newCurrency.code || !newCurrency.rate}
          className="glow-button mt-1 bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus size={20} />
          <span>Добавить</span>
        </button>
      </GlassCard>

      {loading && rates.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Загрузка...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-emerald-400 pl-1">Активные курсы</h2>
          {rates.length === 0 ? (
            <p className="text-gray-400 text-sm pl-1">Нет добавленных валют</p>
          ) : (
            rates.map((r, index) => (
              <motion.div
                key={r.currency}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{r.currency}</span>
                    <span className="text-xs text-gray-400">в Тенге (KZT)</span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      defaultValue={r.rate}
                      id={`rate-${r.currency}`}
                      className="glass-input p-3 rounded-xl w-full text-lg font-bold outline-none flex-grow"
                    />
                    <button
                      onClick={() => {
                        const val = (document.getElementById(`rate-${r.currency}`) as HTMLInputElement)?.value;
                        handleSave(r.currency, val);
                      }}
                      disabled={saving}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-xl transition-colors"
                    >
                      <Save size={20} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
