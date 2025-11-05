import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { ClientDashboard } from './components/ClientDashboard';
import { MasterDashboard } from './components/MasterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './components/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user, profile, logout } = useAuth();
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!bootComplete) {
    return <BootSequence />;
  }

  if (!user) {
    return <AuthPage />;
  }

  const role = profile?.role || 'client';

  return (
    <div className="min-h-screen bg-black text-[#00ff00]">
      <Header role={role} onLogout={logout} profile={profile} />
      
      {role === 'admin' && <AdminDashboard />}
      {role === 'master' && <MasterDashboard />}
      {role === 'client' && <ClientDashboard />}
    </div>
  );
}

function BootSequence() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootMessages = [
      'INITIALIZING REPAIR SERVICE SYSTEM...',
      'LOADING AUTHENTICATION MODULE.......[OK]',
      'CHECKING DATABASE CONNECTION.........[OK]',
      'LOADING USER INTERFACE...............[OK]',
      'SYSTEM READY.'
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootMessages.length) {
        setLines(prev => [...prev, bootMessages[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-8 font-mono flex items-center justify-center">
      <div className="max-w-3xl w-full border-4 border-[#00ff00] p-8 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <div className="space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-[#00ff00]">▸</span>
              <span>{line}</span>
            </div>
          ))}
          {lines.length > 0 && <span className="animate-pulse">█</span>}
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  role: string;
  onLogout: () => void;
  profile: any;
}

function Header({ role, onLogout, profile }: HeaderProps) {
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const roleLabels = {
    client: 'КЛИЕНТ',
    master: 'МАСТЕР',
    admin: 'АДМИНИСТРАТОР'
  };

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
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-xs md:text-sm">
          <span>РОЛЬ: {roleLabels[role as keyof typeof roleLabels]}</span>
          <span className="hidden md:inline">|</span>
          <span>USER: {profile?.name || profile?.email || 'UNKNOWN'}</span>
          <span className="hidden md:inline">|</span>
          <span>{currentDate}</span>
          <button
            onClick={onLogout}
            className="bg-black text-[#00ff00] px-3 py-1 border-2 border-black hover:bg-[#003300] transition-colors"
          >
            [ВЫХОД]
          </button>
        </div>
      </div>
    </div>
  );
}
