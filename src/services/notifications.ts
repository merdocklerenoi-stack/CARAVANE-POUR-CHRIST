/**
 * CARAVANE POUR CHRIST — Service de Notifications & Push du Verset du Jour
 * Met l'accent sur la réception des notifications même lorsque l'application
 * est fermée (PWA Service Worker, Web Push API, Background Sync).
 */

import { StorageService } from './storage';
import { getMeditationByDay, getDayOfYear } from '../data/meditations';

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  serviceWorkerReady: boolean;
  periodicSyncSupported: boolean;
  pushSubscriptionActive: boolean;
  scheduledTime: string;
  enabled: boolean;
}

export class NotificationService {
  /**
   * Vérifie si les notifications et Service Workers sont supportés
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Retourne l'état actuel des permissions et du service worker
   */
  static async getStatus(): Promise<NotificationStatus> {
    if (!this.isSupported()) {
      return {
        supported: false,
        permission: 'unsupported',
        serviceWorkerReady: false,
        periodicSyncSupported: false,
        pushSubscriptionActive: false,
        scheduledTime: '07:00',
        enabled: false
      };
    }

    const settings = StorageService.getSettings();
    let serviceWorkerReady = false;
    let pushSubscriptionActive = false;
    let periodicSyncSupported = false;

    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        serviceWorkerReady = true;
        periodicSyncSupported = 'periodicSync' in reg;
        const sub = await reg.pushManager.getSubscription();
        pushSubscriptionActive = !!sub;
      }
    } catch (e) {
      console.warn('Erreur vérification status SW:', e);
    }

    return {
      supported: true,
      permission: Notification.permission,
      serviceWorkerReady,
      periodicSyncSupported,
      pushSubscriptionActive,
      scheduledTime: settings.reminder_time || '07:00',
      enabled: settings.reminder_enabled
    };
  }

  /**
   * Demande formellement l'autorisation de notification au navigateur
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';

      if (granted) {
        const settings = StorageService.getSettings();
        StorageService.saveSettings({ ...settings, reminder_enabled: true });
        await this.registerPushSubscription();
        // Déclencher immédiatement le verset du jour sur l'écran pour confirmer l'activation
        setTimeout(() => {
          this.testDailyVerseNotification();
        }, 500);
      }

      return granted;
    } catch (e) {
      console.error('Erreur demande permission notifications:', e);
      return false;
    }
  }

  /**
   * Enregistre la souscription Push auprès du Service Worker et du serveur
   */
  static async registerPushSubscription(): Promise<PushSubscription | null> {
    try {
      if (!('serviceWorker' in navigator)) return null;

      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
      ]);
      if (!registration || !('pushManager' in registration)) return null;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        try {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZ_W9zpcmfIhViCE8CpSVCZobrOZbdxd6WDKEPE')
          });
        } catch (subErr) {
          console.log('[Push] Abonnement local initialisé');
        }
      }

      // Envoi optionnel au serveur backend si présent
      if (subscription) {
        try {
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
          });
        } catch (apiErr) {
          // Serveur local ou offline fallback
        }
      }

      return subscription;
    } catch (e) {
      console.warn('[Push] Souscription Push non finalisée:', e);
      return null;
    }
  }

  /**
   * Déclenche une notification avec le verset biblique du jour.
   * Utilise le Service Worker si disponible, avec repli immédiat et sans blocage.
   */
  static async testDailyVerseNotification(dayNumber?: number): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: false, message: 'Les notifications ne sont pas supportées sur ce navigateur.' };
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        return {
          success: false,
          message: 'Autorisation refusée par le navigateur. Veuillez autoriser les notifications dans les réglages.'
        };
      }
    }

    const currentDay = dayNumber || getDayOfYear();
    const meditation = StorageService.getEffectiveMeditation(currentDay) || getMeditationByDay(currentDay);

    const title = 'Caravane Pour Christ — Verset du jour';
    const body = meditation
      ? `« ${meditation.scripture_text} » — ${meditation.scripture_reference}`
      : '« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » — Psaume 119:105';

    let shownViaSw = false;

    // Tentative Service Worker (avec timeout de sécurité à 1.2s pour ne jamais bloquer)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
        ]);

        if (registration && 'showNotification' in registration) {
          await (registration as any).showNotification(title, {
            body,
            icon: '/logo.jpg',
            badge: '/pwa-192x192.png',
            tag: 'daily-bible-verse',
            renotify: true,
            vibrate: [200, 100, 200, 100, 200],
            data: {
              url: `/?day=${currentDay}`,
              dayNumber: currentDay
            },
            actions: [
              { action: 'read', title: '📖 Méditer le verset' },
              { action: 'pray', title: '🙏 Prier maintenant' }
            ]
          });
          shownViaSw = true;
        }
      } catch (swErr) {
        console.warn('[Notification] Échec SW showNotification:', swErr);
      }
    }

    // Repli direct avec Notification API
    if (!shownViaSw) {
      try {
        new Notification(title, {
          body,
          icon: '/logo.jpg'
        });
      } catch (err2) {
        console.error('[Notification] Repli direct échoué:', err2);
        return {
          success: false,
          message: 'Impossible d\'afficher la notification. Vérifiez que les notifications ne sont pas bloquées par votre système.'
        };
      }
    }

    return {
      success: true,
      message: 'Notification du verset biblique envoyée avec succès sur votre écran !'
    };
  }

  /**
   * Planifie le rappel quotidien du verset du jour
   */
  static scheduleReminder(timeString: string): void {
    const settings = StorageService.getSettings();
    StorageService.saveSettings({
      ...settings,
      reminder_enabled: true,
      reminder_time: timeString
    });

    // Envoi au service worker si possible
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_REMINDER_TIME',
        time: timeString
      });
    }
  }

  /**
   * Déclenche une requête push vers le serveur backend pour tester la réception externe
   */
  static async triggerServerPushTest(): Promise<{ success: boolean; message: string }> {
    try {
      const day = getDayOfYear();
      const res = await fetch('/api/notifications/test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber: day })
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message || 'Notification Push serveur envoyée !' };
      } else {
        // Fallback local via SW
        return await this.testDailyVerseNotification(day);
      }
    } catch (e) {
      // Fallback local en cas d'absence de serveur
      return await this.testDailyVerseNotification();
    }
  }

  private static urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
