/**
 * CARAVANE POUR CHRIST — Service de stockage local & synchronisation
 * Fonctionne immédiatement hors ligne (offline-first) et offre la possibilité
 * de synchronisation avec Supabase.
 */

import { JournalEntry, Meditation, SpiritualBadge, UserProgress, UserSettings } from '../types';
import { getAllMeditations, getDayOfYear } from '../data/meditations';

const PROGRESS_KEY = 'caravane_progress_v1';
const SETTINGS_KEY = 'caravane_settings_v1';
const JOURNAL_KEY = 'caravane_journal_v1';
const CUSTOM_MEDITATIONS_KEY = 'caravane_custom_meditations_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  display_name: 'Pèlerin de Christ',
  theme: 'dark',
  font_size: 'normal',
  reminder_enabled: true,
  reminder_time: '07:00',
  progression_mode: 'sequential',
  speech_rate: 1.0,
  supabase_url: '',
  supabase_anon_key: ''
};

export const DEFAULT_PROGRESS: UserProgress = {
  completed_days: [],
  started_days: [],
  favorites: [1, 2], // Découverte initiale
  last_read_day: 1,
  streak_count: 1,
  last_read_date: new Date().toISOString().split('T')[0]
};

// INITIAL SAMPLE JOURNAL NOTE to welcome the user
const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'journal-welcome-1',
    day_number: 1,
    title: 'Mon premier pas dans la caravane',
    content: 'Aujourd’hui, je choisis d’inscrire ce temps quotidien de méditation avec Dieu dans mon emploi du temps. Que ce parcours de 365 jours transforme mon cœur, ma famille et fortifie ma foi en Jésus-Christ.',
    mood: 'peace',
    prayer_topics: ['Persévérance dans la prière', 'Paix dans mon foyer', 'Sagesse dans mon travail'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class StorageService {
  // --- Progression Utilisateur ---
  static getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (!data) return DEFAULT_PROGRESS;
      return { ...DEFAULT_PROGRESS, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Erreur lecture progression:', e);
      return DEFAULT_PROGRESS;
    }
  }

  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      window.dispatchEvent(new Event('caravane-progress-updated'));
    } catch (e) {
      console.error('Erreur sauvegarde progression:', e);
    }
  }

  static markDayCompleted(dayNumber: number): UserProgress {
    const current = this.getProgress();
    const today = new Date().toISOString().split('T')[0];

    let newCompleted = [...current.completed_days];
    if (!newCompleted.includes(dayNumber)) {
      newCompleted.push(dayNumber);
      newCompleted.sort((a, b) => a - b);
    }

    // Calcul de la série (streak)
    let newStreak = current.streak_count;
    if (current.last_read_date !== today) {
      // Si la dernière lecture était hier, on incrémente
      const lastDate = new Date(current.last_read_date);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reprise douce
      }
    }

    const updated: UserProgress = {
      ...current,
      completed_days: newCompleted,
      last_read_day: dayNumber,
      last_read_date: today,
      streak_count: Math.max(1, newStreak)
    };

    this.saveProgress(updated);
    return updated;
  }

  static toggleFavorite(dayNumber: number): boolean {
    const current = this.getProgress();
    let newFavs = [...current.favorites];
    const index = newFavs.indexOf(dayNumber);
    let isNowFavorite = false;

    if (index > -1) {
      newFavs.splice(index, 1);
      isNowFavorite = false;
    } else {
      newFavs.push(dayNumber);
      newFavs.sort((a, b) => a - b);
      isNowFavorite = true;
    }

    this.saveProgress({ ...current, favorites: newFavs });
    return isNowFavorite;
  }

  static isFavorite(dayNumber: number): boolean {
    const current = this.getProgress();
    return current.favorites.includes(dayNumber);
  }

  static isDayCompleted(dayNumber: number): boolean {
    const current = this.getProgress();
    return current.completed_days.includes(dayNumber);
  }

  // --- Notification tracking ---
  static getLastNotifiedDate(): string | null {
    try {
      return localStorage.getItem('caravane_last_notified_date_v1');
    } catch (e) {
      return null;
    }
  }

  static setLastNotifiedDate(dateString: string): void {
    try {
      localStorage.setItem('caravane_last_notified_date_v1', dateString);
    } catch (e) {
      // Ignore
    }
  }

  // --- Paramètres Utilisateur ---
  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event('caravane-settings-updated'));
    } catch (e) {
      console.error('Erreur sauvegarde réglages:', e);
    }
  }

  // --- Journal Spirituel ---
  static getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(JOURNAL_KEY);
      if (!data) {
        this.saveJournalEntries(INITIAL_JOURNAL);
        return INITIAL_JOURNAL;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_JOURNAL;
    }
  }

  static saveJournalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
      window.dispatchEvent(new Event('caravane-journal-updated'));
    } catch (e) {
      console.error('Erreur sauvegarde journal:', e);
    }
  }

  static addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): JournalEntry {
    const current = this.getJournalEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updated = [newEntry, ...current];
    this.saveJournalEntries(updated);
    return newEntry;
  }

  static updateJournalEntry(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const current = this.getJournalEntries();
    const index = current.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updatedEntry: JournalEntry = {
      ...current[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    current[index] = updatedEntry;
    this.saveJournalEntries(current);
    return updatedEntry;
  }

  static deleteJournalEntry(id: string): boolean {
    const current = this.getJournalEntries();
    const filtered = current.filter((e) => e.id !== id);
    if (filtered.length !== current.length) {
      this.saveJournalEntries(filtered);
      return true;
    }
    return false;
  }

  // --- Méditations Personnalisées / Admin Overrides ---
  static getCustomMeditations(): Meditation[] {
    try {
      const data = localStorage.getItem(CUSTOM_MEDITATIONS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  static saveCustomMeditation(meditation: Meditation): void {
    const customs = this.getCustomMeditations();
    const idx = customs.findIndex((m) => m.day_number === meditation.day_number || m.id === meditation.id);
    if (idx > -1) {
      customs[idx] = { ...meditation, updated_at: new Date().toISOString() };
    } else {
      customs.push({ ...meditation, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem(CUSTOM_MEDITATIONS_KEY, JSON.stringify(customs));
    window.dispatchEvent(new Event('caravane-meditations-updated'));
  }

  static getEffectiveMeditation(dayNumber: number): Meditation | undefined {
    const customs = this.getCustomMeditations();
    const custom = customs.find((m) => m.day_number === dayNumber);
    if (custom) return custom;
    return getAllMeditations().find((m) => m.day_number === dayNumber);
  }

  static getAllEffectiveMeditations(): Meditation[] {
    const customs = this.getCustomMeditations();
    const base = getAllMeditations();
    const customMap = new Map<number, Meditation>();
    customs.forEach((c) => customMap.set(c.day_number, c));
    return base.map((b) => customMap.get(b.day_number) || b);
  }

  // --- Badges & Jalons Spirituels ---
  static getBadges(): SpiritualBadge[] {
    const progress = this.getProgress();
    const journal = this.getJournalEntries();
    const completedCount = progress.completed_days.length;
    const streak = progress.streak_count;

    return [
      {
        id: 'badge-1',
        name: 'Premier Pas',
        description: 'Avoir complété votre toute première méditation quotidienne.',
        icon: 'Footprints',
        criteria: '1 méditation complétée',
        unlocked: completedCount >= 1
      },
      {
        id: 'badge-7',
        name: 'Semaine de Fidélité',
        description: 'Avoir maintenu une série de 7 jours consécutifs avec Dieu.',
        icon: 'Flame',
        criteria: '7 jours de suite',
        unlocked: streak >= 7 || completedCount >= 7
      },
      {
        id: 'badge-scribe',
        name: 'Scribe du Cœur',
        description: 'Avoir rédigé au moins 3 réflexions dans votre Journal Spirituel.',
        icon: 'BookOpen',
        criteria: '3 notes écrites',
        unlocked: journal.length >= 3
      },
      {
        id: 'badge-prayer',
        name: 'Guerrier dans la Prière',
        description: 'Avoir prié pour au moins 5 sujets de prière différents.',
        icon: 'HeartHandshake',
        criteria: '5 sujets de prière notés',
        unlocked: journal.some((j) => (j.prayer_topics?.length || 0) >= 2) || completedCount >= 10
      },
      {
        id: 'badge-30',
        name: 'Un Mois de Grâce',
        description: 'Avoir achevé 30 jours du parcours spirituel.',
        icon: 'Award',
        criteria: '30 jours complétés',
        unlocked: completedCount >= 30
      },
      {
        id: 'badge-100',
        name: 'Caravane Céleste',
        description: 'Avoir parcouru 100 jours de méditation avec le Seigneur.',
        icon: 'Compass',
        criteria: '100 jours complétés',
        unlocked: completedCount >= 100
      },
      {
        id: 'badge-365',
        name: 'Couronne de Gloire',
        description: 'Avoir complété l’intégralité des 365 jours avec Dieu !',
        icon: 'Crown',
        criteria: '365 jours complétés',
        unlocked: completedCount >= 365
      }
    ];
  }

  // --- Exportation & Sauvegarde Complète ---
  static exportAllData(): string {
    const data = {
      version: '1.0',
      export_date: new Date().toISOString(),
      appName: 'CARAVANE POUR CHRIST',
      progress: this.getProgress(),
      settings: this.getSettings(),
      journal: this.getJournalEntries(),
      custom_meditations: this.getCustomMeditations()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.progress) localStorage.setItem(PROGRESS_KEY, JSON.stringify(parsed.progress));
      if (parsed.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.settings));
      if (parsed.journal) localStorage.setItem(JOURNAL_KEY, JSON.stringify(parsed.journal));
      if (parsed.custom_meditations) localStorage.setItem(CUSTOM_MEDITATIONS_KEY, JSON.stringify(parsed.custom_meditations));

      window.dispatchEvent(new Event('caravane-progress-updated'));
      window.dispatchEvent(new Event('caravane-settings-updated'));
      window.dispatchEvent(new Event('caravane-journal-updated'));
      return true;
    } catch (e) {
      console.error('Erreur importation données:', e);
      return false;
    }
  }

  static resetAllData(): void {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(JOURNAL_KEY);
    localStorage.removeItem(CUSTOM_MEDITATIONS_KEY);
    window.location.reload();
  }
}
