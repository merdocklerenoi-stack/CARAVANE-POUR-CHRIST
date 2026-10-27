/**
 * CARAVANE POUR CHRIST — Types TypeScript
 */

export type SpiritualTheme =
  | 'La foi'
  | 'La prière'
  | 'L’amour'
  | 'Le pardon'
  | 'La gratitude'
  | 'L’espérance'
  | 'L’obéissance'
  | 'La sagesse'
  | 'La paix intérieure'
  | 'La persévérance'
  | 'Le service'
  | 'La famille'
  | 'La vie avec le Saint-Esprit'
  | 'Le caractère chrétien'
  | 'La connaissance de Jésus-Christ';

export interface Meditation {
  id: string;
  day_number: number; // 1 à 365
  title: string;
  theme: SpiritualTheme;
  scripture_reference: string;
  scripture_text: string;
  scripture_translation: string;
  reflection: string;
  reflection_questions: string[];
  prayer: string;
  practical_action: string;
  estimated_reading_minutes: number;
  status: 'published' | 'draft';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type JournalMood =
  | 'peace' // Paix
  | 'gratitude' // Reconnaissance
  | 'trial' // Épreuve
  | 'joy' // Joie
  | 'seeking' // En recherche
  | 'praise'; // Louange

export interface JournalEntry {
  id: string;
  user_id?: string;
  meditation_id?: string;
  day_number?: number;
  title: string;
  content: string;
  mood?: JournalMood;
  prayer_topics?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  completed_days: number[]; // Liste des numéros de jours terminés
  started_days: number[];
  favorites: number[]; // Numéros de jours mis en favoris
  last_read_day: number;
  streak_count: number;
  last_read_date: string; // YYYY-MM-DD
}

export interface UserSettings {
  display_name: string;
  theme: 'light' | 'dark';
  font_size: 'normal' | 'large' | 'xlarge';
  reminder_enabled: boolean;
  reminder_time: string; // ex: "07:00"
  progression_mode: 'sequential' | 'calendar';
  speech_rate: number;
  supabase_url?: string;
  supabase_anon_key?: string;
}

export interface PushSubscriptionInfo {
  endpoint: string;
  expirationTime?: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

export interface SpiritualBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at?: string;
  criteria: string;
}
