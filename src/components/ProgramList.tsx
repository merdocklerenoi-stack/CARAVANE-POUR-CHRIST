import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Clock, Star, BookOpen } from 'lucide-react';
import { SpiritualTheme, Meditation } from '../types';
import { ALL_SPIRITUAL_THEMES } from '../data/meditations';
import { StorageService } from '../services/storage';

interface ProgramListProps {
  meditations: Meditation[];
  onSelectMeditation: (dayNumber: number) => void;
}

export const ProgramList: React.FC<ProgramListProps> = ({ meditations, onSelectMeditation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'todo'>('all');
  const [selectedTrimester, setSelectedTrimester] = useState<number>(0);

  const progress = StorageService.getProgress();

  const filteredMeditations = useMemo(() => {
    return meditations.filter((m) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesRef = m.scripture_reference.toLowerCase().includes(query);
        const matchesTheme = m.theme.toLowerCase().includes(query);
        const matchesDay = m.day_number.toString() === query || `jour ${m.day_number}` === query;
        if (!matchesTitle && !matchesRef && !matchesTheme && !matchesDay) return false;
      }

      if (selectedTheme !== 'all' && m.theme !== selectedTheme) {
        return false;
      }

      const isCompleted = progress.completed_days.includes(m.day_number);
      if (selectedStatus === 'completed' && !isCompleted) return false;
      if (selectedStatus === 'todo' && isCompleted) return false;

      if (selectedTrimester === 1 && (m.day_number < 1 || m.day_number > 90)) return false;
      if (selectedTrimester === 2 && (m.day_number < 91 || m.day_number > 180)) return false;
      if (selectedTrimester === 3 && (m.day_number < 181 || m.day_number > 270)) return false;
      if (selectedTrimester === 4 && (m.day_number < 271 || m.day_number > 365)) return false;

      return true;
    });
  }, [meditations, searchTerm, selectedTheme, selectedStatus, selectedTrimester, progress.completed_days]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Page Title with Logo Colors */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2 text-balance">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Programme des 365 Jours avec Dieu</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-pretty">
          Explorez l’ensemble du parcours, filtrez par thème spirituel ou recherchez un passage.
        </p>
      </div>

      {/* Controls & Filters Bar */}
      <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-3.5 sm:p-5 shadow-sm mb-5 sm:mb-6 space-y-3 sm:space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par titre, jour (ex: 15), référence (ex: Proverbes 3:5)..."
            className="w-full rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
          />
        </div>

        {/* Filter Pills - scrollable on mobile */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Trimester buttons */}
          <div className="inline-flex rounded-xl bg-blue-50/80 dark:bg-blue-950/60 p-0.5 sm:p-1 border border-blue-100 dark:border-blue-900/40 overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedTrimester(0)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTrimester === 0 ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tous (365)
            </button>
            <button
              onClick={() => setSelectedTrimester(1)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTrimester === 1 ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              T1 (1-90)
            </button>
            <button
              onClick={() => setSelectedTrimester(2)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTrimester === 2 ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              T2 (91-180)
            </button>
            <button
              onClick={() => setSelectedTrimester(3)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTrimester === 3 ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              T3 (181-270)
            </button>
            <button
              onClick={() => setSelectedTrimester(4)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTrimester === 4 ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              T4 (271-365)
            </button>
          </div>

          {/* Status selector */}
          <div className="inline-flex rounded-xl bg-blue-50/80 dark:bg-blue-950/60 p-0.5 sm:p-1 border border-blue-100 dark:border-blue-900/40">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                selectedStatus === 'all' ? 'bg-white dark:bg-[#0A152E] text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                selectedStatus === 'completed' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Terminés
            </button>
            <button
              onClick={() => setSelectedStatus('todo')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition cursor-pointer ${
                selectedStatus === 'todo' ? 'bg-[#DC2626] text-white font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              À découvrir
            </button>
          </div>

          {/* Theme Dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto sm:ml-auto">
            <Filter className="w-3.5 h-3.5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full sm:w-auto rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#1E56B7]"
            >
              <option value="all">Tous les thèmes ({ALL_SPIRITUAL_THEMES.length})</option>
              {ALL_SPIRITUAL_THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 px-1">
        <span>{filteredMeditations.length} méditation(s) affichée(s)</span>
        <span className="font-semibold text-[#1E56B7] dark:text-[#60A5FA]">
          {progress.completed_days.length} / 365 complétées ({Math.round((progress.completed_days.length / 365) * 100)}%)
        </span>
      </div>

      {/* Meditations Grid with Logo Blue & Red styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeditations.map((item) => {
          const isCompleted = progress.completed_days.includes(item.day_number);
          const isFav = progress.favorites.includes(item.day_number);

          return (
            <div
              key={item.id}
              onClick={() => onSelectMeditation(item.day_number)}
              className="group relative rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-5 shadow-xs hover:shadow-md hover:border-[#1E56B7] transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#1E56B7]/15 dark:bg-[#1E56B7]/30 text-[#1E56B7] dark:text-[#60A5FA] px-2.5 py-0.5 text-xs font-bold border border-[#1E56B7]/20">
                    Jour {item.day_number}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isFav && <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />}
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>

                <h3 className="font-serif-title font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#1E56B7] dark:group-hover:text-[#60A5FA] transition leading-snug mb-1.5">
                  {item.title}
                </h3>

                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-3">
                  Thème : <span className="text-slate-700 dark:text-slate-300">{item.theme}</span>
                </div>

                <div className="rounded-xl bg-blue-50/50 dark:bg-[#0A1428]/60 p-2.5 border border-blue-100/60 dark:border-blue-950/60 mb-3 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                  « {item.scripture_text} »
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-blue-950/60 pt-3 mt-1">
                <span className="font-bold text-[#DC2626] dark:text-[#F87171]">
                  {item.scripture_reference}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.estimated_reading_minutes} min</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
