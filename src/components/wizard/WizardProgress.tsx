import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

export const WIZARD_STEPS = [
  { step: 1, label: 'Дети' },
  { step: 2, label: 'Год' },
  { step: 3, label: 'Стиль' },
  { step: 4, label: 'Настроение' },
  { step: 5, label: 'Генерация' },
  { step: 6, label: 'Редактирование' },
  { step: 7, label: 'Посвящение' },
  { step: 8, label: 'Предпросмотр' },
];

interface WizardProgressProps {
  currentStep: number;
  onBack: () => void;
  canGoBack: boolean;
  onStepClick?: (step: number) => void;
  maxReachedStep: number;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  onBack,
  canGoBack,
  onStepClick,
  maxReachedStep,
}) => {
  return (
    <div className="sticky top-15 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#ECE4D8] py-2.5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px] ${
            canGoBack
              ? 'text-[#5C5349] hover:text-[#2C2723] hover:bg-[#EFE9DF]'
              : 'text-[#C5BDB2] cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Назад</span>
        </button>

        {/* Step Indicator on Mobile & Desktop */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {WIZARD_STEPS.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            const isClickable = s.step <= maxReachedStep && s.step !== 5; // cannot skip to or click generation

            return (
              <button
                key={s.step}
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(s.step)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#2C2723] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-[#EAE2D5] text-[#5C5146] hover:bg-[#DFD6C8]'
                    : 'text-[#AFA498] bg-transparent'
                } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-[#2C2723]'
                      : isCompleted
                      ? 'bg-[#5B795A] text-white'
                      : 'bg-[#E3DAD0] text-[#7A7065]'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.step}
                </span>
                <span className={isCurrent ? 'font-semibold' : 'hidden sm:inline'}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Counter */}
        <div className="text-[11px] font-mono text-[#8C7F72] whitespace-nowrap">
          {currentStep} / {WIZARD_STEPS.length}
        </div>
      </div>
    </div>
  );
};
