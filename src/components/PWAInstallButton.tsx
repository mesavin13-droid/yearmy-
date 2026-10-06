import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if standalone (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Установить приложение на телефон"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5C5349] hover:text-[#2C2723] bg-[#EFE9DF] hover:bg-[#E5DDCE] rounded-lg transition-colors whitespace-nowrap min-h-[36px]"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Установить приложение</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#FAF7F2] p-6 shadow-xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#2C2723]">Установка на iPhone / iPad</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#70665D] leading-relaxed mb-4">
              Чтобы открывать «Мой Год» в одно касание как настоящее приложение:
            </p>
            <ol className="text-xs text-[#4A423A] space-y-2 list-decimal list-inside bg-white p-3.5 rounded-xl border border-[#ECE4D8]">
              <li>Нажмите кнопку <strong>«Поделиться»</strong> (значок со стрелкой вверх внизу экрана Safari).</li>
              <li>Прокрутите список вниз и выберите <strong>«На экран Домой»</strong>.</li>
              <li>Нажмите <strong>«Добавить»</strong> в правом верхнем углу.</li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#2C2723] text-white text-xs font-medium hover:bg-[#433B35] transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};
