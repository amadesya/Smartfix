import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { projectId } from '../utils/supabase/info';

interface TicketDetailsProps {
  ticket: any;
  onBack: () => void;
  onUpdate: () => void;
}

export function TicketDetails({ ticket, onBack, onUpdate }: TicketDetailsProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { accessToken, profile } = useAuth();
  const { showToast } = useToast();

  const statusLabels: Record<string, string> = {
    new: 'НОВАЯ',
    assigned: 'НАЗНАЧЕНА',
    in_progress: 'В РАБОТЕ',
    completed: 'ЗАВЕРШЕНА',
    cancelled: 'ОТМЕНЕНА',
  };

  const deviceLabels: Record<string, string> = {
    smartphone: 'СМАРТФОН',
    tablet: 'ПЛАНШЕТ',
    laptop: 'НОУТБУК',
    pc: 'ПК',
    console: 'КОНСОЛЬ',
    other: 'ДРУГОЕ',
  };

  const urgencyLabels: Record<string, string> = {
    low: 'НИЗКАЯ',
    normal: 'ОБЫЧНАЯ',
    high: 'ВЫСОКАЯ',
    urgent: 'СРОЧНАЯ',
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/tickets/${ticket.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ text: comment }),
        }
      );

      if (response.ok) {
        showToast('КОММЕНТАРИЙ ДОБАВЛЕН');
        setComment('');
        onUpdate();
      } else {
        showToast('ОШИБКА ДОБАВЛЕНИЯ КОММЕНТАРИЯ');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/tickets/${ticket.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        showToast('СТАТУС ОБНОВЛЕН');
        onUpdate();
      } else {
        showToast('ОШИБКА ОБНОВЛЕНИЯ СТАТУСА');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const canChangeStatus = profile?.role === 'master' || profile?.role === 'admin';

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="bg-black text-[#00ff00] border-2 border-[#00ff00] px-4 py-2 hover:bg-[#003300] transition-colors"
      >
        ← [НАЗАД]
      </button>

      <div className="border-2 border-[#00ff00] p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
          <div className="text-xl">
            <span className="text-2xl">▸</span> {ticket.ticketNumber}
          </div>
          <div className="text-[#00ff00] border-2 border-[#00ff00] px-3 py-1">
            [{statusLabels[ticket.status] || ticket.status.toUpperCase()}]
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="border border-[#006600] p-3">
            <div className="mb-2 opacity-70">┌─ УСТРОЙСТВО ─────────┐</div>
            <div className="space-y-1 pl-2">
              <div><span className="opacity-70">ТИП:</span> {deviceLabels[ticket.deviceType] || ticket.deviceType}</div>
              <div><span className="opacity-70">БРЕНД:</span> {ticket.brand}</div>
              <div><span className="opacity-70">МОДЕЛЬ:</span> {ticket.model}</div>
            </div>
            <div className="mt-2 opacity-70">└──────────────────────┘</div>
          </div>

          <div className="border border-[#006600] p-3">
            <div className="mb-2 opacity-70">┌─ ИНФОРМАЦИЯ ─────────┐</div>
            <div className="space-y-1 pl-2">
              <div><span className="opacity-70">СРОЧНОСТЬ:</span> {urgencyLabels[ticket.urgency] || ticket.urgency}</div>
              <div><span className="opacity-70">СОЗДАНА:</span> {new Date(ticket.createdAt).toLocaleString('ru-RU')}</div>
              <div><span className="opacity-70">ОБНОВЛЕНА:</span> {new Date(ticket.updatedAt).toLocaleString('ru-RU')}</div>
            </div>
            <div className="mt-2 opacity-70">└──────────────────────┘</div>
          </div>
        </div>

        <div className="border-t-2 border-[#00ff00] pt-4 mb-4">
          <div className="text-sm opacity-70 mb-2">▸ ОПИСАНИЕ ПРОБЛЕМЫ:</div>
          <div className="bg-black border border-[#006600] p-3">
            {ticket.problem}
          </div>
        </div>

        {canChangeStatus && (
          <div className="border-t-2 border-[#00ff00] pt-4 mb-4">
            <div className="text-sm opacity-70 mb-2">▸ ИЗМЕНИТЬ СТАТУС:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusLabels).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={loading || ticket.status === status}
                  className={`px-3 py-1 border-2 transition-colors ${
                    ticket.status === status
                      ? 'bg-[#00ff00] text-black border-[#00ff00]'
                      : 'bg-black text-[#00ff00] border-[#006600] hover:border-[#00ff00]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  [{label}]
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t-2 border-[#00ff00] pt-4">
          <div className="text-sm opacity-70 mb-2">▸ КОММЕНТАРИИ:</div>
          
          {ticket.comments && ticket.comments.length > 0 ? (
            <div className="space-y-2 mb-4">
              {ticket.comments.map((c: any) => (
                <div key={c.id} className="border border-[#006600] p-3">
                  <div className="flex justify-between items-start mb-2 text-xs opacity-70">
                    <span>{c.userName}</span>
                    <span>{new Date(c.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="text-sm">{c.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm opacity-50 mb-4 text-center p-4 border border-[#006600]">
              [ КОММЕНТАРИЕВ НЕТ ]
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ВВЕДИТЕ КОММЕНТАРИЙ..."
              className="flex-1 bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !comment.trim()}
              className="bg-[#00ff00] text-black px-4 py-2 hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              [ДОБАВИТЬ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
