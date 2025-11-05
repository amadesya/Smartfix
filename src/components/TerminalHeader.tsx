import React from 'react';

export function TerminalHeader() {
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-[#00ff00] text-black p-2 md:p-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 border-2 border-black"></div>
            <div className="w-3 h-3 bg-black"></div>
            <div className="w-3 h-3 border-2 border-black"></div>
          </div>
          <span className="text-sm md:text-base">
            ═══ REPAIR SERVICE CENTER TERMINAL ═══
          </span>
        </div>
        <div className="text-xs md:text-sm">
          DATE: {currentDate}
        </div>
      </div>
    </div>
  );
}
