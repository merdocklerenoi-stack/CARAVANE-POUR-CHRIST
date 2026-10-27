import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  BookOpen,
  X,
  Save,
  Lock
} from 'lucide-react';
import { Meditation, SpiritualTheme } from '../types';
import { ALL_SPIRITUAL_THEMES } from '../data/meditations';
import { StorageService } from '../services/storage';

interface AdminViewProps {
  meditations: Meditation[];
  onRefreshMeditations: () => void;
  onPreviewMeditation: (dayNumber: number) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  meditations,
  onRefreshMeditations,
  onPreviewMeditation
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState(false);

  const [editingMeditation, setEditingMeditation] = useState<Meditation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formDayNumber, setFormDayNumber] = useState<number>(1);
  const [formTitle, setFormTitle] = useState('');
  const [formTheme, setFormTheme] = useState<SpiritualTheme>('La foi');
  const [formRef, setFormRef] = useState('');
  const [formText, setFormText] = useState('');
  const [formTranslation, setFormTranslation] = useState('Louis Segond 1910');
  const [formReflection, setFormReflection] = useState('');
  const [formQuestions, setFormQuestions] = useState('');
  const [formPrayer, setFormPrayer] = useState('');
  const [formAction, setFormAction] = useState('');
  const [formMinutes, setFormMinutes] = useState(4);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '777' || adminPin.toLowerCase() === 'caravane' || adminPin === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const stats = useMemo(() => {
    const dayNumbers = meditations.map((m) => m.day_number);
    const duplicates: number[] = [];
    const seen = new Set<number>();
    dayNumbers.forEach((num) => {
      if (seen.has(num)) duplicates.push(num);
      seen.add(num);
    });

    const missingDays: number[] = [];
    for (let i = 1; i <= 365; i++) {
      if (!seen.has(i)) missingDays.push(i);
    }

    const publishedCount = meditations.filter((m) => m.status === 'published').length;

    return {
      total: meditations.length,
      published: publishedCount,
      drafts: meditations.length - publishedCount,
      duplicates,
      missingDays
    };
  }, [meditations]);

  const handleOpenCreate = () => {
    const nextDay = stats.missingDays.length > 0 ? stats.missingDays[0] : meditations.length + 1;
    setFormDayNumber(nextDay);
    setFormTitle('');
    setFormTheme('La foi');
    setFormRef('');
    setFormText('');
    setFormTranslation('Louis Segond 1910');
    setFormReflection('');
    setFormQuestions('');
    setFormPrayer('');
    setFormAction('');
    setFormMinutes(4);
    setFormStatus('published');
    setEditingMeditation({} as Meditation);
  };

  const handleOpenEdit = (m: Meditation) => {
    setFormDayNumber(m.day_number);
    setFormTitle(m.title);
    setFormTheme(m.theme);
    setFormRef(m.scripture_reference);
    setFormText(m.scripture_text);
    setFormTranslation(m.scripture_translation || 'Louis Segond 1910');
    setFormReflection(m.reflection);
    setFormQuestions(m.reflection_questions?.join('\n') || '');
    setFormPrayer(m.prayer);
    setFormAction(m.practical_action);
    setFormMinutes(m.estimated_reading_minutes || 4);
    setFormStatus(m.status);
    setEditingMeditation(m);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formText.trim()) return;

    const questionsArray = formQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    const updatedMeditation: Meditation = {
      id: editingMeditation?.id || `cpc-day-${formDayNumber}`,
      day_number: formDayNumber,
      title: formTitle.trim(),
      theme: formTheme,
      scripture_reference: formRef.trim(),
      scripture_text: formText.trim(),
      scripture_translation: formTranslation.trim(),
      reflection: formReflection.trim(),
      reflection_questions: questionsArray,
      prayer: formPrayer.trim(),
      practical_action: formAction.trim(),
      estimated_reading_minutes: formMinutes,
      status: formStatus,
      published_at: new Date().toISOString().split('T')[0]
    };

    StorageService.saveCustomMeditation(updatedMeditation);
    onRefreshMeditations();
    setEditingMeditation(null);
  };


  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return meditations.slice(0, 50);
    const q = searchTerm.toLowerCase();
    return meditations.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.day_number.toString() === q ||
        m.scripture_reference.toLowerCase().includes(q)
    );
  }, [meditations, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-8 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-[#DC2626]/15 text-[#DC2626] w-fit mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold font-serif-title text-[#0A152E] dark:text-white mb-2">
            Administration du Contenu
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Espace réservé aux responsables pastoraux et administrateurs pour créer, modifier et vérifier les 365 méditations.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Code d'accès pasteur/admin (code: 777)"
                className="w-full text-center rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
                autoFocus
              />
              {authError && (
                <span className="text-xs text-[#DC2626] mt-1 block">
                  Code incorrect. Utilisez « 777 » pour cette version de démonstration.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] py-2.5 text-xs sm:text-sm font-bold text-white hover:brightness-110 transition shadow-md cursor-pointer"
            >
              Déverrouiller l'administration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
              Accès Administrateur Déverrouillé
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white mt-1 text-balance">
            Gestion du Contenu des 365 Jours
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-pretty">
            Édition, contrôle qualité et surveillance de l'intégrité du programme spirituel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer Méditation</span>
          </button>
        </div>
      </div>

      {/* Quality & Integrity Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs">
          <div className="text-xs text-slate-500">Méditations au catalogue</div>
          <div className="text-2xl font-bold text-[#1E56B7] dark:text-[#60A5FA] mt-1">
            {stats.total} / 365
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">
            ✓ Couverture complète de l'année
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs">
          <div className="text-xs text-slate-500">Statut de publication</div>
          <div className="text-2xl font-bold text-[#0A152E] dark:text-white mt-1">
            {stats.published}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.drafts} brouillon(s)
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs">
          <div className="text-xs text-slate-500">Détection de doublons</div>
          <div className="text-2xl font-bold text-[#0A152E] dark:text-white mt-1">
            {stats.duplicates.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.duplicates.length === 0 ? '✓ Aucun conflit de jour' : `Doublons : ${stats.duplicates.join(', ')}`}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 shadow-xs">
          <div className="text-xs text-slate-500">Jours manquants (1 à 365)</div>
          <div className="text-2xl font-bold text-[#0A152E] dark:text-white mt-1">
            {stats.missingDays.length}
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">
            {stats.missingDays.length === 0 ? '✓ Calendrier intégralement comblé' : `Manquants : ${stats.missingDays.slice(0, 5).join(', ')}`}
          </div>
        </div>
      </div>

      {/* Quick Search in Admin */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une méditation à éditer par jour ou mot-clé..."
          className="w-full rounded-2xl bg-white dark:bg-[#0E1C38] border border-blue-100 dark:border-blue-950/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
        />
      </div>

      {/* Meditations Table */}
      <div className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-50/50 dark:bg-blue-950/40 text-[#1E56B7] dark:text-[#60A5FA] border-b border-blue-100 dark:border-blue-950/80 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Jour</th>
                <th className="py-3 px-4">Titre</th>
                <th className="py-3 px-4">Thème</th>
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-950/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition">
                  <td className="py-3 px-4 font-bold text-[#1E56B7] dark:text-[#60A5FA]">
                    Jour {item.day_number}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {item.theme}
                  </td>
                  <td className="py-3 px-4 text-[#DC2626] dark:text-[#F87171] font-bold">
                    {item.scripture_reference}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'published'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {item.status === 'published' ? 'Publiée' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewMeditation(item.day_number)}
                        className="p-1.5 text-slate-500 hover:text-[#1E56B7] rounded-lg transition"
                        title="Prévisualiser"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-500 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {editingMeditation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setEditingMeditation(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold font-serif-title text-[#0A152E] dark:text-white mb-4">
              {editingMeditation.id ? `Éditer la méditation — Jour ${formDayNumber}` : 'Nouvelle Méditation'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro du jour (1-365) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    required
                    value={formDayNumber}
                    onChange={(e) => setFormDayNumber(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Thème Spirituel *
                  </label>
                  <select
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value as SpiritualTheme)}
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  >
                    {ALL_SPIRITUAL_THEMES.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la méditation *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex : Prendre la route avec confiance"
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Référence biblique *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    placeholder="Ex : Proverbes 3:5-6"
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Traduction biblique
                  </label>
                  <input
                    type="text"
                    value={formTranslation}
                    onChange={(e) => setFormTranslation(e.target.value)}
                    placeholder="Louis Segond 1910"
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Passage biblique (Texte du verset) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-xs text-slate-900 dark:text-white font-serif-title italic"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Texte de la méditation *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formReflection}
                  onChange={(e) => setFormReflection(e.target.value)}
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Questions de réflexion (une par ligne)
                </label>
                <textarea
                  rows={2}
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  placeholder="Question 1...&#10;Question 2..."
                  className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prière proposée
                  </label>
                  <textarea
                    rows={2}
                    value={formPrayer}
                    onChange={(e) => setFormPrayer(e.target.value)}
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-xs text-slate-900 dark:text-white font-serif-title italic"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Action pratique du jour
                  </label>
                  <textarea
                    rows={2}
                    value={formAction}
                    onChange={(e) => setFormAction(e.target.value)}
                    className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-200 dark:border-blue-900 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-blue-950/70">
                <button
                  type="button"
                  onClick={() => setEditingMeditation(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] text-white font-bold text-xs hover:brightness-110 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la méditation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
