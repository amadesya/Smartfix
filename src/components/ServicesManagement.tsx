import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { projectId } from '../utils/supabase/info';

export function ServicesManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/services`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      } else {
        showToast('ОШИБКА ЗАГРУЗКИ УСЛУГ');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingService
        ? `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/services/${editingService.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/services`;

      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        showToast(editingService ? 'УСЛУГА ОБНОВЛЕНА' : 'УСЛУГА СОЗДАНА');
        setFormData({ name: '', description: '', price: '', category: '' });
        setEditingService(null);
        setShowForm(false);
        loadServices();
      } else {
        showToast('ОШИБКА СОХРАНЕНИЯ УСЛУГИ');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      category: service.category || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('УДАЛИТЬ УСЛУГУ?')) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/services/${serviceId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        showToast('УСЛУГА УДАЛЕНА');
        loadServices();
      } else {
        showToast('ОШИБКА УДАЛЕНИЯ');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: '', category: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xl">▸ УПРАВЛЕНИЕ УСЛУГАМИ</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#00ff00] text-black px-4 py-2 hover:bg-[#00cc00] transition-colors"
        >
          {showForm ? '[ОТМЕНА]' : '[ДОБАВИТЬ УСЛУГУ]'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border-2 border-[#00ff00] p-4 space-y-4">
          <div className="text-sm opacity-70 mb-2">
            {editingService ? '▸ РЕДАКТИРОВАНИЕ УСЛУГИ' : '▸ НОВАЯ УСЛУГА'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">▸ НАЗВАНИЕ:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">▸ ЦЕНА (РУБ):</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                step="0.01"
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ КАТЕГОРИЯ:</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            >
              <option value="">НЕ УКАЗАНО</option>
              <option value="repair">РЕМОНТ</option>
              <option value="diagnostics">ДИАГНОСТИКА</option>
              <option value="replacement">ЗАМЕНА ДЕТАЛЕЙ</option>
              <option value="software">ПО</option>
              <option value="other">ПРОЧЕЕ</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ ОПИСАНИЕ:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#00ff00] text-black py-2 px-4 hover:bg-[#00cc00] transition-colors disabled:opacity-50"
            >
              {loading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
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
      ) : services.length === 0 ? (
        <div className="border-2 border-[#00ff00] p-8 text-center">
          <div className="text-xl mb-2">[ НЕТ УСЛУГ ]</div>
          <div className="text-sm opacity-70">ДОБАВЬТЕ ПЕРВУЮ УСЛУГУ</div>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="border-2 border-[#00ff00] p-4 hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <div className="text-lg mb-1">
                    <span className="text-xl">▸</span> {service.name}
                  </div>
                  {service.description && (
                    <div className="text-sm opacity-70 mb-2">{service.description}</div>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-[#00ff00]">ЦЕНА: {service.price} РУБ.</span>
                    {service.category && (
                      <span className="opacity-70">КАТЕГОРИЯ: {service.category.toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-[#00ff00] text-black px-3 py-1 hover:bg-[#00cc00] transition-colors"
                  >
                    [РЕДАКТИРОВАТЬ]
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-black text-[#ff0000] border-2 border-[#ff0000] px-3 py-1 hover:bg-[#330000] transition-colors"
                  >
                    [УДАЛИТЬ]
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
