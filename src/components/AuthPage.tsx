import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './Toast';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        showToast('ВХОД ВЫПОЛНЕН УСПЕШНО');
      } else {
        await signup(email, password, name, 'client');
        showToast('РЕГИСТРАЦИЯ ЗАВЕРШЕНА');
      }
    } catch (error: any) {
      showToast(`ОШИБКА: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff00] p-4 md:p-8 font-mono flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="border-4 border-[#00ff00] bg-black shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <div className="bg-[#00ff00] text-black p-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 border-2 border-black"></div>
                <div className="w-3 h-3 bg-black"></div>
                <div className="w-3 h-3 border-2 border-black"></div>
              </div>
              <span className="text-sm md:text-base">
                ═══ СИСТЕМА АВТОРИЗАЦИИ ═══
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 border-2 border-[#00ff00] p-4">
              <pre className="text-xs text-center">
{`╔═══════════════════════════════════╗
║  СЕРВИСНЫЙ ЦЕНТР РЕМОНТА ТЕХНИКИ  ║
╚═══════════════════════════════════╝`}
              </pre>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 border-2 transition-colors ${
                  isLogin
                    ? 'bg-[#00ff00] text-black border-[#00ff00]'
                    : 'bg-black text-[#00ff00] border-[#006600] hover:border-[#00ff00]'
                }`}
              >
                ВХОД
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 border-2 transition-colors ${
                  !isLogin
                    ? 'bg-[#00ff00] text-black border-[#00ff00]'
                    : 'bg-black text-[#00ff00] border-[#006600] hover:border-[#00ff00]'
                }`}
              >
                РЕГИСТРАЦИЯ
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm">▸ ИМЯ:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                    placeholder="ВВЕДИТЕ ИМЯ"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm">▸ EMAIL:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                  placeholder="ВВЕДИТЕ EMAIL"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">▸ ПАРОЛЬ:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black text-[#00ff00] border-2 border-[#006600] p-2 focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                  placeholder="ВВЕДИТЕ ПАРОЛЬ"
                />
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
                    <span>{isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}</span>
                    <span>◀</span>
                  </>
                )}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 text-xs opacity-70 text-center">
                <p>ТЕСТОВЫЕ УЧЕТНЫЕ ЗАПИСИ:</p>
                <p>АДМИН: admin@service.com / admin123</p>
                <p>МАСТЕР: master@service.com / master123</p>
              </div>
            )}
          </div>

          <div className="border-t-2 border-[#00ff00] p-2 flex justify-between text-xs">
            <span>AUTH SYSTEM v2.0</span>
            <span className="animate-pulse">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}
