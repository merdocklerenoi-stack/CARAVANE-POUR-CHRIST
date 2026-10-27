/**
 * CARAVANE POUR CHRIST — Client Supabase
 * Fournit un accès optionnel au cloud Supabase si configuré,
 * tout en garantissant un fonctionnement 100% hors-ligne fluide et sans friction.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from './storage';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const settings = StorageService.getSettings();
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const url = settings.supabase_url?.trim() || envUrl.trim();
  const key = settings.supabase_anon_key?.trim() || envKey.trim();

  if (url && key) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return supabaseInstance;
    } catch (e) {
      console.warn('Erreur initialisation Supabase Client:', e);
      return null;
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null;
}
