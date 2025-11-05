import React from 'react';

export function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="border-4 border-[#00ff00] p-6 shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <div className="text-xl mb-6 flex items-center gap-3">
          <span>▸</span>
          <span>КОНТАКТНАЯ ИНФОРМАЦИЯ</span>
        </div>

        <div className="space-y-6">
          {/* Main Office */}
          <div className="border-2 border-[#00ff00] p-4">
            <div className="text-sm mb-4 opacity-70">
              ┌─ ГЛАВНЫЙ ОФИС ─────────────────────────────┐
            </div>
            
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ АДРЕС:</span>
                <span>г. Москва, ул. Техническая, д. 42, офис 15</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ ТЕЛЕФОН:</span>
                <span>+7 (495) 123-45-67</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ EMAIL:</span>
                <span>info@repair-center.ru</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ РЕЖИМ РАБОТЫ:</span>
                <div>
                  <div>ПН-ПТ: 09:00 - 20:00</div>
                  <div>СБ: 10:00 - 18:00</div>
                  <div>ВС: ВЫХОДНОЙ</div>
                </div>
              </div>
            </div>

            <div className="text-sm mt-4 opacity-70">
              └─────────────────────────────────────────────┘
            </div>
          </div>

          {/* Additional Contacts */}
          <div className="border-2 border-[#00ff00] p-4">
            <div className="text-sm mb-4 opacity-70">
              ┌─ ДОПОЛНИТЕЛЬНЫЕ КОНТАКТЫ ──────────────────┐
            </div>
            
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ ОТДЕЛ ПРИЁМА:</span>
                <span>+7 (495) 123-45-68</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ ТЕХНИЧЕСКАЯ ПОДДЕРЖКА:</span>
                <span>+7 (495) 123-45-69</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ WHATSAPP/TELEGRAM:</span>
                <span>+7 (985) 123-45-67</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ ГОРЯЧАЯ ЛИНИЯ (24/7):</span>
                <span>8 (800) 555-35-35</span>
              </div>
            </div>

            <div className="text-sm mt-4 opacity-70">
              └─────────────────────────────────────────────┘
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="border-2 border-[#00ff00] p-4">
            <div className="text-sm mb-4 opacity-70">
              ┌─ ЭКСТРЕННЫЕ СИТУАЦИИ ──────────────────────┐
            </div>
            
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ СРОЧНЫЙ РЕМОНТ:</span>
                <span>+7 (985) 999-99-99</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[200px]">▸ ВЫЕЗДНОЙ МАСТЕР:</span>
                <span>+7 (985) 888-88-88</span>
              </div>
              
              <div className="text-xs mt-4 opacity-70 border-l-2 border-[#00ff00] pl-3">
                ⚠ Срочные заявки обрабатываются в течение 1 часа.<br/>
                Выезд мастера возможен в пределах МКАД.
              </div>
            </div>

            <div className="text-sm mt-4 opacity-70">
              └─────────────────────────────────────────────┘
            </div>
          </div>

          {/* Social Media */}
          <div className="border-2 border-[#00ff00] p-4">
            <div className="text-sm mb-4 opacity-70">
              ┌─ МЫ В СОЦИАЛЬНЫХ СЕТЯХ ────────────────────┐
            </div>
            
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ ВКОНТАКТЕ:</span>
                <span>vk.com/repair_center</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ TELEGRAM:</span>
                <span>@repair_center_bot</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ INSTAGRAM:</span>
                <span>@repair.center.official</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-[#00ff00] min-w-[120px]">▸ YOUTUBE:</span>
                <span>youtube.com/repaircenter</span>
              </div>
            </div>

            <div className="text-sm mt-4 opacity-70">
              └─────────────────────────────────────────────┘
            </div>
          </div>

          {/* Additional Info */}
          <div className="border border-[#006600] p-4 text-xs opacity-70">
            <div className="mb-2">▸ ВАЖНАЯ ИНФОРМАЦИЯ:</div>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Бесплатная диагностика при ремонте в нашем сервисе</li>
              <li>Гарантия на все виды работ от 3 до 12 месяцев</li>
              <li>Используем только оригинальные запчасти</li>
              <li>Скидка 10% при повторном обращении</li>
              <li>Запись на ремонт онлайн через личный кабинет</li>
            </ul>
          </div>

          {/* Map placeholder */}
          <div className="border-2 border-[#00ff00] p-4">
            <div className="text-sm mb-4 opacity-70">
              ┌─ КАК НАС НАЙТИ ────────────────────────────┐
            </div>
            
            <div className="bg-[#001100] border border-[#006600] p-8 text-center">
              <div className="text-xs opacity-50 space-y-2">
                <div>╔═══════════════════════════════════════╗</div>
                <div>║                                       ║</div>
                <div>║         [КАРТА РАСПОЛОЖЕНИЯ]          ║</div>
                <div>║                                       ║</div>
                <div>║   Метро: Технопарк (5 минут пешком)  ║</div>
                <div>║   Парковка: Бесплатная для клиентов   ║</div>
                <div>║                                       ║</div>
                <div>╚═══════════════════════════════════════╝</div>
              </div>
            </div>

            <div className="text-sm mt-4 opacity-70">
              └─────────────────────────────────────────────┘
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
