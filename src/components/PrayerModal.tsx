import React, { useState } from 'react';
import { X, Sparkles, Check, Heart } from 'lucide-react';
import { Meditation } from '../types';
import { StorageService } from '../services/storage';
import confetti from 'canvas-confetti';

interface PrayerModalProps {
  meditation: Meditation;
  onClose: () => void;
  onSavedNote?: () => void;
}

export const PrayerModal: React.FC<PrayerModalProps> = ({ meditation, onClose, onSavedNote }) => {
  const [personalTopic, setPersonalTopic] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasPrayed, setHasPrayed] = useState(false);

  const handleAmen = () => {
    setHasPrayed(true);
    try {
      // Confetti matching logo palette: Globe Blue, Ribbon Red, Meridian Cyan, Bible Gold, Pure White
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#1E56B7', '#DC2626', '#38BDF8', '#F59E0B', '#FFFFFF']
      });
    } catch (e) {}

    if (personalTopic.trim()) {
      StorageService.addJournalEntry({
        day_number: meditation.day_number,
        title: `Prière du Jour ${meditation.day_number} : ${meditation.title}`,
        content: `Sujet déposé lors du recueillement : ${personalTopic.trim()}`,
        mood: 'peace',
        prayer_topics: [personalTopic.trim()]
      });
      setIsSaved(true);
      if (onSavedNote) onSavedNote();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#1E56B7]/40 dark:border-[#2563EB]/40 bg-[#0A152E] text-slate-100 p-4 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Subtle Globe Blue & Ribbon Red ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#1E56B7]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#DC2626]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#60A5FA] mb-1.5 sm:mb-2">
          <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <span>Moment de Prière — Jour {meditation.day_number}</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-serif-title font-bold text-white mb-3 text-balance pr-6">
          {meditation.title}
        </h2>

        {/* Biblical anchor */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-2xl bg-blue-950/60 border border-blue-900/60 text-xs sm:text-sm text-slate-300 italic text-pretty">
          <span className="font-bold text-[#DC2626] dark:text-[#F87171] not-italic block mb-1">
            {meditation.scripture_reference}
          </span>
          « {meditation.scripture_text} »
        </div>

        {/* Guided Prayer */}
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#DC2626]/15 to-transparent border border-[#DC2626]/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F87171] mb-2">
            <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>Prière guidée</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed sm:leading-loose text-slate-100 font-serif-title italic text-pretty">
            « {meditation.prayer} »
          </p>
        </div>

        {/* Add personal prayer topic */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Ajouter un sujet personnel pour ce jour (facultatif) :
          </label>
          <input
            type="text"
            value={personalTopic}
            onChange={(e) => setPersonalTopic(e.target.value)}
            placeholder="Ex: Paix dans ma famille, discernement pour mon travail..."
            className="w-full rounded-xl bg-slate-900/90 border border-slate-700 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#1E56B7]"
          />
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAmen}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold shadow-lg transition cursor-pointer ${
              hasPrayed
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-gradient-to-r from-[#1E56B7] via-[#2563EB] to-[#DC2626] text-white hover:brightness-110 active:scale-95'
            }`}
          >
            {hasPrayed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Amen ! Prière élevée</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Dire « Amen » & Déposer mon cœur</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            Fermer
          </button>
        </div>

        {isSaved && (
          <p className="mt-3 text-center text-xs text-emerald-400">
            ✓ Votre sujet de prière a été automatiquement enregistré dans votre Journal Spirituel.
          </p>
        )}
      </div>
    </div>
  );
};
