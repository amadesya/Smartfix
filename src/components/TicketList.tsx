import React, { useState } from 'react';
import { TicketDetails } from './TicketDetails';

interface TicketListProps {
  tickets: any[];
  onUpdate: () => void;
}

export function TicketList({ tickets, onUpdate }: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const statusLabels: Record<string, string> = {
    new: 'НОВАЯ',
    assigned: 'НАЗНАЧЕНА',
    in_progress: 'В РАБОТЕ',
    completed: 'ЗАВЕРШЕНА',
    cancelled: 'ОТМЕНЕНА',
  };

  const statusColors: Record<string, string> = {
    new: 'text-[#00ff00]',
    assigned: 'text-[#ffff00]',
    in_progress: 'text-[#00ffff]',
    completed: 'text-[#00ff00]',
    cancelled: 'text-[#ff0000]',
  };

  const deviceLabels: Record<string, string> = {
    smartphone: 'СМАРТФОН',
    tablet: 'ПЛАНШЕТ',
    laptop: 'НОУТБУК',
    pc: 'ПК',
    console: 'КОНСОЛЬ',
    other: 'ДРУГОЕ',
  };

  if (selectedTicket) {
    return (
      <TicketDetails
        ticket={selectedTicket}
        onBack={() => {
          setSelectedTicket(null);
          onUpdate();
        }}
        onUpdate={onUpdate}
      />
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="border-2 border-[#00ff00] p-8 text-center">
        <div className="text-xl mb-2">[ НЕТ ЗАЯВОК ]</div>
        <div className="text-sm opacity-70">СОЗДАЙТЕ СВОЮ ПЕРВУЮ ЗАЯВКУ</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="border-2 border-[#00ff00] p-4 hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] transition-shadow cursor-pointer"
          onClick={() => setSelectedTicket(ticket)}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">▸</span>
              <span className="text-lg">{ticket.ticketNumber}</span>
            </div>
            <div className={`${statusColors[ticket.status] || 'text-[#00ff00]'} border-2 px-3 py-1 text-sm`}>
              [{statusLabels[ticket.status] || ticket.status.toUpperCase()}]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="opacity-70">УСТРОЙСТВО:</span>{' '}
              <span>{deviceLabels[ticket.deviceType] || ticket.deviceType}</span>
            </div>
            <div>
              <span className="opacity-70">МОДЕЛЬ:</span>{' '}
              <span>{ticket.brand} {ticket.model}</span>
            </div>
            <div>
              <span className="opacity-70">СОЗДАНА:</span>{' '}
              <span>{new Date(ticket.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            <div>
              <span className="opacity-70">ОБНОВЛЕНА:</span>{' '}
              <span>{new Date(ticket.updatedAt).toLocaleString('ru-RU')}</span>
            </div>
          </div>

          {ticket.problem && (
            <div className="mt-3 pt-3 border-t border-[#006600]">
              <div className="text-sm opacity-70 mb-1">ПРОБЛЕМА:</div>
              <div className="text-sm line-clamp-2">{ticket.problem}</div>
            </div>
          )}

          <div className="mt-3 text-xs opacity-50 text-right">
            [НАЖМИТЕ ДЛЯ ПОДРОБНОСТЕЙ] →
          </div>
        </div>
      ))}
    </div>
  );
}
