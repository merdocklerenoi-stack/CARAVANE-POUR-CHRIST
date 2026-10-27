import React, { useState, useMemo } from 'react';
import { Star, Search, Clock, ArrowRight, Trash2, BookOpen } from 'lucide-react';
import { Meditation } from '../types';
import { StorageService } from '../services/storage';

interface FavoritesViewProps {
  meditations: Meditation[];
  onSelectMeditation: (dayNumber: number) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ meditations, onSelectMeditation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>(() => StorageService.getProgress().favorites);

  const handleRemoveFavorite = (e: React.MouseEvent, dayNumber: number) => {
    e.stopPropagation();
    StorageService.toggleFavorite(dayNumber);
    setFavorites(StorageService.getProgress().favorites);
  };

  const favoriteMeditations = useMemo(() => {
    return meditations
      .filter((m) => favorites.includes(m.day_number))
      .filter((m) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.scripture_reference.toLowerCase().includes(q) ||
          m.theme.toLowerCase().includes(q)
        );
      });
  }, [meditations, favorites, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2 text-balance">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B] fill-current shrink-0" />
          <span>Mes Méditations Favorites</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-pretty">
          Retrouvez les passages et méditations qui ont particulièrement fortifié votre foi.
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher parmi vos favoris..."
            className="w-full rounded-2xl bg-white dark:bg-[#0E1C38] border border-blue-100 dark:border-blue-950/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favoriteMeditations.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMeditation(item.day_number)}
            className="group relative rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-5 shadow-xs hover:shadow-md hover:border-[#1E56B7] transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-full bg-[#1E56B7]/15 dark:bg-[#1E56B7]/30 text-[#1E56B7] dark:text-[#60A5FA] px-2.5 py-0.5 text-xs font-bold border border-[#1E56B7]/20">
                  Jour {item.day_number}
                </span>

                <button
                  onClick={(e) => handleRemoveFavorite(e, item.day_number)}
                  className="p-1.5 text-slate-400 hover:text-[#DC2626] rounded-lg transition"
                  title="Retirer des favoris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-serif-title font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#1E56B7] dark:group-hover:text-[#60A5FA] transition mb-1 leading-snug">
                {item.title}
              </h3>

              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2.5">
                Thème : {item.theme}
              </div>

              <p className="rounded-xl bg-blue-50/50 dark:bg-[#0A1428]/60 p-3 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 mb-3 border border-blue-100/50 dark:border-blue-950/50">
                « {item.scripture_text} »
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-blue-950/60">
              <span className="font-bold text-[#DC2626] dark:text-[#F87171]">
                {item.scripture_reference}
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition text-[#1E56B7] dark:text-[#60A5FA] font-bold">
                <span>Lire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {favoriteMeditations.length === 0 && (
        <div className="text-center py-16 rounded-3xl border border-dashed border-blue-200 dark:border-blue-950/80 p-8">
          <Star className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Aucune méditation favorite pour le moment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Lorsque vous lisez une méditation, cliquez sur l’étoile pour l’enregistrer dans cette liste et la relire à tout moment.
          </p>
        </div>
      )}
    </div>
  );
};
