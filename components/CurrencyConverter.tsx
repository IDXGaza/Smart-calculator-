
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
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await getCurrencyConversion(from, to, amountNum);
      setResult(res);
    } catch (err) {
      setError('حدث خطأ أثناء جلب البيانات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">محول العملات الذكي</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">المبلغ</label>
          <input
            type="text"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => {
              const val = e.target.value;
              // Allow only numbers and one decimal point
              if (/^\d*\.?\d*$/.test(val)) {
                setAmountStr(val);
              }
            }}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-300"
            placeholder="أدخل المبلغ..."
          />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">من</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={swapCurrencies}
            className="p-4 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition-colors shadow-sm"
            title="تبديل العملات"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">إلى</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-blue-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري جلب السعر...
            </span>
          ) : 'تحويل الآن'}
        </button>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-semibold">{error}</div>}

        {result && !loading && (
          <div className="mt-6 p-6 bg-green-50 rounded-2xl border border-green-100 animate-fadeIn">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-1">{amountStr} {result.from} يساوي</div>
              <div className="text-3xl font-bold text-green-700">{result.result.toLocaleString('ar-SA')} {result.to}</div>
              <div className="text-xs text-gray-400 mt-2">سعر الصرف: 1 {result.from} = {result.rate} {result.to}</div>
              <div className="text-[10px] text-gray-400 mt-1">المصدر: Gemini AI • {result.lastUpdate}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
