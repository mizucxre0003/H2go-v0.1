import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';

export const Calculator: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const rate = 68.5; // Dummy rate
  
  const total = parseFloat(amount || '0') * rate;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h1 className="text-2xl font-bold mb-1">Калькулятор</h1>
        <p className="text-gray-400 text-sm">Предварительный расчет стоимости</p>
      </div>

      <GlassCard className="p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Сумма в юанях (CNY)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-400">¥</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-input w-full p-3 pl-10 text-xl font-bold rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-gray-400">Внутренний курс</span>
          <span className="font-medium text-blue-400">{rate} ₸</span>
        </div>

        <div className="h-[1px] bg-white/10 w-full my-2"></div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400 text-center">Ориентировочная стоимость</span>
          <div className="text-4xl font-bold text-center glow-text text-blue-400">
            {total.toLocaleString('ru-RU')} ₸
          </div>
        </div>
        
        <p className="text-[10px] text-gray-500 text-center mt-2">
          * Расчет предварительный. Не включает стоимость доставки и комиссию.
        </p>
      </GlassCard>
    </motion.div>
  );
};
