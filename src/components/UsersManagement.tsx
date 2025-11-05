import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [masters, setMasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'master',
  });
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/users`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setMasters(data.users.filter((u: any) => u.role === 'master'));
      } else {
        showToast('ОШИБКА ЗАГРУЗКИ ПОЛЬЗОВАТЕЛЕЙ');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        showToast('ПОЛЬЗОВАТЕЛЬ СОЗДАН');
        setFormData({ email: '', password: '', name: '', role: 'master' });
        setShowForm(false);
        loadUsers();
      } else {
        const error = await response.json();
        showToast(`ОШИБКА: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/users/${userId}/block`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ blocked }),
        }
      );

      if (response.ok) {
        showToast(blocked ? 'ПОЛЬЗОВАТЕЛЬ ЗАБЛОКИРОВАН' : 'ПОЛЬЗОВАТЕЛЬ РАЗБЛОКИРОВАН');
        loadUsers();
      } else {
        showToast('ОШИБКА ОБНОВЛЕНИЯ');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels: Record<string, string> = {
    client: 'КЛИЕНТ',
    master: 'МАСТЕР',
    admin: 'АДМИНИСТРАТОР',
  };

  const roleColors: Record<string, string> = {
    client: 'text-[#00ff00]',
    master: 'text-[#ffff00]',
    admin: 'text-[#ff00ff]',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xl">▸ УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00ff00] text-black px-4 py-2 hover:bg-[#00cc00] transition-colors"
        >
          {showForm ? '[ОТМЕНА]' : '[ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ]'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border-2 border-[#00ff00] p-4 space-y-4">
          <div className="text-sm opacity-70 mb-2">▸ НОВЫЙ ПОЛЬЗОВАТЕЛЬ</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">▸ ИМЯ:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">▸ EMAIL:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">▸ ПАРОЛЬ:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">▸ РОЛЬ:</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              >
                <option value="client">КЛИЕНТ</option>
                <option value="master">МАСТЕР</option>
                <option value="admin">АДМИНИСТРАТОР</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#00ff00] text-black py-2 px-4 hover:bg-[#00cc00] transition-colors disabled:opacity-50"
            >
              {loading ? 'СОЗДАНИЕ...' : 'СОЗДАТЬ'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-black text-[#00ff00] border-2 border-[#00ff00] py-2 px-4 hover:bg-[#003300] transition-colors"
            >
              ОТМЕНА
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-xl">ЗАГРУЗКА...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="border-2 border-[#00ff00] p-8 text-center">
          <div className="text-xl mb-2">[ НЕТ ПОЛЬЗОВАТЕЛЕЙ ]</div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`border-2 p-4 transition-shadow ${
                user.blocked
                  ? 'border-[#ff0000] opacity-50'
                  : 'border-[#00ff00] hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">▸</span>
                    <span className="text-lg">{user.name || user.email}</span>
                    {user.blocked && (
                      <span className="text-[#ff0000] text-xs border border-[#ff0000] px-2 py-1">
                        [ЗАБЛОКИРОВАН]
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="opacity-70">EMAIL:</span> {user.email}
                    </div>
                    <div>
                      <span className="opacity-70">РОЛЬ:</span>{' '}
                      <span className={roleColors[user.role] || 'text-[#00ff00]'}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70">СОЗДАН:</span>{' '}
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>

                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleBlockUser(user.id, !user.blocked)}
                    className={`px-3 py-1 border-2 transition-colors ${
                      user.blocked
                        ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-[#00cc00]'
                        : 'bg-black text-[#ff0000] border-[#ff0000] hover:bg-[#330000]'
                    }`}
                  >
                    {user.blocked ? '[РАЗБЛОКИРОВАТЬ]' : '[ЗАБЛОКИРОВАТЬ]'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
