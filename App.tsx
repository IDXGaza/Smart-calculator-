
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import CurrencyConverter from './components/CurrencyConverter';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CALCULATOR);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">الحاسبة والعملات</h1>
        <p className="text-gray-500">أداة واحدة لكل احتياجاتك المالية</p>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm mb-8 flex gap-1 border border-gray-200 w-full max-w-sm">
        <button
          onClick={() => setActiveTab(AppTab.CALCULATOR)}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === AppTab.CALCULATOR
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14v4"/><path d="M8 14v4"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
            الحاسبة
          </span>
        </button>
        <button
          onClick={() => setActiveTab(AppTab.CONVERTER)}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeTab === AppTab.CONVERTER
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M17 12H7"/></svg>
            العملات
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="w-full flex justify-center items-start">
        {activeTab === AppTab.CALCULATOR ? (
          <div className="w-full animate-fadeIn"><Calculator /></div>
        ) : (
          <div className="w-full animate-fadeIn"><CurrencyConverter /></div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} الحاسبة الذكية • مدعوم بـ Gemini AI
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
