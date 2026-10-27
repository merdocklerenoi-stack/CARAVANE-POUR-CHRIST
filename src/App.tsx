/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Calendar,
  Star,
  BookMarked,
  Search,
  Award,
  Settings,
  Shield,
  Moon,
  Sun,
  Flame,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Meditation } from './types';
import { getAllMeditations, getDayOfYear, getMeditationByDay } from './data/meditations';
import { StorageService } from './services/storage';
import { NotificationService } from './services/notifications';
import { HomeToday } from './components/HomeToday';
import { MeditationReader } from './components/MeditationReader';
import { ProgramList } from './components/ProgramList';
import { SpiritualCalendar } from './components/SpiritualCalendar';
import { FavoritesView } from './components/FavoritesView';
import { JournalView } from './components/JournalView';
import { SmartSearch } from './components/SmartSearch';
import { ProfileProgress } from './components/ProfileProgress';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

type NavTab =
  | 'home'
  | 'program'
  | 'reader'
  | 'calendar'
  | 'favorites'
  | 'journal'
  | 'search'
  | 'progress'
  | 'settings'
  | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeDayNumber, setActiveDayNumber] = useState<number>(() => {
    // Check URL params for ?day=XX (useful for notification click)
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');
    if (dayParam) {
      const parsed = parseInt(dayParam);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 365) return parsed;
    }
    return getDayOfYear();
  });

  const [journalDayFilter, setJournalDayFilter] = useState<number | undefined>(undefined);
  const [meditations, setMeditations] = useState<Meditation[]>(() => StorageService.getAllEffectiveMeditations());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(() => StorageService.getSettings());

  // Listen for storage updates
  useEffect(() => {
    const handleMeditationUpdates = () => {
      setMeditations(StorageService.getAllEffectiveMeditations());
    };
    const handleSettingsUpdates = () => {
      setSettings(StorageService.getSettings());
    };

    window.addEventListener('caravane-meditations-updated', handleMeditationUpdates);
    window.addEventListener('caravane-settings-updated', handleSettingsUpdates);

    return () => {
      window.removeEventListener('caravane-meditations-updated', handleMeditationUpdates);
      window.removeEventListener('caravane-settings-updated', handleSettingsUpdates);
    };
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handle URL deep links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('day')) {
      setActiveTab('reader');
    }
  }, []);

  // Vérification continue du rappel quotidien du verset
  useEffect(() => {
    const checkScheduledVerse = async () => {
      const currentSettings = StorageService.getSettings();
      if (!currentSettings.reminder_enabled) return;
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const targetTime = currentSettings.reminder_time || '07:00';

      const todayStr = now.toISOString().split('T')[0];
      const lastNotified = StorageService.getLastNotifiedDate();

      // Si nous n'avons pas encore notifié aujourd'hui et que l'heure est venue
      if (lastNotified !== todayStr && currentTime >= targetTime) {
        StorageService.setLastNotifiedDate(todayStr);
        await NotificationService.testDailyVerseNotification();
      }
    };

    checkScheduledVerse();
    const interval = setInterval(checkScheduledVerse, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenMeditationReader = (dayNumber: number) => {
    setActiveDayNumber(dayNumber);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJournalForDay = (dayNumber: number) => {
    setJournalDayFilter(dayNumber);
    setActiveTab('journal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    StorageService.saveSettings({ ...settings, theme: newTheme });
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  };

  const todayDayOfYear = getDayOfYear();
  const todayMeditation =
    StorageService.getEffectiveMeditation(activeDayNumber) ||
    getMeditationByDay(activeDayNumber) ||
    meditations[0];

  return (
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#070E1E] text-slate-800 dark:text-slate-100 flex flex-col font-sans-body selection:bg-[#1E56B7]/25 selection:text-[#1E40AF]">
      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Main Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-[#0A152E]/90 border-b border-blue-100 dark:border-blue-950/80 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & App Brand with authentic colors */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src="/logo.jpg"
                alt="Logo Caravane Pour Christ"
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[#1E56B7] ring-1 sm:ring-2 ring-[#DC2626]/30 object-cover shadow-sm group-hover:scale-105 transition"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif-title font-black text-sm xs:text-base sm:text-xl tracking-tight text-[#0A152E] dark:text-white truncate">
                  CARAVANE <span className="text-[#DC2626] dark:text-[#EF4444]">POUR CHRIST</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#1E56B7]/15 text-[#1E56B7] dark:bg-[#1E56B7]/30 dark:text-[#60A5FA] text-[10px] font-bold px-2 py-0.5 border border-[#1E56B7]/20 shrink-0">
                  365 Jours
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[190px] xs:max-w-[260px] sm:max-w-none">
                « Un jour à la fois, plus près de Christ. »
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Aujourd'hui
            </button>

            <button
              onClick={() => setActiveTab('program')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'program'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Programme 365
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Calendrier
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Favoris
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Journal
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'progress'
                  ? 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Profil
            </button>
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />

            {/* Quick Search */}
            <button
              onClick={() => setActiveTab('search')}
              title="Recherche intelligente"
              className={`p-2 rounded-xl transition cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-[#1E56B7] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme switcher */}
            <button
              onClick={handleToggleTheme}
              title={settings.theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème bleu nuit'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#1E56B7]" />}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setActiveTab('settings')}
              title="Paramètres & Notifications"
              className={`p-2 rounded-xl transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1E56B7] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Admin shortcut */}
            <button
              onClick={() => setActiveTab('admin')}
              title="Administration du contenu"
              className={`p-2 rounded-xl transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#DC2626] text-white'
                  : 'text-slate-400 hover:text-[#DC2626] hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0A152E] px-4 py-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Aujourd'hui (Méditation du jour)
            </button>
            <button
              onClick={() => {
                setActiveTab('program');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Programme des 365 Jours
            </button>
            <button
              onClick={() => {
                setActiveTab('calendar');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Calendrier Spirituel
            </button>
            <button
              onClick={() => {
                setActiveTab('favorites');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Favoris
            </button>
            <button
              onClick={() => {
                setActiveTab('journal');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Journal Spirituel
            </button>
            <button
              onClick={() => {
                setActiveTab('progress');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Profil & Jalons
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              Paramètres & Rappels Verset
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-[#DC2626] dark:text-[#EF4444] hover:bg-rose-50 dark:hover:bg-rose-950/50"
            >
              Administration du Contenu
            </button>
          </div>
        )}
      </header>

      {/* Main Body Content based on active tab */}
      <main className="flex-1 pb-28 lg:pb-12 safe-mb">
        {activeTab === 'home' && (
          <HomeToday
            todayMeditation={todayMeditation}
            dayOfYearNumber={todayDayOfYear}
            onReadMeditation={handleOpenMeditationReader}
            onNavigateToProgram={() => setActiveTab('program')}
            onNavigateToJournal={() => setActiveTab('journal')}
            onNavigateToSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'program' && (
          <ProgramList
            meditations={meditations}
            onSelectMeditation={handleOpenMeditationReader}
          />
        )}

        {activeTab === 'reader' && (
          <MeditationReader
            meditation={todayMeditation}
            onBack={() => setActiveTab('program')}
            onNavigateDay={(day) => setActiveDayNumber(day)}
            onOpenJournalForDay={handleOpenJournalForDay}
          />
        )}

        {activeTab === 'calendar' && (
          <SpiritualCalendar
            onSelectDay={handleOpenMeditationReader}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            meditations={meditations}
            onSelectMeditation={handleOpenMeditationReader}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            initialDayFilter={journalDayFilter}
            onOpenMeditation={handleOpenMeditationReader}
          />
        )}

        {activeTab === 'search' && (
          <SmartSearch
            meditations={meditations}
            onSelectMeditation={handleOpenMeditationReader}
            onOpenJournal={() => setActiveTab('journal')}
          />
        )}

        {activeTab === 'progress' && (
          <ProfileProgress
            onContinueReading={() => handleOpenMeditationReader(StorageService.getProgress().last_read_day)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onThemeChange={(newTheme) => {
              setSettings((prev) => ({ ...prev, theme: newTheme }));
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            meditations={meditations}
            onRefreshMeditations={() => setMeditations(StorageService.getAllEffectiveMeditations())}
            onPreviewMeditation={handleOpenMeditationReader}
          />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar with Logo Palette */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A152E]/95 backdrop-blur-md border-t border-blue-100 dark:border-blue-950/80 px-1 py-1.5 flex items-center justify-around shadow-lg safe-pb">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            activeTab === 'home' ? 'text-[#1E56B7] dark:text-[#60A5FA] font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Aujourd'hui</span>
        </button>

        <button
          onClick={() => setActiveTab('program')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            activeTab === 'program' ? 'text-[#1E56B7] dark:text-[#60A5FA] font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">365 Jours</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            activeTab === 'calendar' ? 'text-[#1E56B7] dark:text-[#60A5FA] font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Calendrier</span>
        </button>

        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            activeTab === 'journal' ? 'text-[#1E56B7] dark:text-[#60A5FA] font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Journal</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            activeTab === 'progress' ? 'text-[#1E56B7] dark:text-[#60A5FA] font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-blue-100 dark:border-blue-950/80 bg-white/60 dark:bg-[#070E1E]/80 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-serif-title font-bold text-slate-800 dark:text-slate-200 text-sm">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full border border-[#1E56B7]" />
            <span>CARAVANE <span className="text-[#DC2626]">POUR CHRIST</span></span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Programme chrétien de méditations quotidiennes « 365 jours avec Dieu ». Un jour à la fois, plus près de Christ.
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Textes bibliques : Louis Segond 1910 • Application Web Progressive (PWA) aux couleurs officielles de la Caravane.
          </p>
        </div>
      </footer>
    </div>
  );
}
