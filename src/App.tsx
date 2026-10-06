import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/mobile/SplashScreen';
import { BottomNav, TabId } from './components/mobile/BottomNav';
import { HomeScreen } from './components/mobile/HomeScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { MyCalendarsScreen } from './components/mobile/MyCalendarsScreen';

import { WizardHeader } from './components/mobile/wizard/WizardHeader';
import { StepWho } from './components/mobile/wizard/StepWho';
import { StepPhotos } from './components/mobile/wizard/StepPhotos';
import { StepYearSelect } from './components/mobile/wizard/StepYearSelect';
import { StepStyleSelect } from './components/mobile/wizard/StepStyleSelect';
import { StepThemesPreview } from './components/mobile/wizard/StepThemesPreview';
import { StepGenerationScreen } from './components/mobile/wizard/StepGenerationScreen';
import { StepReadyGallery } from './components/mobile/wizard/StepReadyGallery';
import { StepDedicationScreen } from './components/mobile/wizard/StepDedicationScreen';
import { StepFormatAndPreview } from './components/mobile/wizard/StepFormatAndPreview';
import { StepFinalExport } from './components/mobile/wizard/StepFinalExport';

import { PrintOrderModal } from './components/PrintOrderModal';
import { AiSettingsModal } from './components/AiSettingsModal';

import {
  Calendar,
  Person,
  VisualStyleId,
  CalendarMonth,
  CalendarDedication,
  CalendarOrientation,
  CalendarPageFormat,
  CalendarBindingType,
  GiftRecipientType,
  DEFAULT_PRESET_CHILDREN,
} from './types/calendar';
import { CalendarRepository } from './services/storage';
import { TelegramService } from './services/telegram';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('moy_god_splash_seen');
  });

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [inWizard, setInWizard] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Who, 2: Photos, 3: Year, 4: Style, 5: Themes, 6: Gen, 7: Gallery, 8: Dedication, 9: Format/Mockup, 10: Final

  // Active Calendar State
  const [calendarId, setCalendarId] = useState<string>(() => `cal_${Date.now()}`);
  const [year, setYear] = useState<number>(2027);
  const [styleId, setStyleId] = useState<VisualStyleId>('realistic');
  const [mood, setMood] = useState<string>('warm_family');
  const [giftRecipient, setGiftRecipient] = useState<GiftRecipientType>('grandparents');
  const [people, setPeople] = useState<Person[]>(() => [...DEFAULT_PRESET_CHILDREN]);
  const [togetherMode, setTogetherMode] = useState<boolean>(true);
  const [months, setMonths] = useState<CalendarMonth[]>([]);
  const [dedication, setDedication] = useState<CalendarDedication>({
    enabled: true,
    text: 'Нашему любимому Артёму.\nПусть каждый день 2027 года будет маленьким приключением!\nМама и папа ❤️',
    author: 'Мама и папа ❤️',
  });
  const [formatSettings, setFormatSettings] = useState<{
    orientation: CalendarOrientation;
    format: CalendarPageFormat;
    binding: CalendarBindingType;
  }>({
    orientation: 'portrait',
    format: 'A3',
    binding: 'wall',
  });

  // Modals state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState<boolean>(false);
  const [savedCalendars, setSavedCalendars] = useState<Calendar[]>([]);
  const [selectedCalendarForPrint, setSelectedCalendarForPrint] = useState<Calendar | null>(null);

  // Initialize
  useEffect(() => {
    TelegramService.init();
    const stored = CalendarRepository.getSavedCalendars();
    setSavedCalendars(stored);
  }, []);

  const currentCalendarObject: Calendar = {
    id: calendarId,
    title: people.length > 0 ? `Календарь ${people.map((p) => p.name).join(' и ')}` : `Календарь ${year}`,
    year,
    styleId,
    mood,
    giftRecipient,
    children: people,
    togetherMode,
    months,
    dedication,
    formatSettings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: months.length === 12 ? 'generated' : 'draft',
  };

  // Auto-save calendar
  useEffect(() => {
    if (people.length > 0 || months.length > 0) {
      CalendarRepository.saveCalendar(currentCalendarObject);
      setSavedCalendars(CalendarRepository.getSavedCalendars());
    }
  }, [calendarId, year, styleId, mood, giftRecipient, people, togetherMode, months, dedication, formatSettings]);

  const handleDismissSplash = () => {
    sessionStorage.setItem('moy_god_splash_seen', 'true');
    setShowSplash(false);
    TelegramService.triggerHaptic('light');
  };

  const handleStartNewCalendar = () => {
    const newId = `cal_${Date.now()}`;
    setCalendarId(newId);
    setYear(2027);
    setStyleId('realistic');
    setMood('warm_family');
    setGiftRecipient('grandparents');
    setPeople([...DEFAULT_PRESET_CHILDREN]);
    setTogetherMode(true);
    setMonths([]);
    setDedication({
      enabled: true,
      text: 'Нашему любимому Артёму.\nПусть каждый день 2027 года будет маленьким приключением!\nМама и папа ❤️',
      author: 'Мама и папа ❤️',
    });
    setFormatSettings({
      orientation: 'portrait',
      format: 'A3',
      binding: 'wall',
    });
    setWizardStep(1);
    setInWizard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TelegramService.triggerHaptic('medium');
  };

  const handleOpenSavedCalendar = (cal: Calendar) => {
    setCalendarId(cal.id);
    setYear(cal.year);
    setStyleId(cal.styleId);
    setMood(cal.mood);
    setGiftRecipient(cal.giftRecipient || 'grandparents');
    setPeople(cal.children);
    setTogetherMode(cal.togetherMode);
    setMonths(cal.months);
    setDedication(cal.dedication);
    setFormatSettings(cal.formatSettings);

    if (cal.months.length === 12) {
      setWizardStep(7); // Go to Ready Gallery
    } else {
      setWizardStep(1);
    }
    setInWizard(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWizardBack = () => {
    if (wizardStep === 1) {
      setInWizard(false);
      setActiveTab('home');
    } else if (wizardStep === 7) {
      // From gallery, go back to themes preview
      setWizardStep(5);
    } else if (wizardStep === 6) {
      // From generation, go back to themes preview
      setWizardStep(5);
    } else {
      setWizardStep((prev) => Math.max(1, prev - 1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TelegramService.triggerHaptic('light');
  };

  const handleWizardNext = () => {
    setWizardStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TelegramService.triggerHaptic('light');
  };

  const handleGenerationComplete = (generatedMonths: CalendarMonth[]) => {
    setMonths(generatedMonths);
    setWizardStep(7); // Gallery
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMonth = (monthNumber: number, updated: CalendarMonth) => {
    setMonths((prev) =>
      prev.map((m) => (m.monthNumber === monthNumber ? updated : m))
    );
  };

  const handleDeleteCalendar = (id: string) => {
    CalendarRepository.deleteCalendar(id);
    const updated = CalendarRepository.getSavedCalendars();
    setSavedCalendars(updated);
    TelegramService.triggerHaptic('light');
  };

  const handleClearAllData = () => {
    CalendarRepository.clearAll();
    setSavedCalendars([]);
    setInWizard(false);
    setActiveTab('home');
    TelegramService.triggerHaptic('heavy');
  };

  const handleOrderPrint = (cal?: Calendar) => {
    setSelectedCalendarForPrint(cal || currentCalendarObject);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2723] font-sans selection:bg-[#EFE8DE] selection:text-[#2C2723]">
      {/* 1. Splash Screen */}
      {showSplash && <SplashScreen onEnter={handleDismissSplash} />}

      {/* Main App Container */}
      <div className="min-h-screen max-w-lg mx-auto flex flex-col relative bg-[#FAF7F2] shadow-2xl sm:border-x sm:border-[#ECE4D8]">
        {/* Wizard Flow Mode */}
        {inWizard ? (
          <div className="flex-1 flex flex-col">
            {/* Header with back button and progress */}
            <WizardHeader
              onBack={handleWizardBack}
              currentStep={Math.min(5, wizardStep)}
              totalSteps={5}
              title={
                wizardStep <= 5
                  ? 'Создание календаря'
                  : wizardStep === 6
                  ? 'Создаём ваш год'
                  : wizardStep === 7
                  ? 'Ваш год готов'
                  : wizardStep === 8
                  ? 'Посвящение'
                  : wizardStep === 9
                  ? 'Макет календаря'
                  : 'Готовый календарь'
              }
            />

            <div className="flex-1">
              {/* Step 1: Who is in the calendar? */}
              {wizardStep === 1 && (
                <StepWho
                  people={people}
                  togetherMode={togetherMode}
                  onUpdatePeople={(p, mode) => {
                    setPeople(p);
                    setTogetherMode(mode);
                  }}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 2: Add Photos */}
              {wizardStep === 2 && (
                <StepPhotos
                  people={people}
                  onUpdatePeople={setPeople}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 3: Select Year */}
              {wizardStep === 3 && (
                <StepYearSelect
                  selectedYear={year}
                  onSelectYear={setYear}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 4: Select Style */}
              {wizardStep === 4 && (
                <StepStyleSelect
                  selectedStyle={styleId}
                  onSelectStyle={setStyleId}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 5: Themes Preview */}
              {wizardStep === 5 && (
                <StepThemesPreview
                  onStartGeneration={() => {
                    setWizardStep(6);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {/* Step 6: Generation Screen */}
              {wizardStep === 6 && (
                <StepGenerationScreen
                  year={year}
                  styleId={styleId}
                  mood={mood}
                  giftRecipient={giftRecipient}
                  people={people}
                  togetherMode={togetherMode}
                  onGenerationComplete={handleGenerationComplete}
                />
              )}

              {/* Step 7: Ready Year Gallery */}
              {wizardStep === 7 && (
                <StepReadyGallery
                  year={year}
                  months={months}
                  styleId={styleId}
                  people={people}
                  togetherMode={togetherMode}
                  onUpdateMonth={handleUpdateMonth}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 8: Dedication */}
              {wizardStep === 8 && (
                <StepDedicationScreen
                  dedication={dedication}
                  people={people}
                  year={year}
                  onUpdateDedication={setDedication}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 9: Format & Mockup Preview */}
              {wizardStep === 9 && (
                <StepFormatAndPreview
                  year={year}
                  months={months}
                  dedication={dedication}
                  people={people}
                  formatSettings={formatSettings}
                  onUpdateFormat={setFormatSettings}
                  onNext={handleWizardNext}
                />
              )}

              {/* Step 10: Final Export */}
              {wizardStep === 10 && (
                <StepFinalExport
                  calendar={currentCalendarObject}
                  onOrderPrint={() => handleOrderPrint(currentCalendarObject)}
                  onGoHome={() => {
                    setInWizard(false);
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          /* Main Tab Navigation Mode */
          <div className="flex-1 flex flex-col">
            {activeTab === 'home' && (
              <HomeScreen
                onStartNew={handleStartNewCalendar}
                onOpenCalendar={handleOpenSavedCalendar}
                onOpenProfile={() => setActiveTab('profile')}
                savedCalendars={savedCalendars}
              />
            )}

            {activeTab === 'calendars' && (
              <MyCalendarsScreen
                calendars={savedCalendars}
                onOpenCalendar={handleOpenSavedCalendar}
                onOrderPrint={handleOrderPrint}
                onDeleteCalendar={handleDeleteCalendar}
                onStartNew={handleStartNewCalendar}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                onOpenAiSettings={() => setIsAiSettingsOpen(true)}
                onClearAllData={handleClearAllData}
              />
            )}

            {/* Bottom 3-item Navigation */}
            <BottomNav
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              savedCount={savedCalendars.length}
            />
          </div>
        )}

        {/* Print Order Modal */}
        <PrintOrderModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          calendar={selectedCalendarForPrint || currentCalendarObject}
        />

        {/* AI Settings Modal */}
        <AiSettingsModal
          isOpen={isAiSettingsOpen}
          onClose={() => setIsAiSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
