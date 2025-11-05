import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';
import { projectId } from '../utils/supabase/info';

interface TicketFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function TicketForm({ onSuccess, initialData }: TicketFormProps) {
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    problem: '',
    urgency: 'normal',
    serviceId: '',
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  // States for tracking "other" selections
  const [brandSelect, setBrandSelect] = useState('');
  const [modelSelect, setModelSelect] = useState('');
  const [problemSelect, setProblemSelect] = useState('');

  useEffect(() => {
    loadServices();
    if (initialData) {
      setFormData({
        deviceType: initialData.deviceType || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        problem: initialData.problem || '',
        urgency: initialData.urgency || 'normal',
        serviceId: initialData.serviceId || '',
      });
    }
  }, [initialData]);

  const loadServices = async () => {
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
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        showToast('ОШИБКА СОЗДАНИЯ ЗАЯВКИ');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      showToast('ОШИБКА СОЕДИНЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBrandSelect(value);
    if (value !== 'other') {
      setFormData({ ...formData, brand: value });
    } else {
      setFormData({ ...formData, brand: '' });
    }
  };

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModelSelect(value);
    if (value !== 'other') {
      setFormData({ ...formData, model: value });
    } else {
      setFormData({ ...formData, model: '' });
    }
  };

  const handleProblemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProblemSelect(value);
    if (value !== 'other') {
      setFormData({ ...formData, problem: value });
    } else {
      setFormData({ ...formData, problem: '' });
    }
  };

  // Brand options based on device type
  const getBrandOptions = () => {
    const brands: Record<string, string[]> = {
      smartphone: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google', 'Realme', 'Oppo'],
      tablet: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Microsoft'],
      laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'],
      pc: ['Custom Build', 'Dell', 'HP', 'Lenovo', 'Asus'],
      console: ['Sony PlayStation', 'Microsoft Xbox', 'Nintendo Switch'],
      other: [],
    };
    return brands[formData.deviceType] || [];
  };

  // Common problems based on device type
  const getProblemOptions = () => {
    const problems: Record<string, string[]> = {
      smartphone: [
        'Не включается',
        'Разбит экран',
        'Не заряжается',
        'Проблемы с батареей',
        'Не работает камера',
        'Нет звука',
        'Проблемы с сенсором',
        'Попала влага',
      ],
      tablet: [
        'Не включается',
        'Разбит экран',
        'Не заряжается',
        'Проблемы с батареей',
        'Не работает Wi-Fi',
        'Не работает сенсор',
      ],
      laptop: [
        'Не включается',
        'Разбит экран',
        'Не заряжается',
        'Перегревается',
        'Не работает клавиатура',
        'Не работает тачпад',
        'Медленно работает',
        'Попала влага',
      ],
      pc: [
        'Не включается',
        'Нет изображения',
        'Медленно работает',
        'Шумит/перегревается',
        'Не работает USB',
        'Синий экран смерти',
      ],
      console: [
        'Не включается',
        'Нет изображения',
        'Не читает диски',
        'Проблемы с джойстиком',
        'Перегревается',
        'Шумит',
      ],
      other: [],
    };
    return problems[formData.deviceType] || [];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-[#00ff00] p-4">
        <div className="mb-4 text-xs">
          ┌─ ИНФОРМАЦИЯ ОБ УСТРОЙСТВЕ ─────────────────────┐
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm">▸ ТИП УСТРОЙСТВА:</label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={(e) => {
                handleChange(e);
                setBrandSelect('');
                setModelSelect('');
                setProblemSelect('');
              }}
              required
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            >
              <option value="">ВЫБЕРИТЕ...</option>
              <option value="smartphone">СМАРТФОН</option>
              <option value="tablet">ПЛАНШЕТ</option>
              <option value="laptop">НОУТБУК</option>
              <option value="pc">ПК</option>
              <option value="console">ИГРОВАЯ КОНСОЛЬ</option>
              <option value="other">ДРУГОЕ</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ БРЕНД:</label>
            {formData.deviceType && getBrandOptions().length > 0 ? (
              <>
                <select
                  value={brandSelect}
                  onChange={handleBrandSelect}
                  required={brandSelect !== 'other'}
                  className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] mb-2"
                >
                  <option value="">ВЫБЕРИТЕ...</option>
                  {getBrandOptions().map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                  <option value="other">ДРУГОЕ</option>
                </select>
                {brandSelect === 'other' && (
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    placeholder="ВВЕДИТЕ БРЕНД..."
                    className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="ВВЕДИТЕ БРЕНД..."
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
              />
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm">▸ МОДЕЛЬ:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="ВВЕДИТЕ МОДЕЛЬ..."
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
            />
          </div>
        </div>

        <div className="mt-4 text-xs">
          └────────────────────────────────────────────────┘
        </div>
      </div>

      {services.length > 0 && (
        <div>
          <label className="block mb-2 text-sm">▸ УСЛУГА:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
          >
            <option value="">НЕ ВЫБРАНО</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} РУБ.
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="border border-[#00ff00] p-4">
        <label className="block mb-2 text-sm">▸ ОПИСАНИЕ ПРОБЛЕМЫ:</label>
        {formData.deviceType && getProblemOptions().length > 0 ? (
          <>
            <select
              value={problemSelect}
              onChange={handleProblemSelect}
              required={problemSelect !== 'other'}
              className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] mb-2"
            >
              <option value="">ВЫБЕРИТЕ ПРОБЛЕМУ...</option>
              {getProblemOptions().map((problem) => (
                <option key={problem} value={problem}>{problem}</option>
              ))}
              <option value="other">ДРУГОЕ (ОПИСАТЬ ПОДРОБНО)</option>
            </select>
            {problemSelect === 'other' && (
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-3 focus:outline-none focus:border-[#00ff00] resize-none"
                placeholder="ВВЕДИТЕ ДЕТАЛЬНОЕ ОПИСАНИЕ НЕИСПРАВНОСТИ..."
              />
            )}
          </>
        ) : (
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-3 focus:outline-none focus:border-[#00ff00] resize-none"
            placeholder="ВВЕДИТЕ ДЕТАЛЬНОЕ ОПИСАНИЕ НЕИСПРАВНОСТИ..."
          />
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm">▸ СРОЧНОСТЬ:</label>
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          required
          className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00]"
        >
          <option value="low">НИЗКАЯ - 7-10 ДНЕЙ</option>
          <option value="normal">ОБЫЧНАЯ - 3-5 ДНЕЙ</option>
          <option value="high">ВЫСОКАЯ - 1-2 ДНЯ</option>
          <option value="urgent">СРОЧНАЯ - В ТЕЧЕНИЕ ДНЯ (+50%)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00ff00] text-black py-3 px-6 hover:bg-[#00cc00] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-pulse">ОБРАБОТКА</span>
            <span className="animate-ping">...</span>
          </>
        ) : (
          <>
            <span>▶</span>
            <span>ОТПРАВИТЬ ЗАЯВКУ</span>
            <span>◀</span>
          </>
        )}
      </button>
    </form>
  );
}
