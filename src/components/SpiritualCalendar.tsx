import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Sparkles, BookOpen } from 'lucide-react';
import { StorageService } from '../services/storage';
import { getDayOfYear } from '../data/meditations';

interface SpiritualCalendarProps {
  onSelectDay: (dayNumber: number) => void;
}

export const SpiritualCalendar: React.FC<SpiritualCalendarProps> = ({ onSelectDay }) => {
  const currentYear = new Date().getFullYear();
  const currentDayOfYear = getDayOfYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const progress = StorageService.getProgress();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonthWeekday = new Date(currentYear, selectedMonth, 1).getDay();
  const startOffset = (firstDayOfMonthWeekday + 6) % 7;

  const getDayNumberForDate = (dayOfMonth: number): number => {
    const startOfYear = new Date(currentYear, 0, 1);
    const date = new Date(currentYear, selectedMonth, dayOfMonth);
    const diff = date.getTime() - startOfYear.getTime() + (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev < 11 ? prev + 1 : 0));
  };

  let completedInMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayNum = getDayNumberForDate(d);
    if (progress.completed_days.includes(dayNum)) {
      completedInMonth++;
    }
  }
  const monthPercentage = Math.round((completedInMonth / daysInMonth) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header with Logo Globe Colors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#1E56B7] dark:text-[#60A5FA]" />
            <span>Calendrier Spirituel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chaque jour est un nouveau départ. Progressez à votre rythme dans les 365 jours avec Dieu.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0E1C38] p-1.5 rounded-2xl border border-blue-100 dark:border-blue-950/80 shadow-xs self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm sm:text-base px-3 text-[#0A152E] dark:text-slate-200 min-w-[130px] text-center">
            {monthNames[selectedMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Progress Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#1E56B7]/15 text-[#1E56B7] dark:text-[#60A5FA]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Jours médités ce mois</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {completedInMonth} / {daysInMonth} jours
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#DC2626]/15 text-[#DC2626] dark:text-[#F87171]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Progression mensuelle</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{monthPercentage}%</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/15 text-blue-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Jour d’aujourd’hui</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Jour {currentDayOfYear}</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container with Logo Colors */}
      <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA]">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mer</div>
          <div>Jeu</div>
          <div>Ven</div>
          <div>Sam</div>
          <div>Dim</div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayOfMonth = i + 1;
            const dayOfYearNum = getDayNumberForDate(dayOfMonth);
            const isCompleted = progress.completed_days.includes(dayOfYearNum);
            const isToday = dayOfYearNum === currentDayOfYear;
            const isPast = dayOfYearNum < currentDayOfYear;

            return (
              <button
                key={`day-${dayOfMonth}`}
                onClick={() => onSelectDay(dayOfYearNum)}
                className={`group relative h-16 sm:h-20 rounded-2xl p-2 flex flex-col justify-between items-start border transition text-left cursor-pointer ${
                  isToday
                    ? 'border-[#1E56B7] bg-[#1E56B7]/10 dark:bg-[#1E56B7]/25 ring-2 ring-[#1E56B7]/40 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-400'
                    : isPast
                    ? 'border-blue-50 dark:border-blue-950/60 bg-blue-50/30 dark:bg-[#070E1E]/50 hover:border-[#1E56B7]/40'
                    : 'border-slate-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] hover:border-[#1E56B7]/50'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'text-[#1E56B7] dark:text-[#60A5FA]'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayOfMonth}
                  </span>

                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  {isToday && !isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                  )}
                </div>

                <div className="w-full">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate font-medium">
                    J.{dayOfYearNum}
                  </span>
                  <span className="hidden sm:inline-block text-[9px] text-slate-500 dark:text-slate-400 truncate w-full">
                    {isCompleted ? 'Complété' : isToday ? 'Aujourd’hui' : 'Méditer'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gentle Non-guilt Encouragement Message */}
      <div className="mt-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
            Une marche spirituelle bienveillante et sans culpabilité
          </span>
          Si vous avez manqué un jour ou une semaine, ne vous inquiétez pas : la grâce de Dieu se renouvelle chaque matin. Vous pouvez toujours cliquer sur n'importe quel jour antérieur pour vous réjouir de Sa Parole !
        </div>
      </div>
    </div>
  );
};
