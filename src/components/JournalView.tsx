import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  Plus,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Tag,
  X,
  AlertCircle
} from 'lucide-react';
import { JournalEntry, JournalMood } from '../types';
import { StorageService } from '../services/storage';

interface JournalViewProps {
  initialDayFilter?: number;
  onOpenMeditation?: (dayNumber: number) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ initialDayFilter, onOpenMeditation }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => StorageService.getJournalEntries());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dayNumber, setDayNumber] = useState<number | undefined>(initialDayFilter);
  const [mood, setMood] = useState<JournalMood>('peace');
  const [prayerTopicsInput, setPrayerTopicsInput] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const moodLabels: Record<JournalMood, { label: string; icon: string; color: string }> = {
    peace: { label: 'Paix intérieure', icon: '🕊️', color: 'bg-blue-100 text-[#1E56B7] dark:bg-blue-950/60 dark:text-[#93C5FD]' },
    gratitude: { label: 'Gratitude / Merci', icon: '🙏', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    joy: { label: 'Joie spirituelle', icon: '✨', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    trial: { label: 'Dans l’épreuve', icon: '🛡️', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
    seeking: { label: 'Recherche de direction', icon: '🧭', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
    praise: { label: 'Louange & Adoration', icon: '👑', color: 'bg-rose-100 text-[#DC2626] dark:bg-rose-950/60 dark:text-[#F87171]' }
  };

  const reloadEntries = () => {
    setEntries(StorageService.getJournalEntries());
  };

  const handleOpenNewEntry = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setDayNumber(initialDayFilter || undefined);
    setMood('peace');
    setPrayerTopicsInput('');
    setIsEditing(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setDayNumber(entry.day_number);
    setMood(entry.mood || 'peace');
    setPrayerTopicsInput(entry.prayer_topics ? entry.prayer_topics.join(', ') : '');
    setIsEditing(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const topics = prayerTopicsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editId) {
      StorageService.updateJournalEntry(editId, {
        title: title.trim(),
        content: content.trim(),
        day_number: dayNumber || undefined,
        mood,
        prayer_topics: topics
      });
    } else {
      StorageService.addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        day_number: dayNumber || undefined,
        mood,
        prayer_topics: topics
      });
    }

    reloadEntries();
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteJournalEntry(id);
    setDeleteConfirmId(null);
    reloadEntries();
  };


  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesContent = entry.content.toLowerCase().includes(q);
        const matchesTopic = entry.prayer_topics?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTopic) return false;
      }

      if (moodFilter !== 'all' && entry.mood !== moodFilter) {
        return false;
      }

      return true;
    });
  }, [entries, searchTerm, moodFilter]);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2 text-balance">
            <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
            <span>Journal Spirituel Personnel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-pretty">
            Votre carnet privé pour consigner vos exaucements, prières et cheminements avec Dieu.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleOpenNewEntry}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56B7] via-[#2563EB] to-[#DC2626] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer min-h-[42px]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nouvelle réflexion</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg sm:text-xl font-bold font-serif-title text-[#0A152E] dark:text-white mb-4">
              {editId ? 'Modifier la note' : 'Écrire une nouvelle note spirituelle'}
            </h2>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de votre réflexion *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Ce que Dieu m'a enseigné aujourd'hui sur le pardon..."
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jour associé (1 à 365, facultatif)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={dayNumber || ''}
                    onChange={(e) => setDayNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Numéro du jour..."
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ressenti spirituel
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as JournalMood)}
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
                  >
                    {Object.entries(moodLabels).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.icon} {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sujets de prière (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={prayerTopicsInput}
                  onChange={(e) => setPrayerTopicsInput(e.target.value)}
                  placeholder="Ex : Famille, Guérison de Marc, Discernement professionnel"
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Texte de votre méditation personnelle *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Exprimez librement votre prière, vos interrogations, vos joies ou ce que le Seigneur a placé sur votre cœur..."
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] text-white text-xs sm:text-sm font-bold hover:brightness-110 transition shadow-md"
                >
                  Enregistrer ma note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-white dark:bg-[#0E1C38] p-6 shadow-2xl text-center">
            <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Supprimer cette note du journal ?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Cette action est irréversible. La note sera définitivement effacée de votre appareil.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-rose-700"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans mes notes, prières, ressentis..."
            className="w-full rounded-2xl bg-white dark:bg-[#0E1C38] border border-blue-100 dark:border-blue-950/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#1E56B7]"
          />
        </div>

        <select
          value={moodFilter}
          onChange={(e) => setMoodFilter(e.target.value)}
          className="rounded-2xl bg-white dark:bg-[#0E1C38] border border-blue-100 dark:border-blue-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#1E56B7]"
        >
          <option value="all">Tous les ressentis</option>
          {Object.entries(moodLabels).map(([key, item]) => (
            <option key={key} value={key}>
              {item.icon} {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const moodConfig = entry.mood ? moodLabels[entry.mood] : null;

          return (
              <div
                key={entry.id}
                className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-xs hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-2">
                    {moodConfig && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${moodConfig.color}`}>
                        <span>{moodConfig.icon}</span>
                        <span>{moodConfig.label}</span>
                      </span>
                    )}

                    {entry.day_number && (
                      <button
                        onClick={() => onOpenMeditation && onOpenMeditation(entry.day_number!)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#1E56B7]/15 dark:bg-[#1E56B7]/30 text-[#1E56B7] dark:text-[#60A5FA] px-2.5 py-0.5 text-xs font-bold hover:bg-[#1E56B7]/25 transition cursor-pointer border border-[#1E56B7]/20"
                      >
                        <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                        <span>Jour {entry.day_number}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>

                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-1.5 text-slate-400 hover:text-[#1E56B7] rounded-lg transition p-1"
                      title="Modifier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-[#DC2626] rounded-lg transition p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif-title text-[#0A152E] dark:text-white mb-2 text-balance break-words">
                  {entry.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-loose whitespace-pre-line mb-4 font-sans-body break-words text-pretty">
                  {entry.content}
                </p>

              {entry.prayer_topics && entry.prayer_topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-blue-950/60">
                  <Tag className="w-3 h-3 text-[#1E56B7]" />
                  <span className="text-[11px] text-slate-400 font-medium">Sujets de prière :</span>
                  {entry.prayer_topics.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[11px] text-[#1E56B7] dark:text-[#93C5FD]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 rounded-3xl border border-dashed border-blue-200 dark:border-blue-950/80 p-8">
            <BookMarked className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Votre journal spirituel est encore vierge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Prenez quelques instants pour noter ce que Dieu a accompli ou une prière qui monte de votre cœur.
            </p>
            <button
              onClick={handleOpenNewEntry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Créer ma première note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
