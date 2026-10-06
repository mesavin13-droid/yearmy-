import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, Eye, EyeOff, Sparkles, Zap, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { AiSettingsService, AiMode } from '../services/aiSettings';
import { TelegramService } from '../services/telegram';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChanged?: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  onKeyChanged,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [mode, setMode] = useState<AiMode>('smart');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    valid?: boolean;
    message?: string;
  }>({ tested: false });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(AiSettingsService.getCustomKey());
      setMode(AiSettingsService.getAiMode());
      setValidationResult({ tested: false });
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidate = async () => {
    if (!keyInput.trim()) {
      setValidationResult({ tested: true, valid: false, message: 'Введите ключ для проверки' });
      return;
    }
    setIsValidating(true);
    setValidationResult({ tested: false });
    TelegramService.triggerHaptic('light');

    try {
      const res = await AiSettingsService.validateKey(keyInput.trim());
      setValidationResult({ tested: true, valid: res.valid, message: res.message });
      if (res.valid) {
        TelegramService.triggerHaptic('success');
      } else {
        TelegramService.triggerHaptic('heavy');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    AiSettingsService.setCustomKey(keyInput.trim());
    AiSettingsService.setAiMode(mode);
    setSavedSuccess(true);
    TelegramService.triggerHaptic('success');
    onKeyChanged?.();
    setTimeout(() => {
      onClose();
    }, 450);
  };

  const handleClearKey = () => {
    setKeyInput('');
    AiSettingsService.clearCustomKey();
    setValidationResult({ tested: false });
    TelegramService.triggerHaptic('light');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ECE3D5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0E4] border border-[#E3D4C3] flex items-center justify-center text-[#A6533A]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#2C2723]">
                Настройки и ключ ИИ
              </h3>
              <p className="text-[10px] text-[#7A6F64]">
                Google Gemini API для генерации сюжетов
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#4A423A] mb-1.5">
            Режим генерации историй:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('smart')}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                mode === 'smart'
                  ? 'bg-white border-[#A6533A] ring-2 ring-[#A6533A] shadow-xs'
                  : 'bg-white border-[#ECE4D8] hover:border-[#D0C2B2]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2723] mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A6533A]" />
                <span>Gemini ИИ</span>
              </div>
              <p className="text-[10px] text-[#7A6F64] leading-tight">
                Индивидуальные тексты для бабушки и дедушки
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('instant')}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                mode === 'instant'
                  ? 'bg-white border-[#5B795A] ring-2 ring-[#5B795A] shadow-xs'
                  : 'bg-white border-[#ECE4D8] hover:border-[#D0C2B2]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2723] mb-0.5">
                <Zap className="w-3.5 h-3.5 text-[#5B795A]" />
                <span>Мгновенный</span>
              </div>
              <p className="text-[10px] text-[#7A6F64] leading-tight">
                Авторские готовые подписи без расхода квоты
              </p>
            </button>
          </div>
        </div>

        {/* Gemini API Key Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#4A423A]">
              Ваш персональный Gemini API Key:
            </label>
            {keyInput && (
              <button
                type="button"
                onClick={handleClearKey}
                className="text-[10px] text-red-600 hover:underline cursor-pointer"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setValidationResult({ tested: false });
              }}
              placeholder="Вставьте AIzaSy..."
              className="w-full px-3.5 py-2.5 pr-20 text-xs font-mono rounded-xl border border-[#DCD2C4] bg-white text-[#2C2723] focus:outline-hidden focus:border-[#A6533A]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 text-[#7A6F64] hover:text-[#2C2723] rounded-md transition-colors cursor-pointer"
                title={showKey ? 'Скрыть ключ' : 'Показать ключ'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-[10px] text-[#7A6F64]">
            <span>Ключ хранится локально в вашем браузере</span>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[#A6533A] hover:underline flex items-center gap-0.5"
            >
              <span>Получить бесплатный ключ</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Validation Result Notice */}
        {validationResult.tested && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 mb-4 border ${
              validationResult.valid
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {validationResult.valid ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{validationResult.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2 border-t border-[#ECE3D5]">
          {keyInput && (
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating}
              className="px-3 py-2.5 rounded-xl border border-[#D5C9BB] bg-white hover:bg-[#F7F2EA] text-xs font-medium text-[#4A423A] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A6533A]" />
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-[#7A6F64]" />
                  <span>Проверить</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Сохранено!</span>
              </>
            ) : (
              <span>Применить настройки</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
