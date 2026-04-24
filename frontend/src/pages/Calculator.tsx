import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { motion } from 'framer-motion';

export const Calculator: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('CNY');
  
  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRates(data);
          // If CNY exists, use it as default, otherwise pick the first one
          if (!data.find(r => r.currency === 'CNY') && data.length > 0) {
            setSelectedCurrency(data[0].currency);
          }
        }
      })
      .catch(console.error);
  }, []);
  
  const currentRateObj = rates.find(r => r.currency === selectedCurrency);
  const currentRate = currentRateObj ? currentRateObj.rate : 0;
  const total = parseFloat(amount || '0') * currentRate;

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
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 flex-grow">
            <label className="text-sm text-gray-300">Сумма</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-input w-full p-3 text-xl font-bold rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <label className="text-sm text-gray-300">Валюта</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="glass-input w-full p-3 text-xl font-bold rounded-lg appearance-none bg-[#1A1A2E]"
            >
              {rates.length > 0 ? (
                rates.map(r => (
                  <option key={r.currency} value={r.currency}>{r.currency}</option>
                ))
              ) : (
                <option value="CNY">CNY</option>
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-gray-400">Внутренний курс (1 {selectedCurrency})</span>
          <span className="font-medium text-blue-400">{currentRate} ₸</span>
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
