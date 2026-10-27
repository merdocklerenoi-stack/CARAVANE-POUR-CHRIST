import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Sun,
  Moon,
  Database,
  Clock,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { NotificationService, NotificationStatus } from '../services/notifications';
import { UserSettings } from '../types';

interface SettingsViewProps {
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onThemeChange }) => {
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [notifStatus, setNotifStatus] = useState<NotificationStatus | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [testNotifToast, setTestNotifToast] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    checkNotifStatus();
  }, []);

  const checkNotifStatus = async () => {
    const status = await NotificationService.getStatus();
    setNotifStatus(status);
  };

  const handleUpdate = (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    StorageService.saveSettings(updated);
    if (updates.theme) {
      onThemeChange(updates.theme);
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleRequestNotificationPermission = async () => {
    setIsSending(true);
    const granted = await NotificationService.requestPermission();
    await checkNotifStatus();
    setIsSending(false);

    if (granted) {
      handleUpdate({ reminder_enabled: true });
      setTestNotifToast('✓ Notifications activées ! Un verset a été envoyé sur votre écran.');
      setTimeout(() => setTestNotifToast(null), 4500);
    } else {
      setTestNotifToast('⚠️ Autorisation refusée. Veuillez autoriser les notifications dans les réglages de votre navigateur.');
      setTimeout(() => setTestNotifToast(null), 5500);
    }
  };

  const handleSendTestNow = async () => {
    setIsSending(true);
    const res = await NotificationService.testDailyVerseNotification();
    setIsSending(false);
    await checkNotifStatus();

    if (res.success) {
      setTestNotifToast('✓ Verset envoyé ! Vérifiez votre écran ou centre de notifications.');
    } else {
      setTestNotifToast(`⚠️ ${res.message}`);
    }
    setTimeout(() => setTestNotifToast(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-serif-title font-bold text-[#0A152E] dark:text-white flex items-center gap-2 text-balance">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Paramètres</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 text-pretty">
          Personnalisez votre expérience de méditation quotidienne et vos préférences.
        </p>
      </div>

      {savedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xl animate-fade-in">
          ✓ Préférences enregistrées
        </div>
      )}

      {testNotifToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4 rounded-2xl bg-[#0A152E] border border-[#1E56B7] px-4 py-3 text-xs font-semibold text-white shadow-2xl text-center">
          {testNotifToast}
        </div>
      )}

      {/* SECTION 1: RAPPELS QUOTIDIENS DU VERSET */}
      <section className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-sm mb-5 sm:mb-6">
        <div className="flex items-center gap-2 text-base font-bold text-[#0A152E] dark:text-white mb-2">
          <Bell className="w-5 h-5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Rappels du Verset Biblique du Jour</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-5 leading-relaxed text-pretty">
          Définissez l'heure à laquelle vous souhaitez recevoir votre verset quotidien pour nourrir votre méditation.
        </p>

        {/* Controls: Time & Enabled */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 p-4 bg-blue-50/30 dark:bg-[#070E1E]/50">
            <label className="block text-xs font-bold text-[#0A152E] dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1E56B7] dark:text-[#60A5FA]" />
              <span>Heure du rappel</span>
            </label>
            <input
              type="time"
              value={settings.reminder_time || '07:00'}
              onChange={(e) => {
                handleUpdate({ reminder_time: e.target.value });
                NotificationService.scheduleReminder(e.target.value);
              }}
              className="w-full rounded-xl bg-white dark:bg-[#0E1C38] border border-blue-200 dark:border-blue-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1E56B7]"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Par exemple : 07:00 pour bien commencer la journée.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 p-4 bg-blue-50/30 dark:bg-[#070E1E]/50 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0A152E] dark:text-slate-200 block">
                  Activer les notifications
                </span>
                <span className="text-[11px] text-slate-400">
                  Réception quotidienne automatique
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.reminder_enabled}
                onChange={(e) => {
                  const willEnable = e.target.checked;
                  handleUpdate({ reminder_enabled: willEnable });
                  if (willEnable && notifStatus?.permission !== 'granted') {
                    handleRequestNotificationPermission();
                  }
                }}
                className="w-5 h-5 accent-[#1E56B7] rounded cursor-pointer"
              />
            </div>

            {/* État des autorisations */}
            <div className="mt-3">
              {notifStatus?.permission === 'granted' ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Autorisé sur cet appareil ({settings.reminder_enabled ? 'Actif à ' + (settings.reminder_time || '07:00') : 'En pause'})</span>
                </div>
              ) : notifStatus?.permission === 'denied' ? (
                <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Notifications bloquées par votre navigateur</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  Autorisation requise pour la réception
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message d'aide en cas de blocage navigateur */}
        {notifStatus?.permission === 'denied' && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 text-xs text-rose-800 dark:text-rose-300 mb-4 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Pourquoi vous ne recevez pas de notification :</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Votre navigateur ou appareil bloque actuellement les notifications pour cette page. Pour débloquer :
            </p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
              <li><strong>Sur Chrome / Edge :</strong> Cliquez sur l'icône de réglages du site (à gauche de l'adresse web) et passez <em>Notifications</em> sur « Autoriser ».</li>
              <li><strong>Sur iPhone :</strong> Ajoutez d'abord l'application sur l'écran d'accueil (Partager &gt; Sur l'écran d'accueil), puis ouvrez-la depuis l'écran d'accueil.</li>
              <li><strong>Sur Android :</strong> Paramètres Android &gt; Applications &gt; Chrome (ou Caravane) &gt; Notifications &gt; Autoriser.</li>
            </ul>
          </div>
        )}

        {/* Bouton pour tester directement la notification */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-blue-50 dark:border-blue-900/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vérifiez instantanément la réception sur votre écran :
          </p>
          <button
            onClick={handleSendTestNow}
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Envoi en cours...' : 'M\'envoyer le verset maintenant'}</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: APPARENCE & LECTURE */}
      <section className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-sm mb-5 sm:mb-6">
        <h2 className="text-base font-bold text-[#0A152E] dark:text-white mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Apparence & Confort de Lecture</span>
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Votre prénom ou nom d'affichage
            </label>
            <input
              type="text"
              value={settings.display_name}
              onChange={(e) => handleUpdate({ display_name: e.target.value })}
              className="w-full max-w-sm rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-100 dark:border-blue-900 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Thème visuel de l'application
            </span>
            <div className="flex flex-col sm:inline-flex sm:flex-row rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 p-1 border border-blue-100 dark:border-blue-900/60 gap-1 max-w-md">
              <button
                onClick={() => handleUpdate({ theme: 'dark' })}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[42px] sm:min-h-0 ${
                  settings.theme === 'dark'
                    ? 'bg-[#1E56B7] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 shrink-0" />
                <span>Bleu Nuit Globe & Rouge Caravane</span>
              </button>

              <button
                onClick={() => handleUpdate({ theme: 'light' })}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[42px] sm:min-h-0 ${
                  settings.theme === 'light'
                    ? 'bg-white text-[#0A152E] font-bold shadow-xs border border-blue-200'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 shrink-0" />
                <span>Bannière Blanche & Ciel Bleu</span>
              </button>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Taille par défaut des textes de méditation
            </span>
            <div className="inline-flex rounded-xl bg-blue-50/80 dark:bg-blue-950/60 p-1 border border-blue-100 dark:border-blue-900/60">
              <button
                onClick={() => handleUpdate({ font_size: 'normal' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  settings.font_size === 'normal' ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                Normale
              </button>
              <button
                onClick={() => handleUpdate({ font_size: 'large' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  settings.font_size === 'large' ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                Grande (Confort)
              </button>
              <button
                onClick={() => handleUpdate({ font_size: 'xlarge' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  settings.font_size === 'xlarge' ? 'bg-[#1E56B7] text-white font-bold shadow-xs' : 'text-slate-500'
                }`}
              >
                Très grande (Accessibilité)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INSTALLATION SUR ÉCRAN D'ACCUEIL */}
      <section className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-sm mb-5 sm:mb-6">
        <h2 className="text-base font-bold text-[#0A152E] dark:text-white mb-2 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Ajouter à l'écran d'accueil (iPhone & Android)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-pretty">
          Installez <strong>CARAVANE POUR CHRIST</strong> comme une véritable application sur votre téléphone pour un accès instantané en plein écran et sans barre d'adresse de navigateur.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guide iPhone */}
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 p-4 bg-blue-50/30 dark:bg-[#070E1E]/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🍎</span>
              <h3 className="text-sm font-bold text-[#0A152E] dark:text-white">Sur iPhone & iPad (Safari)</h3>
            </div>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1E56B7] dark:text-[#60A5FA] bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">1</span>
                <span>Ouvrez le lien dans le navigateur <strong>Safari</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1E56B7] dark:text-[#60A5FA] bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">2</span>
                <span>Touchez l'icône <strong>Partager</strong> en bas de l'écran (le carré avec une flèche vers le haut <span className="inline-block border border-slate-300 dark:border-slate-700 px-1 rounded text-[10px]">⎋ / ↑</span>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1E56B7] dark:text-[#60A5FA] bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">3</span>
                <span>Faites défiler vers le bas et appuyez sur <strong>« Sur l'écran d'accueil »</strong> (avec le signe <strong>+</strong>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1E56B7] dark:text-[#60A5FA] bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">4</span>
                <span>Touchez <strong>« Ajouter »</strong> en haut à droite. L'icône de la Caravane apparaît sur votre écran d'accueil !</span>
              </li>
            </ol>
          </div>

          {/* Guide Android */}
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 p-4 bg-blue-50/30 dark:bg-[#070E1E]/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🤖</span>
              <h3 className="text-sm font-bold text-[#0A152E] dark:text-white">Sur Android (Google Chrome)</h3>
            </div>
            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#DC2626] bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">1</span>
                <span>Ouvrez le lien dans <strong>Google Chrome</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#DC2626] bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">2</span>
                <span>Si une bannière apparaît en bas, appuyez directement sur <strong>« Installer »</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#DC2626] bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">3</span>
                <span>Sinon, appuyez sur les <strong>3 petits points verticaux (⋮)</strong> en haut à droite.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#DC2626] bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded text-[11px] shrink-0">4</span>
                <span>Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>, puis validez.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 3: SYNCHRONISATION */}
      <section className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-6 shadow-sm mb-5 sm:mb-6">
        <h2 className="text-base font-bold text-[#0A152E] dark:text-white mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
          <span>Synchronisation Multi-Appareils</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          Vos données de lecture et vos réflexions sont protégées et enregistrées sur votre appareil. Vous pouvez optionnellement renseigner votre connexion distante pour synchroniser votre avancée.
        </p>

        <div className="space-y-3 max-w-lg mb-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Serveur distant (URL)
            </label>
            <input
              type="text"
              placeholder="https://votre-serveur.co"
              value={settings.supabase_url || ''}
              onChange={(e) => handleUpdate({ supabase_url: e.target.value })}
              className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-100 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clé d'accès
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              value={settings.supabase_anon_key || ''}
              onChange={(e) => handleUpdate({ supabase_anon_key: e.target.value })}
              className="w-full rounded-xl bg-blue-50/50 dark:bg-[#070E1E] border border-blue-100 dark:border-blue-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E56B7]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Vos données restent privées et sécurisées.</span>
        </div>
      </section>

      {/* SECTION 4: RÉINITIALISATION DISCRÈTE */}
      <div className="pt-2 text-right">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-slate-400 hover:text-[#DC2626] transition cursor-pointer underline"
        >
          Réinitialiser mes données locales
        </button>

        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-rose-400/40 bg-white dark:bg-[#0A152E] p-6 text-center shadow-2xl">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Confirmer la réinitialisation ?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Vos progrès et notes enregistrés sur cet appareil seront remis à zéro.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => StorageService.resetAllData()}
                  className="px-3 py-1.5 rounded-lg bg-[#DC2626] text-white font-bold text-xs"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
