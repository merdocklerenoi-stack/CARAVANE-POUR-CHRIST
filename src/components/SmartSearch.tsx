import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, BookMarked, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Meditation } from '../types';
import { StorageService } from '../services/storage';

interface SmartSearchProps {
  meditations: Meditation[];
  onSelectMeditation: (dayNumber: number) => void;
  onOpenJournal: () => void;
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  meditations,
  onSelectMeditation,
  onOpenJournal
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meditations' | 'journal'>('all');

  const progress = StorageService.getProgress();
  const journalEntries = StorageService.getJournalEntries();

  const searchResults = useMemo(() => {
    if (!query.trim()) return { meditations: [], journal: [] };
    const cleanQuery = normalizeString(query);

    const matchedMeditations = meditations.filter((m) => {
      const matchTitle = normalizeString(m.title).includes(cleanQuery);
      const matchRef = normalizeString(m.scripture_reference).includes(cleanQuery);
      const matchTheme = normalizeString(m.theme).includes(cleanQuery);
      const matchText = normalizeString(m.scripture_text).includes(cleanQuery);
      const matchReflection = normalizeString(m.reflection).includes(cleanQuery);
      const matchDay = m.day_number.toString() === cleanQuery || `jour ${m.day_number}` === cleanQuery;

      return matchTitle || matchRef || matchTheme || matchText || matchReflection || matchDay;
    });

    const matchedJournal = journalEntries.filter((entry) => {
      const matchTitle = normalizeString(entry.title).includes(cleanQuery);
      const matchContent = normalizeString(entry.content).includes(cleanQuery);
      const matchTopics = entry.prayer_topics?.some((t) => normalizeString(t).includes(cleanQuery));

      return matchTitle || matchContent || matchTopics;
    });

    return {
      meditations: matchedMeditations,
      journal: matchedJournal
    };
  }, [query, meditations, journalEntries]);

  const totalResults =
    (filterType === 'all' || filterType === 'meditations' ? searchResults.meditations.length : 0) +
    (filterType === 'all' || filterType === 'journal' ? searchResults.journal.length : 0);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2 text-balance">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Recherche Intelligente</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-pretty">
          Trouvez instantanément un verset, un mot-clé spirituel, une méditation ou vos notes personnelles.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-sm mb-6 space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : Proverbes 3, Pardon, Paix, Foi, Prière, Amour..."
            className="w-full rounded-2xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-100 dark:border-blue-900/60 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
            autoFocus
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#1E56B7] text-white font-bold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/50 text-slate-600 dark:text-slate-300'
            }`}
          >
            Tout afficher
          </button>
          <button
            onClick={() => setFilterType('meditations')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              filterType === 'meditations'
                ? 'bg-[#1E56B7] text-white font-bold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/50 text-slate-600 dark:text-slate-300'
            }`}
          >
            Méditations bibliques ({searchResults.meditations.length})
          </button>
          <button
            onClick={() => setFilterType('journal')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              filterType === 'journal'
                ? 'bg-[#1E56B7] text-white font-bold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/50 text-slate-600 dark:text-slate-300'
            }`}
          >
            Mon Journal privé ({searchResults.journal.length})
          </button>
        </div>
      </div>

      {!query.trim() && (
        <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recherches suggérées</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {['La paix intérieure', 'Prier dans le secret', 'Proverbes 3:5', 'Le pardon', 'La persévérance', 'Le Saint-Esprit', 'La gratitude', 'L’amour inconditionnel'].map((sugg) => (
              <button
                key={sugg}
                onClick={() => setQuery(sugg)}
                className="rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-[#1E56B7] hover:text-[#1E56B7] transition cursor-pointer"
              >
                {sugg}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() && (
        <div className="space-y-6">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
            {totalResults} résultat(s) trouvé(s) pour « {query} »
          </div>

          {(filterType === 'all' || filterType === 'meditations') && searchResults.meditations.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Méditations des 365 Jours ({searchResults.meditations.length})</span>
              </h2>

              <div className="space-y-3">
                {searchResults.meditations.map((item) => {
                  const isCompleted = progress.completed_days.includes(item.day_number);
                  const isFav = progress.favorites.includes(item.day_number);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectMeditation(item.day_number)}
                      className="group rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs hover:border-[#1E56B7] transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-[#1E56B7]/15 dark:bg-[#1E56B7]/30 text-[#1E56B7] dark:text-[#60A5FA] px-2 py-0.5 text-[10px] font-bold">
                            Jour {item.day_number}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {item.theme}
                          </span>
                          {isFav && <Star className="w-3 h-3 text-[#F59E0B] fill-current" />}
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>

                        <h3 className="font-serif-title font-bold text-base text-slate-900 dark:text-white group-hover:text-[#1E56B7] dark:group-hover:text-[#60A5FA] transition">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                          « {item.scripture_text} » — <span className="font-bold text-[#DC2626] not-italic">{item.scripture_reference}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#1E56B7] dark:text-[#60A5FA] self-end sm:self-center shrink-0">
                        <span>Ouvrir</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(filterType === 'all' || filterType === 'journal') && searchResults.journal.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-3 flex items-center gap-2">
                <BookMarked className="w-4 h-4" />
                <span>Notes privées de votre journal ({searchResults.journal.length})</span>
              </h2>

              <div className="space-y-3">
                {searchResults.journal.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={onOpenJournal}
                    className="group rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs hover:border-[#1E56B7] transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#1E56B7] dark:text-[#60A5FA]">
                        {entry.day_number ? `Jour ${entry.day_number}` : 'Réflexion personnelle'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(entry.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <h3 className="font-serif-title font-bold text-base text-slate-900 dark:text-white group-hover:text-[#1E56B7] transition">
                      {entry.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12 rounded-3xl border border-dashed border-blue-200 dark:border-blue-950/80 p-8">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Aucun résultat pour « {query} »
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vérifiez l’orthographe ou essayez un mot plus général (ex : prière, paix, foi).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
