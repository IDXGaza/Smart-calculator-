
import React, { useState } from 'react';
import { CURRENCIES } from '../constants';
import { ConversionResult } from '../types';
import { getCurrencyConversion } from '../services/geminiService';

const CurrencyConverter: React.FC = () => {
  const [amountStr, setAmountStr] = useState<string>('1');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('SAR');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('يرجى إدخال مبلغ صحيح أكبر من صفر');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await getCurrencyConversion(from, to, amountNum);
      setResult(res);
    } catch (err) {
      setError('عذراً، فشل الاتصال بالخدمة الذكية. حاول لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setResult(null); // مسح النتيجة السابقة عند التغيير
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
        <span className="p-2 bg-blue-100 rounded-lg">🌍</span>
        المحول الذكي
      </h2>
      
      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-500 mb-2 mr-1">المبلغ المراد تحويله</label>
          <input
            type="text"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => {
              const val = e.target.value;
              // يسمح فقط بالأرقام ونقطة عشرية واحدة
              if (/^\d*\.?\d*$/.test(val)) {
                setAmountStr(val);
              }
            }}
            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl text-2xl font-bold text-gray-900 focus:outline-none transition-all placeholder-gray-300 shadow-sm"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 mr-1 uppercase">من</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={swapCurrencies}
            className="mt-6 p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
            title="تبديل"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          </button>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 mr-1 uppercase">إلى</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={loading || !amountStr}
          className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 mt-4 shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحديث...
            </>
          ) : 'احسب الآن'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border border-green-100 shadow-sm animate-fadeIn relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-tighter">النتيجة التقريبية</div>
              <div className="text-4xl font-black text-green-800 mb-3">
                {result.result.toLocaleString('ar-SA', { maximumFractionDigits: 2 })}
                <span className="text-lg font-bold mr-2 text-green-600">{result.to}</span>
              </div>
              <div className="inline-block px-3 py-1 bg-white/50 rounded-full text-[11px] text-gray-500 font-medium">
                1 {result.from} = {result.rate.toFixed(4)} {result.to}
              </div>
              <p className="text-[10px] text-gray-400 mt-4">بواسطة ذكاء Gemini • {result.lastUpdate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
