import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { projectId } from '../utils/supabase/info';
import { TicketList } from './TicketList';
import { ContactsPage } from './ContactsPage';

export function MasterDashboard() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'contacts'>('tickets');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ category: '', status: '' });
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  const loadTickets = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.category) queryParams.append('category', filter.category);
      if (filter.status) queryParams.append('status', filter.status);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/tickets?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      } else {
        showToast('ОШИБКА ЗАГРУЗКИ ЗАЯВОК');
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'new' || t.status === 'assigned').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    completed: tickets.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="border-4 border-[#00ff00] bg-black shadow-[0_0_20px_rgba(0,255,0,0.3)] mb-6">
        <div className="bg-[#00ff00] text-black p-3">
          <pre className="text-xs md:text-sm text-center">
{`╔═══════════════════════════════════════════════════════════╗
║            РАБОЧЕЕ МЕСТО МАСТЕРА                          ║
╚═══════════════════════════════════════════════════════════╝`}
          </pre>
        </div>

        <div className="border-b-2 border-[#00ff00] flex">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-3 px-4 transition-colors ${
              activeTab === 'tickets'
                ? 'bg-[#00ff00] text-black'
                : 'bg-black text-[#00ff00] hover:bg-[#003300]'
            }`}
          >
            [МОИ ЗАКАЗЫ]
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-3 px-4 transition-colors ${
              activeTab === 'contacts'
                ? 'bg-[#00ff00] text-black'
                : 'bg-black text-[#00ff00] hover:bg-[#003300]'
            }`}
          >
            [КОНТАКТЫ]
          </button>
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'tickets' ? (
            <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="ВСЕГО" value={stats.total} />
            <StatCard label="НОВЫЕ" value={stats.new} color="text-[#ffff00]" />
            <StatCard label="В РАБОТЕ" value={stats.inProgress} color="text-[#00ffff]" />
            <StatCard label="ЗАВЕРШЕНО" value={stats.completed} color="text-[#00ff00]" />
          </div>

          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block mb-2 text-sm">▸ КАТЕГОРИЯ:</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              >
                <option value="">ВСЕ</option>
                <option value="smartphone">СМАРТФОН</option>
                <option value="tablet">ПЛАНШЕТ</option>
                <option value="laptop">НОУТБУК</option>
                <option value="pc">ПК</option>
                <option value="console">КОНСОЛЬ</option>
                <option value="other">ДРУГОЕ</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm">▸ СТАТУС:</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              >
                <option value="">ВСЕ</option>
                <option value="new">НОВАЯ</option>
                <option value="assigned">НАЗНАЧЕНА</option>
                <option value="in_progress">В РАБОТЕ</option>
                <option value="completed">ЗАВЕРШЕНА</option>
                <option value="cancelled">ОТМЕНЕНА</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadTickets}
                className="bg-[#00ff00] text-black px-4 py-2 hover:bg-[#00cc00] transition-colors"
              >
                [ОБНОВИТЬ]
              </button>
            </div>
          </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse text-xl">ЗАГРУЗКА ДАННЫХ...</div>
                </div>
              ) : (
                <TicketList tickets={tickets} onUpdate={loadTickets} />
              )}
            </div>
          ) : (
            <ContactsPage />
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

function StatCard({ label, value, color = 'text-[#00ff00]' }: StatCardProps) {
  return (
    <div className="border-2 border-[#00ff00] p-4 text-center">
      <div className="text-xs opacity-70 mb-2">{label}</div>
      <div className={`text-3xl ${color}`}>{value}</div>
    </div>
  );
}
