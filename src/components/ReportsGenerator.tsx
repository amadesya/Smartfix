import React, { useState } from 'react';
import { useToast } from './Toast';
import { projectId } from '../utils/supabase/info';
import { useAuth } from './AuthContext';

interface ReportsGeneratorProps {
  tickets: any[];
}

export function ReportsGenerator({ tickets }: ReportsGeneratorProps) {
  const [reportType, setReportType] = useState<'completed' | 'current' | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const { showToast } = useToast();
  const { accessToken } = useAuth();

  const statusLabels: Record<string, string> = {
    new: 'НОВАЯ',
    assigned: 'НАЗНАЧЕНА',
    in_progress: 'В РАБОТЕ',
    completed: 'ЗАВЕРШЕНА',
    cancelled: 'ОТМЕНЕНА',
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Filter by type
    if (reportType === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    } else if (reportType === 'current') {
      filtered = filtered.filter(t => 
        t.status === 'new' || t.status === 'assigned' || t.status === 'in_progress'
      );
    }

    // Filter by date
    if (dateFrom) {
      filtered = filtered.filter(t => 
        new Date(t.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(t => 
        new Date(t.createdAt) <= new Date(dateTo)
      );
    }

    return filtered;
  };

  const generatePDF = async () => {
    try {
      setGenerating(true);
      const filteredTickets = filterTickets();

      if (filteredTickets.length === 0) {
        showToast('НЕТ ДАННЫХ ДЛЯ ОТЧЕТА');
        setGenerating(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/generate-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            tickets: filteredTickets,
            reportType,
            dateFrom,
            dateTo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('ОТЧЁТ СФОРМИРОВАН');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('ОШИБКА СОЗДАНИЯ ОТЧЁТА');
    } finally {
      setGenerating(false);
    }
  };

  const filteredTickets = filterTickets();

  return (
    <div className="space-y-4">
      <div className="text-xl mb-4">▸ ФОРМИРОВАНИЕ ОТЧЁТОВ</div>

      <div className="border-2 border-[#00ff00] p-4 space-y-4">
        <div className="text-sm opacity-70 mb-2">▸ ПАРАМЕТРЫ ОТЧЁТА</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm">▸ ТИП ОТЧЁТА:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            >
              <option value="all">ВСЕ ЗАЯВКИ</option>
              <option value="completed">ЗАВЕРШЁННЫЕ</option>
              <option value="current">ТЕКУЩИЕ</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ ДАТА ОТ:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ ДАТА ДО:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            />
          </div>
        </div>

        <div className="border-t-2 border-[#00ff00] pt-4">
          <div className="text-sm opacity-70 mb-2">▸ ПРЕДПРОСМОТР</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <StatBox label="ВСЕГО" value={filteredTickets.length} />
            <StatBox 
              label="НОВЫЕ" 
              value={filteredTickets.filter(t => t.status === 'new').length} 
            />
            <StatBox 
              label="НАЗНАЧЕНО" 
              value={filteredTickets.filter(t => t.status === 'assigned').length} 
            />
            <StatBox 
              label="В РАБОТЕ" 
              value={filteredTickets.filter(t => t.status === 'in_progress').length} 
            />
            <StatBox 
              label="ЗАВЕРШЕНО" 
              value={filteredTickets.filter(t => t.status === 'completed').length} 
            />
          </div>
        </div>

        <button
          onClick={generatePDF}
          disabled={generating}
          className="w-full bg-[#00ff00] text-black py-3 px-6 hover:bg-[#00cc00] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>▶</span>
          <span>{generating ? 'ГЕНЕРАЦИЯ...' : 'СФОРМИРОВАТЬ ОТЧЁТ В PDF'}</span>
          <span>◀</span>
        </button>
      </div>

      <div className="border border-[#006600] p-4 text-xs opacity-70">
        <div className="mb-2">⚠ ИНФОРМАЦИЯ:</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Отчёт формируется на основе текущих данных системы</li>
          <li>Можно фильтровать по типу заявок и периоду</li>
          <li>PDF файл автоматически загрузится после генерации</li>
          <li>В отчёте используется латиница из-за ограничений PDF</li>
        </ul>
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="border border-[#006600] p-3 text-center">
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <div className="text-xl text-[#00ff00]">{value}</div>
    </div>
  );
}
