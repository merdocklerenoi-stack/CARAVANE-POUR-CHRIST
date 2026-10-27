import React from 'react';
import {
  Award,
  CheckCircle2,
  Calendar,
  Flame,
  Star,
  BookMarked,
  Sparkles,
  Footprints,
  HeartHandshake,
  Compass,
  Crown,
  BookOpen
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface ProfileProgressProps {
  onContinueReading: () => void;
}

export const ProfileProgress: React.FC<ProfileProgressProps> = ({ onContinueReading }) => {
  const progress = StorageService.getProgress();
  const settings = StorageService.getSettings();
  const journalEntries = StorageService.getJournalEntries();
  const badges = StorageService.getBadges();

  const completedCount = progress.completed_days.length;
  const percentage = Math.round((completedCount / 365) * 100);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? 'text-[#F59E0B]' : 'text-slate-400 opacity-40'}`;
    switch (iconName) {
      case 'Footprints':
        return <Footprints className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getEncouragement = () => {
    if (completedCount === 0) {
      return '« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. » (Matthieu 11:28). Commencez aujourd’hui, le Seigneur vous attend !';
    } else if (completedCount < 10) {
      return 'Magnifique début ! Chaque graine de vérité semée dans votre cœur porte du fruit pour l’éternité.';
    } else if (completedCount < 50) {
      return 'Votre fidélité honore Dieu. Votre caravane avance avec assurance sous le regard bienveillant du Père.';
    } else if (completedCount < 150) {
      return 'Un quart du chemin spirituel parcouru ! « Ta parole est une lampe à mes pieds ». Persévérez dans la paix.';
    } else {
      return '« J’ai combattu le bon combat, j’ai achevé la course, j’ai gardé la foi. » Votre persévérance est une lumière !';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header Profile Summary with Globe Blue & Deep Navy */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E56B7]/40 bg-gradient-to-br from-[#070E1E] via-[#0A152E] to-[#0E2044] text-white p-4 sm:p-7 md:p-8 shadow-xl mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <img
                src="/logo.jpg"
                alt="Logo Caravane Pour Christ"
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-[#1E56B7] ring-2 ring-[#DC2626]/40 object-cover shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-[#0A152E]" />
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Pèlerin de la Caravane</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-serif-title font-bold text-white truncate text-balance">
                {settings.display_name || 'Pèlerin de Christ'}
              </h1>
              <p className="text-[11px] sm:text-xs text-blue-200 mt-0.5 truncate">
                Programme « 365 jours avec Dieu » • Édition Quotidienne
              </p>
            </div>
          </div>

          <button
            onClick={onContinueReading}
            className="w-full sm:w-auto text-center rounded-2xl bg-gradient-to-r from-[#1E56B7] via-[#2563EB] to-[#DC2626] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer min-h-[46px]"
          >
            Reprendre la méditation (Jour {progress.last_read_day})
          </button>
        </div>

        {/* Annual progress bar with Globe Blue to Red gradient */}
        <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-blue-900/50">
          <div className="flex items-center justify-between text-xs text-blue-100 mb-2">
            <span className="font-medium">Progression Annuelle</span>
            <span className="font-bold text-[#38BDF8]">{percentage}% ({completedCount} / 365 jours)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-blue-950/80 overflow-hidden p-0.5 border border-blue-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1E56B7] via-[#38BDF8] to-[#DC2626] transition-all duration-700"
              style={{ width: `${Math.max(2, percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Méditations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A152E] dark:text-white">{completedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">jours achevés</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Série active</span>
            <Flame className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#DC2626] dark:text-[#F87171]">{progress.streak_count}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">jours consécutifs</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Favoris</span>
            <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A152E] dark:text-white">{progress.favorites.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">passages sauvés</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Journal</span>
            <BookMarked className="w-4 h-4 text-[#1E56B7]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0A152E] dark:text-white">{journalEntries.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">notes privées</div>
          </div>
        </div>
      </div>

      {/* Encouragement Card */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-5 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Parole d’encouragement pour votre marche</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
          « {getEncouragement()} »
        </p>
      </div>

      {/* Spiritual Badges & Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-serif-title font-bold text-[#0A152E] dark:text-white">
              Jalons & Badges Spirituels
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Des étapes concrètes pour célébrer la grâce et la croissance spirituelle.
            </p>
          </div>
          <span className="text-xs font-bold text-[#1E56B7] dark:text-[#60A5FA]">
            {badges.filter((b) => b.unlocked).length} / {badges.length} débloqués
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 border transition flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'border-blue-200 dark:border-blue-900/60 bg-white dark:bg-[#0E1C38] shadow-xs'
                  : 'border-slate-100 dark:border-blue-950/40 bg-blue-50/30 dark:bg-[#070E1E]/40 opacity-60'
              }`}
            >
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  badge.unlocked ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                {renderBadgeIcon(badge.icon, badge.unlocked)}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-bold text-sm text-[#0A152E] dark:text-white">
                    {badge.name}
                  </h4>
                  {badge.unlocked && (
                    <span className="text-[10px] font-bold text-emerald-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-1.5">
                  {badge.description}
                </p>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  Critère : {badge.criteria}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
