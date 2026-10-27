import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E56B7] via-[#2563EB] to-[#DC2626] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
          title="Installer l'application sur votre appareil"
        >
          <Download className="w-4 h-4" />
          <span>Installer l'app</span>
        </button>
      )}

      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-[#1E56B7]/40 bg-[#1E56B7]/10 px-3 py-1.5 text-xs font-semibold text-[#1E56B7] dark:text-[#60A5FA] hover:bg-[#1E56B7]/20 transition cursor-pointer"
          title="Installer sur iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Installer PWA</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-[#1E56B7]/40 bg-[#0A152E] p-6 text-white shadow-2xl">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-[#1E56B7]" />
              <div>
                <h3 className="font-bold text-base text-white">Installer sur iOS</h3>
                <p className="text-xs text-[#DC2626] font-semibold">Caravane Pour Christ</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/60">
                <Share2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <p>1. Appuyez sur le bouton <strong>Partager</strong> en bas de Safari.</p>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-950/60 border border-blue-900/60">
                <PlusSquare className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <p>2. Faites défiler et choisissez <strong>Sur l’écran d’accueil</strong>.</p>
              </div>
              <p className="text-xs text-slate-400 italic">
                L’application sera accessible directement depuis votre écran d’accueil et pourra recevoir les versets du jour en notification même fermée (iOS 16.4+).
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#1E56B7] to-[#DC2626] py-2.5 text-sm font-bold text-white hover:brightness-105 transition cursor-pointer"
            >
              J’ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
