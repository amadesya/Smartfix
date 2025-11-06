import React, { useState } from 'react';
import { AuthPage } from './AuthPage';
import { ContactsPage } from './ContactsPage';

type PageView = 'landing' | 'auth' | 'contacts';

export function LandingPage() {
  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (currentView === 'auth') {
    return <AuthPage initialMode={authMode} />;
  }

  if (currentView === 'contacts') {
    return (
      <div className="min-h-screen bg-black text-[#00ff00]">
        <GuestHeader 
          onNavigate={(view) => {
            setCurrentView(view);
          }}
          onAuth={(mode) => {
            setAuthMode(mode);
            setCurrentView('auth');
          }}
        />
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setCurrentView('landing')}
              className="mb-4 text-[#00ff00] border-2 border-[#00ff00] px-4 py-2 hover:bg-[#00ff00] hover:text-black transition-colors"
            >
              ← НАЗАД
            </button>
            <ContactsPage />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff00]">
      <GuestHeader 
        onNavigate={(view) => {
          setCurrentView(view);
        }}
        onAuth={(mode) => {
          setAuthMode(mode);
          setCurrentView('auth');
        }}
      />
      
      <main>
        {/* Hero Section */}
        <section className="p-4 md:p-8 border-b-2 border-[#00ff00]">
          <div className="max-w-7xl mx-auto">
            <div className="border-4 border-[#00ff00] p-6 md:p-12 shadow-[0_0_30px_rgba(0,255,0,0.3)]">
              <pre className="text-xs md:text-sm mb-6 overflow-x-auto">
{`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████  ███████ ██████   █████  ██ ██████                  ║
║   ██   ██ ██      ██   ██ ██   ██ ██ ██   ██                 ║
║   ██████  █████   ██████  ███████ ██ ██████                  ║
║   ██   ██ ██      ██      ██   ██ ██ ██   ██                 ║
║   ██   ██ ███████ ██      ██   ██ ██ ██   ██                 ║
║                                                               ║
║            ███████ ███████ ██████  ██    ██ ██  ██████  ███████
║            ██      ██      ██   ██ ██    ██ ██ ██      ██     
║            ███████ █████   ██████  ██    ██ ██ ██      █████  
║                 ██ ██      ██   ██  ██  ██  ██ ██      ██     
║            ███████ ███████ ██   ██   ████   ██  ██████ ███████
║                                                               ║
║              CENTER FOR DIGITAL EQUIPMENT REPAIR              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`}
              </pre>
              <div className="text-center space-y-4">
                <p className="text-sm md:text-base">
                  ▸ ПРОФЕССИОНАЛЬНЫЙ РЕМОНТ ЦИФРОВОЙ ТЕХНИКИ С 2010 ГОДА ◂
                </p>
                <p className="text-xs md:text-sm text-[#00cc00]">
                  СЕРТИФИЦИРОВАННЫЕ МАСТЕРА | ГАРАНТИЯ КАЧЕСТВА | БЫСТРОЕ ОБСЛУЖИВАНИЕ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="p-4 md:p-8 border-b-2 border-[#00ff00]">
          <div className="max-w-7xl mx-auto">
            <div className="border-2 border-[#00ff00] p-6 md:p-8">
              <h2 className="text-center mb-8">
                ╔═══════════════════════════════════════════════╗<br />
                ║         ДОСТУПНЫЕ УСЛУГИ / SERVICES           ║<br />
                ╚═══════════════════════════════════════════════╝
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard
                  icon="[SMARTPHONE]"
                  title="РЕМОНТ СМАРТФОНОВ"
                  items={[
                    'Замена экрана и тачскрина',
                    'Ремонт материнской платы',
                    'Замена аккумулятора',
                    'Восстановление после воды',
                    'Программное обновление'
                  ]}
                />
                
                <ServiceCard
                  icon="[LAPTOP]"
                  title="РЕМОНТ НОУТБУКОВ"
                  items={[
                    'Чистка и замена термопасты',
                    'Замена клавиатуры и матрицы',
                    'Апгрейд оперативной памяти',
                    'Замена жесткого диска',
                    'Устранение неисправностей'
                  ]}
                />
                
                <ServiceCard
                  icon="[TABLET]"
                  title="РЕМОНТ ПЛАНШЕТОВ"
                  items={[
                    'Замена сенсорного экрана',
                    'Ремонт разъемов',
                    'Замена батареи',
                    'Прошивка и настройка',
                    'Восстановление системы'
                  ]}
                />
                
                <ServiceCard
                  icon="[DESKTOP]"
                  title="РЕМОНТ ПК"
                  items={[
                    'Диагностика компонентов',
                    'Замена комплектующих',
                    'Удаление вирусов',
                    'Установка ПО',
                    'Настройка системы'
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="p-4 md:p-8 border-b-2 border-[#00ff00]">
          <div className="max-w-7xl mx-auto">
            <div className="border-2 border-[#00ff00] p-6 md:p-8">
              <h2 className="text-center mb-8">
                ╔═══════════════════════════════════════════════╗<br />
                ║          НАШИ ПРЕИМУЩЕСТВА / FEATURES         ║<br />
                ╚═══════════════════════════════════════════════╝
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  number="01"
                  title="ОПЫТНЫЕ МАСТЕРА"
                  description="Более 15 лет опыта работы с различными брендами и моделями техники"
                />
                
                <FeatureCard
                  number="02"
                  title="ГАРАНТИЯ КАЧЕСТВА"
                  description="Предоставляем гарантию на все виды выполненных работ и запчасти"
                />
                
                <FeatureCard
                  number="03"
                  title="БЫСТРОЕ ОБСЛУЖИВАНИЕ"
                  description="Экспресс-ремонт в течение 1-2 часов для большинства неисправностей"
                />
                
                <FeatureCard
                  number="04"
                  title="ОНЛАЙН ЗАЯВКИ"
                  description="Удобная система отслеживания статуса ремонта через личный кабинет"
                />
                
                <FeatureCard
                  number="05"
                  title="ОРИГИНАЛЬНЫЕ ЗАПЧАСТИ"
                  description="Используем только качественные комплектующие от проверенных поставщиков"
                />
                
                <FeatureCard
                  number="06"
                  title="ДОСТУПНЫЕ ЦЕНЫ"
                  description="Конкурентные цены и гибкая система скидок для постоянных клиентов"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-4 border-[#00ff00] p-8 md:p-12 text-center shadow-[0_0_30px_rgba(0,255,0,0.3)]">
              <p className="text-lg md:text-xl mb-6">
                ▸ ГОТОВЫ НАЧАТЬ? ◂
              </p>
              <p className="text-sm md:text-base mb-8 text-[#00cc00]">
                ЗАРЕГИСТРИРУЙТЕСЬ В СИСТЕМЕ И СОЗДАЙТЕ ЗАЯВКУ НА РЕМОНТ
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setCurrentView('auth');
                  }}
                  className="px-8 py-4 bg-[#00ff00] text-black border-4 border-[#00ff00] hover:bg-black hover:text-[#00ff00] transition-all shadow-[0_0_20px_rgba(0,255,0,0.5)]"
                >
                  [РЕГИСТРАЦИЯ]
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setCurrentView('auth');
                  }}
                  className="px-8 py-4 bg-black text-[#00ff00] border-4 border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
                >
                  [ВХОД В СИСТЕМУ]
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-4 md:p-8 border-t-2 border-[#00ff00]">
          <div className="max-w-7xl mx-auto text-center text-xs md:text-sm text-[#00cc00]">
            <p>
              ▸ REPAIR SERVICE CENTER TERMINAL v1.0 ◂
            </p>
            <p className="mt-2">
              © 2010-{new Date().getFullYear()} | СИСТЕМА УПРАВЛЕНИЯ РЕМОНТОМ ЦИФРОВО�� ТЕХНИКИ
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

interface GuestHeaderProps {
  onNavigate: (view: PageView) => void;
  onAuth: (mode: 'signin' | 'signup') => void;
}

function GuestHeader({ onNavigate, onAuth }: GuestHeaderProps) {
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-[#00ff00] text-black p-3 font-mono sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 border-2 border-black"></div>
            <div className="w-3 h-3 bg-black"></div>
            <div className="w-3 h-3 border-2 border-black"></div>
          </div>
          <span className="text-sm md:text-base">
            ═══ REPAIR SERVICE CENTER ═══
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
          <button
            onClick={() => onNavigate('contacts')}
            className="bg-black text-[#00ff00] px-3 py-1 border-2 border-black hover:bg-[#003300] transition-colors"
          >
            [КОНТАКТЫ]
          </button>
          <button
            onClick={() => onAuth('signin')}
            className="bg-black text-[#00ff00] px-3 py-1 border-2 border-black hover:bg-[#003300] transition-colors"
          >
            [ВОЙТИ]
          </button>
          <button
            onClick={() => onAuth('signup')}
            className="bg-black text-[#00ff00] px-3 py-1 border-2 border-black hover:bg-[#003300] transition-colors"
          >
            [РЕГИСТРАЦИЯ]
          </button>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">{currentDate}</span>
        </div>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  icon: string;
  title: string;
  items: string[];
}

function ServiceCard({ icon, title, items }: ServiceCardProps) {
  return (
    <div className="border-2 border-[#00ff00] p-4 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-sm md:text-base">{title}</h3>
      </div>
      <ul className="space-y-2 text-xs md:text-sm text-[#00cc00]">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-[#00ff00]">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

function FeatureCard({ number, title, description }: FeatureCardProps) {
  return (
    <div className="border-2 border-[#00ff00] p-4 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-shadow">
      <div className="text-3xl mb-3 text-[#00ff00]">
        [{number}]
      </div>
      <h3 className="text-sm md:text-base mb-3">{title}</h3>
      <p className="text-xs md:text-sm text-[#00cc00]">
        {description}
      </p>
    </div>
  );
}
