import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';

export const Support: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Служба поддержки</h1>
        <p className="text-gray-400 text-sm">Мы всегда рады помочь вам</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400 text-center py-8">Загрузка...</p>
        ) : (
          <>
            <GlassCard className="p-5 flex flex-col gap-2">
              <span className="font-semibold text-lg text-blue-400">Telegram</span>
              <p className="text-sm text-gray-300">Быстрая связь с нашим менеджером:</p>
              <a 
                href={settings.support_telegram || 'https://t.me/h2go_support'} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 text-center py-2 bg-blue-500/20 text-blue-400 font-medium rounded-lg border border-blue-500/30"
              >
                Написать в Telegram
              </a>
            </GlassCard>

            {settings.support_whatsapp && (
              <GlassCard className="p-5 flex flex-col gap-2">
                <span className="font-semibold text-lg text-emerald-400">WhatsApp</span>
                <p className="text-sm text-gray-300">Напишите нам в WhatsApp:</p>
                <a 
                  href={settings.support_whatsapp} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-2 text-center py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg border border-emerald-500/30"
                >
                  Написать в WhatsApp
                </a>
              </GlassCard>
            )}

            {settings.support_phone && (
              <GlassCard className="p-5 flex flex-col gap-2">
                <span className="font-semibold text-lg text-pink-400">Телефон</span>
                <p className="text-sm text-gray-300">Звонки принимаются в рабочее время:</p>
                <a 
                  href={`tel:${settings.support_phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-2 text-center py-2 bg-pink-500/20 text-pink-400 font-medium rounded-lg border border-pink-500/30"
                >
                  {settings.support_phone}
                </a>
              </GlassCard>
            )}

            {!settings.support_telegram && !settings.support_whatsapp && !settings.support_phone && (
              <div className="text-center py-8 px-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Контактные данные пока не добавлены администратором.</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
