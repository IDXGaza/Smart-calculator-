
import React, { useState, useMemo } from 'react';
import { CURRENCIES } from '../constants';
import { ConversionResult } from '../types';
import { getCurrencyConversion } from '../services/geminiService';

const CurrencyConverter: React.FC = () => {
  const [amountStr, setAmountStr] = useState<string>('1');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('SAR');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // تصفية العملات بناءً على البحث
  const filteredCurrencies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
    setResult(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
        <span className="p-2 bg-blue-100 rounded-lg">🌍</span>
        المحول الذكي
      </h2>
      
      <div className="space-y-6">
        {/* حقل إدخال المبلغ */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-500 mb-2 mr-1">المبلغ المراد تحويله</label>
          <input
            type="text"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) {
                setAmountStr(val);
              }
            }}
            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl text-2xl font-bold text-gray-900 focus:outline-none transition-all placeholder-gray-300 shadow-sm"
            placeholder="0.00"
          />
        </div>

        {/* شريط البحث عن العملات */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pr-11 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="ابحث عن اسم العملة أو الرمز (مثل: SAR)..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* اختيار العملات */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 mr-1 uppercase">من</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-sm"
            >
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))
              ) : (
                <option disabled>لا توجد نتائج</option>
              )}
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
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-sm"
            >
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))
              ) : (
                <option disabled>لا توجد نتائج</option>
              )}
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
