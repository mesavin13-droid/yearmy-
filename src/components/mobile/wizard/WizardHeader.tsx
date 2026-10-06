import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface WizardHeaderProps {
  onBack: () => void;
  currentStep: number;
  totalSteps?: number;
  title?: string;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  onBack,
  currentStep,
  totalSteps = 5,
  title = 'Создание календаря',
}) => {
  const stepStr = String(currentStep).padStart(2, '0');
  const totalStr = String(totalSteps).padStart(2, '0');

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-[#ECE4D8]/70 flex items-center justify-between max-w-lg mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5146] hover:text-[#2C2723] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад</span>
      </button>

      <span className="text-xs font-bold text-[#2C2723] font-sans">
        {title}
      </span>

      <span className="text-xs font-mono font-semibold text-[#8C4A38] bg-[#FAF4EC] px-2 py-0.5 rounded-md border border-[#EFE2D2]">
        {stepStr} / {totalStr}
      </span>
    </header>
  );
};
