import React, { useState } from 'react';
import { useToast } from './Toast';

interface FormData {
  name: string;
  email: string;
  phone: string;
  deviceType: string;
  brand: string;
  model: string;
  problem: string;
  urgency: string;
}

export function TerminalForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    brand: '',
    model: '',
    problem: '',
    urgency: 'normal'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing
    const processingSteps = [
      'VALIDATING INPUT DATA...',
      'CHECKING DEVICE DATABASE...',
      'GENERATING TICKET NUMBER...',
      'ASSIGNING TO TECHNICIAN...',
      'REQUEST SUBMITTED SUCCESSFULLY'
    ];

    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast(processingSteps[i]);
    }

    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;
    
    setTimeout(() => {
      setIsProcessing(false);
      showToast(`TICKET #${ticketNumber} CREATED`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        deviceType: '',
        brand: '',
        model: '',
        problem: '',
        urgency: 'normal'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mb-6 border-2 border-[#00ff00] p-4">
        <div className="text-center mb-4">
          <pre className="text-xs md:text-sm">
{`╔═══════════════════════════════════════════════════════════╗
║     СЕРВИСНЫЙ ЦЕНТР РЕМОНТА ЦИФРОВОЙ ТЕХНИКИ             ║
║     ФОРМА ПОДАЧИ ЗАЯВКИ НА РЕМОНТ                        ║
╚═══════════════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </div>

      {isProcessing ? (
        <ProcessingAnimation />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="ИМЯ КЛИЕНТА"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setCurrentField('name')}
              onBlur={() => setCurrentField(null)}
              required
              isFocused={currentField === 'name'}
            />

            <FormField
              label="EMAIL"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setCurrentField('email')}
              onBlur={() => setCurrentField(null)}
              required
              isFocused={currentField === 'email'}
            />
          </div>

          <FormField
            label="ТЕЛЕФОН"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => setCurrentField('phone')}
            onBlur={() => setCurrentField(null)}
            required
            isFocused={currentField === 'phone'}
          />

          <div className="border border-[#00ff00] p-4">
            <div className="mb-4 text-xs">
              ┌─ ИНФОРМАЦИЯ ОБ УСТРОЙСТВЕ ─────────────────────┐
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="ТИП УСТРОЙСТВА"
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                required
                options={[
                  { value: '', label: 'ВЫБЕРИТЕ...' },
                  { value: 'smartphone', label: 'СМАРТФОН' },
                  { value: 'tablet', label: 'ПЛАНШЕТ' },
                  { value: 'laptop', label: 'НОУТБУК' },
                  { value: 'pc', label: 'ПК' },
                  { value: 'console', label: 'ИГРОВАЯ КОНСОЛЬ' },
                  { value: 'other', label: 'ДРУГОЕ' }
                ]}
              />

              <FormField
                label="БРЕНД"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                onFocus={() => setCurrentField('brand')}
                onBlur={() => setCurrentField(null)}
                required
                isFocused={currentField === 'brand'}
              />

              <FormField
                label="МОДЕЛЬ"
                name="model"
                value={formData.model}
                onChange={handleChange}
                onFocus={() => setCurrentField('model')}
                onBlur={() => setCurrentField(null)}
                required
                isFocused={currentField === 'model'}
              />
            </div>

            <div className="mt-4 text-xs">
              └────────────────────────────────────────────────┘
            </div>
          </div>

          <div className="border border-[#00ff00] p-4">
            <label className="block mb-2 text-sm">
              ▸ ОПИСАНИЕ ПРОБЛЕМЫ:
            </label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              onFocus={() => setCurrentField('problem')}
              onBlur={() => setCurrentField(null)}
              required
              rows={5}
              className={`w-full bg-black text-[#00ff00] border-2 p-3 focus:outline-none resize-none ${
                currentField === 'problem' 
                  ? 'border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.5)]' 
                  : 'border-[#006600]'
              }`}
              placeholder="ВВЕДИТЕ ДЕТАЛЬНОЕ ОПИСАНИЕ НЕИСПРАВНОСТИ..."
            />
          </div>

          <SelectField
            label="СРОЧНОСТЬ"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
            options={[
              { value: 'low', label: 'НИЗКАЯ - 7-10 ДНЕЙ' },
              { value: 'normal', label: 'ОБЫЧНАЯ - 3-5 ДНЕЙ' },
              { value: 'high', label: 'ВЫСОКАЯ - 1-2 ДНЯ' },
              { value: 'urgent', label: 'СРОЧНАЯ - В ТЕЧЕНИЕ ДНЯ (+50%)' }
            ]}
          />

          <div className="border-t-2 border-[#00ff00] pt-4 mt-6">
            <button
              type="submit"
              className="w-full bg-[#00ff00] text-black py-3 px-6 hover:bg-[#00cc00] transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <span>▶</span>
              <span>ОТПРАВИТЬ ЗАЯВКУ</span>
              <span className="group-hover:animate-pulse">◀</span>
            </button>
          </div>

          <div className="text-xs text-center opacity-70 mt-4">
            ⚠ ВСЕ ДАННЫЕ ПЕРЕДАЮТСЯ ПО ЗАЩИЩЕННОМУ СОЕДИНЕНИЮ
          </div>
        </form>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  required?: boolean;
  isFocused?: boolean;
}

function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  required,
  isFocused 
}: FormFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm">
        ▸ {label}:
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className={`w-full bg-black text-[#00ff00] border-2 p-2 focus:outline-none transition-all ${
          isFocused 
            ? 'border-[#00ff00] shadow-[0_0_10px_rgba(0,255,0,0.5)]' 
            : 'border-[#006600]'
        }`}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}

function SelectField({ label, name, value, onChange, required, options }: SelectFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm">
        ▸ {label}:
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_rgba(0,255,0,0.5)]"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProcessingAnimation() {
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-12 space-y-4">
      <div className="text-2xl animate-pulse">
        <pre>
{`  ╔═══════════════════════╗
  ║   ОБРАБОТКА ДАННЫХ    ║
  ╚═══════════════════════╝`}
        </pre>
      </div>
      
      <div className="flex justify-center items-center gap-2 text-xl">
        <span>ПОДОЖДИТЕ</span>
        <span className="inline-block w-12 text-left">{dots}</span>
      </div>

      <div className="mt-8">
        <div className="flex justify-center gap-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-[#00ff00]"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.05}s infinite`,
                opacity: 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
