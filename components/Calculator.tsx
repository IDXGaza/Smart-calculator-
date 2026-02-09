
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleEqual = () => {
    try {
      // استخدام Function كبديل آمن لـ eval
      const result = new Function(`return ${equation + display}`)();
      const formattedResult = Number.isInteger(result) ? result : Number(result.toFixed(8));
      setDisplay(String(formattedResult));
      setEquation('');
    } catch {
      setDisplay('خطأ');
    }
  };

  const buttons = [
    { label: 'AC', onClick: handleClear, className: 'bg-red-100 text-red-700' },
    { label: 'DEL', onClick: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0'), className: 'bg-orange-100 text-orange-700' },
    { label: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), className: 'bg-indigo-50 text-indigo-700' },
    { label: '÷', onClick: () => handleOperator('/'), className: 'bg-blue-600 text-white' },
    
    { label: '7', onClick: () => handleNumber('7'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '8', onClick: () => handleNumber('8'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '9', onClick: () => handleNumber('9'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '×', onClick: () => handleOperator('*'), className: 'bg-blue-600 text-white' },
    
    { label: '4', onClick: () => handleNumber('4'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '5', onClick: () => handleNumber('5'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '6', onClick: () => handleNumber('6'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '-', onClick: () => handleOperator('-'), className: 'bg-blue-600 text-white' },
    
    { label: '1', onClick: () => handleNumber('1'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '2', onClick: () => handleNumber('2'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '3', onClick: () => handleNumber('3'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '+', onClick: () => handleOperator('+'), className: 'bg-blue-600 text-white' },
    
    { label: '0', onClick: () => handleNumber('0'), className: 'bg-white text-gray-900 border border-gray-100 col-span-2' },
    { label: '.', onClick: () => handleNumber('.'), className: 'bg-white text-gray-900 border border-gray-100' },
    { label: '=', onClick: handleEqual, className: 'bg-green-600 text-white font-bold' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-6 border border-gray-100">
      <div className="mb-6 text-right bg-gray-50 p-8 rounded-3xl min-h-[140px] flex flex-col justify-end shadow-inner border border-gray-200/50">
        <div className="text-gray-400 text-sm font-medium mb-1 h-6 tracking-wider">{equation}</div>
        <div className="text-5xl font-bold text-gray-900 break-all leading-tight">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`${btn.className} h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm hover:brightness-95 active:scale-95 transition-all duration-150`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
