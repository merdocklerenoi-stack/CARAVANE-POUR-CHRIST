import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Heart,
  Star,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Clock,
  BookMarked,
  Flame
} from 'lucide-react';
import { Meditation } from '../types';
import { StorageService } from '../services/storage';
import { PrayerModal } from './PrayerModal';

interface HomeTodayProps {
  todayMeditation: Meditation;
  dayOfYearNumber: number;
  onReadMeditation: (dayNumber: number) => void;
  onNavigateToProgram: () => void;
  onNavigateToJournal: () => void;
  onNavigateToSettings: () => void;
}

export const HomeToday: React.FC<HomeTodayProps> = ({
  todayMeditation,
  dayOfYearNumber,
  onReadMeditation,
  onNavigateToProgram,
  onNavigateToJournal,
  onNavigateToSettings
}) => {
  const [isFavorite, setIsFavorite] = useState(() => StorageService.isFavorite(todayMeditation.day_number));
  const [isCompleted, setIsCompleted] = useState(() => StorageService.isDayCompleted(todayMeditation.day_number));
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  const progress = StorageService.getProgress();
  const settings = StorageService.getSettings();

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.toggleFavorite(todayMeditation.day_number);
    setIsFavorite(updated);
  };

  const completedCount = progress.completed_days.length;
  const annualPercentage = Math.round((completedCount / 365) * 100);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Greeting & Date Header with Logo Globe Colors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="text-xs font-bold text-[#1E56B7] dark:text-[#60A5FA] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{capitalizedDate} • Jour {dayOfYearNumber} sur 365</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white text-balance">
            Bonjour, {settings.display_name || 'cher pèlerin'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-pretty">
            « Un jour à la fois, plus près de Christ. »
          </p>
        </div>

        {/* Streak indicator badge with Caravane Red flame */}
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/80 dark:bg-[#1E1120]/40 px-3.5 py-2 shadow-xs self-start sm:self-auto shrink-0">
          <Flame className="w-5 h-5 text-[#DC2626] animate-bounce shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {progress.streak_count} jour{progress.streak_count > 1 ? 's' : ''} consécutif{progress.streak_count > 1 ? 's' : ''}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Marche fidèle</div>
          </div>
        </div>
      </div>

      {/* Hero Meditation Card for Today with Logo Globe Blue & Ribbon Red Accent */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#1E56B7]/60 dark:border-[#2563EB]/50 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Subtle decorative background globe illumination */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#1E56B7]/15 via-[#38BDF8]/10 to-[#DC2626]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1E56B7]/15 text-[#1E56B7] dark:bg-[#1E56B7]/30 dark:text-[#60A5FA] px-3 py-1 text-xs font-bold uppercase tracking-wider border border-[#1E56B7]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Méditation du Jour • Jour {todayMeditation.day_number}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-[#1E56B7] dark:text-[#93C5FD]">
              {todayMeditation.theme}
            </span>

            <button
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                isFavorite
                  ? 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white mb-3 sm:mb-4 leading-snug tracking-tight text-balance">
          {todayMeditation.title}
        </h2>

        {/* Scripture Box with Logo Red Ribbon accent */}
        <div className="mb-5 sm:mb-6 rounded-2xl border-l-4 border-[#DC2626] bg-blue-50/60 dark:bg-[#0A1428]/80 p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#DC2626] dark:text-[#F87171] uppercase tracking-wider mb-1.5 sm:mb-2">
            <span>{todayMeditation.scripture_reference}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {todayMeditation.scripture_translation}
            </span>
          </div>
          <p className="font-serif-title italic text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-100 leading-relaxed text-pretty">
            « {todayMeditation.scripture_text} »
          </p>
        </div>

        {/* Reflection Excerpt */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed sm:leading-loose line-clamp-3 mb-5 sm:mb-6 text-pretty">
          {todayMeditation.reflection}
        </p>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-slate-100 dark:border-blue-950/60">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onReadMeditation(todayMeditation.day_number)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E56B7] to-[#2563EB] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer min-h-[46px]"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Lire la méditation</span>
            </button>

            <button
              onClick={() => setShowPrayerModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl border border-[#DC2626]/40 bg-[#DC2626]/10 px-4 py-3 text-xs sm:text-sm font-semibold text-[#DC2626] dark:text-[#F87171] hover:bg-[#DC2626]/20 transition cursor-pointer min-h-[46px]"
            >
              <Heart className="w-4 h-4 fill-current shrink-0" />
              <span>Prier maintenant</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 w-full sm:w-auto justify-end">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{todayMeditation.estimated_reading_minutes} min de lecture</span>
            </span>

            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Complété</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Annual Progression Bar & Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Annual Journey Card with Globe Blue gradient */}
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Parcours « 365 Jours avec Dieu »
              </span>
              <span className="font-bold text-[#1E56B7] dark:text-[#60A5FA]">
                {completedCount} / 365 jours ({annualPercentage}%)
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1E56B7] via-[#2563EB] to-[#DC2626] transition-all duration-500"
                style={{ width: `${Math.max(2, annualPercentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Un cheminement d’amour, de foi et de persévérance. Reprenez là où vous en êtes en toute paix.
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-blue-950/60 flex justify-between items-center">
            <button
              onClick={onNavigateToProgram}
              className="text-xs font-bold text-[#1E56B7] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
            >
              <span>Voir tout le catalogue des 365 jours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Journal Access Card */}
        <div
          onClick={onNavigateToJournal}
          className="rounded-3xl border border-slate-200 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-5 shadow-sm flex flex-col justify-between hover:border-[#1E56B7]/60 transition cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <BookMarked className="w-4 h-4 text-[#1E56B7]" />
              <span>Journal Spirituel</span>
            </div>
            <h3 className="font-serif-title font-bold text-base text-slate-900 dark:text-white group-hover:text-[#1E56B7] transition">
              Déposez vos pensées et prières
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Gardez une trace vivante de ce que Dieu accomplit dans votre vie au quotidien.
            </p>
          </div>

          <div className="text-xs font-bold text-[#1E56B7] dark:text-[#60A5FA] flex items-center gap-1 pt-3">
            <span>Ouvrir mon carnet</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {showPrayerModal && (
        <PrayerModal
          meditation={todayMeditation}
          onClose={() => setShowPrayerModal(false)}
        />
      )}
    </div>
  );
};
