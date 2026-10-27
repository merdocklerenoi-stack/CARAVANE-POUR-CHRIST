import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  BookOpen,
  Volume2,
  VolumeX,
  Plus,
  Heart,
  Sparkles,
  HelpCircle,
  Footprints,
  Type
} from 'lucide-react';
import { Meditation } from '../types';
import { StorageService } from '../services/storage';
import { PrayerModal } from './PrayerModal';
import confetti from 'canvas-confetti';

interface MeditationReaderProps {
  meditation: Meditation;
  onBack: () => void;
  onNavigateDay: (dayNumber: number) => void;
  onOpenJournalForDay: (dayNumber: number) => void;
}

export const MeditationReader: React.FC<MeditationReaderProps> = ({
  meditation,
  onBack,
  onNavigateDay,
  onOpenJournalForDay
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedScripture, setCopiedScripture] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setIsCompleted(StorageService.isDayCompleted(meditation.day_number));
    setIsFavorite(StorageService.isFavorite(meditation.day_number));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [meditation.day_number]);

  const handleToggleComplete = () => {
    if (!isCompleted) {
      StorageService.markDayCompleted(meditation.day_number);
      setIsCompleted(true);
      try {
        // Confetti matching logo palette: Globe Blue, Ribbon Red, Meridian Cyan, Bible Gold, Pure White
        confetti({
          particleCount: 75,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#1E56B7', '#DC2626', '#38BDF8', '#F59E0B', '#FFFFFF']
        });
      } catch (e) {}
    }
  };

  const handleToggleFavorite = () => {
    const updated = StorageService.toggleFavorite(meditation.day_number);
    setIsFavorite(updated);
  };

  const handleCopyScripture = async () => {
    const textToCopy = `« ${meditation.scripture_text} » — ${meditation.scripture_reference} (${meditation.scripture_translation})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedScripture(true);
      setTimeout(() => setCopiedScripture(false), 2500);
    } catch (e) {
      console.warn('Erreur copie');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Caravane Pour Christ — Jour ${meditation.day_number} : ${meditation.title}`,
      text: `Méditation du Jour ${meditation.day_number} : « ${meditation.title} »\n${meditation.scripture_reference} : « ${meditation.scripture_text} »\nProgramme '365 jours avec Dieu' sur Caravane Pour Christ.`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setSharedToast(true);
        setTimeout(() => setSharedToast(false), 2500);
      } catch (e) {}
    }
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('La synthèse vocale n\'est pas disponible sur ce navigateur.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const fullText = `Jour ${meditation.day_number}. ${meditation.title}. Thème : ${meditation.theme}. Passage biblique dans ${meditation.scripture_reference}. ${meditation.scripture_text}. Méditation : ${meditation.reflection}. Prière : ${meditation.prayer}.`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose'
      : fontSize === 'large'
      ? 'text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose'
      : 'text-[15px] sm:text-base md:text-lg leading-relaxed sm:leading-loose';

  return (
    <div className="min-h-screen pb-28 pt-2 sm:pt-4 px-3 sm:px-6 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 sticky top-2 z-20 backdrop-blur-md bg-white/90 dark:bg-[#0A152E]/95 py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl border border-blue-100 dark:border-blue-950/80 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1E56B7] dark:hover:text-[#60A5FA] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#1E56B7]" />
          <span className="hidden sm:inline">Retour au programme</span>
          <span className="sm:hidden">Retour</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Audio read-aloud */}
          <button
            onClick={handleToggleAudio}
            title={isPlayingAudio ? 'Arrêter la lecture audio' : 'Écouter la méditation'}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isPlayingAudio
                ? 'bg-[#1E56B7] text-white animate-pulse'
                : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Font size toggle */}
          <button
            onClick={() => {
              setFontSize((prev) => (prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'));
            }}
            title="Ajuster la taille du texte"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
          </button>

          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isFavorite
                ? 'text-[#F59E0B] bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            title="Partager cette méditation"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {sharedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#1E56B7] px-4 py-2 text-xs font-semibold text-white shadow-xl animate-fade-in">
          ✓ Lien et référence copiés avec succès !
        </div>
      )}

      {/* Main Meditation Article Container */}
      <article className="rounded-3xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] p-4 sm:p-7 md:p-10 shadow-lg prose-reading">
        {/* Day Number and Theme Banner with Logo Colors */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#1E56B7]/15 dark:bg-[#1E56B7]/30 text-[#1E56B7] dark:text-[#60A5FA] px-3 sm:px-3.5 py-1 text-xs font-bold uppercase tracking-wider border border-[#1E56B7]/25">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Jour {meditation.day_number} sur 365</span>
          </div>

          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-medium text-[#1E56B7] dark:text-[#93C5FD]">
            {meditation.theme}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-serif-title font-bold text-[#0A152E] dark:text-white mb-4 sm:mb-6 leading-snug tracking-tight text-balance">
          {meditation.title}
        </h1>

        {/* Scripture blockquote with Caravane Red accent border */}
        <div className="mb-6 sm:mb-8 rounded-2xl border-l-4 border-[#DC2626] bg-blue-50/70 dark:bg-[#0A1428]/85 p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#DC2626] dark:text-[#F87171] uppercase tracking-wider">
              {meditation.scripture_reference}
            </span>
            <button
              onClick={handleCopyScripture}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#1E56B7] transition cursor-pointer p-1"
              title="Copier le passage"
            >
              {copiedScripture ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Copier</span>
                </>
              )}
            </button>
          </div>

          <p className="font-serif-title italic text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-100 leading-relaxed sm:leading-loose mb-2 text-pretty">
            « {meditation.scripture_text} »
          </p>

          <span className="text-[11px] text-slate-400 block text-right">
            Source biblique : {meditation.scripture_translation}
          </span>
        </div>

        {/* Meditation Body Text */}
        <div className="mb-6 sm:mb-8 text-slate-700 dark:text-slate-200">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Méditation de la Parole</span>
          </h2>
          <div className={`space-y-4 font-sans-body ${fontClass}`}>
            {meditation.reflection.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed sm:leading-loose text-pretty break-words">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Questions de réflexion */}
        {meditation.reflection_questions && meditation.reflection_questions.length > 0 && (
          <div className="mb-6 sm:mb-8 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 sm:p-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E56B7] dark:text-[#60A5FA] mb-3">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Questions de réflexion personnelle</span>
            </div>
            <ul className="space-y-2.5">
              {meditation.reflection_questions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed text-pretty">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1E56B7] text-white font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="flex-1 break-words">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prière proposée with Caravane Red accent */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-[#DC2626]/35 bg-gradient-to-br from-red-500/5 to-transparent dark:from-[#DC2626]/10 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#DC2626] dark:text-[#F87171]">
              <Heart className="w-4 h-4 fill-current shrink-0" />
              <span>Prière du jour</span>
            </div>
            <button
              onClick={() => setShowPrayerModal(true)}
              className="text-xs font-semibold text-[#DC2626] dark:text-[#F87171] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Recueillement</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-serif-title italic text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed sm:leading-loose text-pretty">
            « {meditation.prayer} »
          </p>
        </div>

        {/* Action pratique du jour */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
            <Footprints className="w-4 h-4 shrink-0" />
            <span>Mise en pratique aujourd’hui</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed sm:leading-loose text-pretty break-words">
            {meditation.practical_action}
          </p>
        </div>

        {/* Actions de fin de lecture */}
        <div className="border-t border-slate-100 dark:border-blue-950/70 pt-5 sm:pt-6 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handleToggleComplete}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition cursor-pointer min-h-[46px] ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-[#1E56B7] to-[#2563EB] text-white hover:brightness-110 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{isCompleted ? '✓ Jour complété !' : 'Marquer comme terminé'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onOpenJournalForDay(meditation.day_number)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer min-h-[46px]"
              >
                <Plus className="w-4 h-4 text-[#1E56B7] dark:text-[#60A5FA] shrink-0" />
                <span className="hidden xs:inline">Noter dans mon</span> Journal
              </button>

              <button
                onClick={() => setShowPrayerModal(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-2xl border border-[#DC2626]/40 bg-[#DC2626]/10 px-3.5 py-3 text-xs sm:text-sm font-semibold text-[#DC2626] dark:text-[#F87171] hover:bg-[#DC2626]/20 transition cursor-pointer min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Prier maintenant</span>
              </button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-xs text-slate-500 dark:text-slate-400 italic text-balance">
            « Un jour à la fois, plus près de Christ. Caravane Pour Christ. »
          </div>
        </div>
      </article>

      {/* Prev / Next Navigation Footbar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 mt-5 sm:mt-6">
        <button
          disabled={meditation.day_number <= 1}
          onClick={() => onNavigateDay(meditation.day_number - 1)}
          className={`flex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition ${
            meditation.day_number <= 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-[#1E56B7] hover:text-[#1E56B7] cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Jour précédent ({meditation.day_number - 1})</span>
          <span className="sm:hidden">Jour {meditation.day_number - 1}</span>
        </button>

        <button
          disabled={meditation.day_number >= 365}
          onClick={() => onNavigateDay(meditation.day_number + 1)}
          className={`flex-1 sm:flex-initial flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 rounded-xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-[#0E1C38] px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition ${
            meditation.day_number >= 365
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-[#1E56B7] hover:text-[#1E56B7] cursor-pointer'
          }`}
        >
          <span className="hidden sm:inline">Jour suivant ({meditation.day_number + 1})</span>
          <span className="sm:hidden">Jour {meditation.day_number + 1}</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {showPrayerModal && (
        <PrayerModal
          meditation={meditation}
          onClose={() => setShowPrayerModal(false)}
        />
      )}
    </div>
  );
};
