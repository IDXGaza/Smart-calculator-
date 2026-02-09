
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
      // Use Function constructor instead of eval for better safety
      const result = new Function(`return ${equation + display}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
    } catch {
      setDisplay('خطأ');
    }
  };

  const buttons = [
    { label: 'AC', onClick: handleClear, className: 'bg-red-100 text-red-600' },
    { label: 'DEL', onClick: () => setDisplay(display.slice(0, -1) || '0'), className: 'bg-orange-100 text-orange-600' },
    { label: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), className: 'bg-blue-50 text-blue-600' },
    { label: '÷', onClick: () => handleOperator('/'), className: 'bg-blue-600 text-white' },
    
    { label: '7', onClick: () => handleNumber('7'), className: 'bg-white text-gray-800' },
    { label: '8', onClick: () => handleNumber('8'), className: 'bg-white text-gray-800' },
    { label: '9', onClick: () => handleNumber('9'), className: 'bg-white text-gray-800' },
    { label: '×', onClick: () => handleOperator('*'), className: 'bg-blue-600 text-white' },
    
    { label: '4', onClick: () => handleNumber('4'), className: 'bg-white text-gray-800' },
    { label: '5', onClick: () => handleNumber('5'), className: 'bg-white text-gray-800' },
    { label: '6', onClick: () => handleNumber('6'), className: 'bg-white text-gray-800' },
    { label: '-', onClick: () => handleOperator('-'), className: 'bg-blue-600 text-white' },
    
    { label: '1', onClick: () => handleNumber('1'), className: 'bg-white text-gray-800' },
    { label: '2', onClick: () => handleNumber('2'), className: 'bg-white text-gray-800' },
    { label: '3', onClick: () => handleNumber('3'), className: 'bg-white text-gray-800' },
    { label: '+', onClick: () => handleOperator('+'), className: 'bg-blue-600 text-white' },
    
    { label: '0', onClick: () => handleNumber('0'), className: 'bg-white text-gray-800 col-span-2' },
    { label: '.', onClick: () => handleNumber('.'), className: 'bg-white text-gray-800' },
    { label: '=', onClick: handleEqual, className: 'bg-green-600 text-white font-bold' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-gray-100">
      <div className="mb-6 text-right bg-gray-100 p-6 rounded-2xl min-h-[120px] flex flex-col justify-end">
        <div className="text-gray-400 text-sm mb-1 h-6">{equation}</div>
        <div className="text-4xl font-bold text-gray-900 break-all">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`${btn.className} h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm hover:brightness-95 active:scale-95 transition-all`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
