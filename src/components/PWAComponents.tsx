import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Lang } from '../types/app';

interface PWAInstallButtonProps {
  lang?: Lang;
  variant?: 'compact' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'fr',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between gap-3 rounded-2xl bg-[#F0EDFF] hover:bg-[#E5E0FF] border border-[#5433FF]/15 px-4 py-3 text-left transition-colors min-h-[48px]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#5433FF] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#13112B] truncate">
                {lang === 'fr' ? 'Installer MINI-B Vendeur Pro' : 'Install MINI-B Vendor Pro'}
              </p>
              <p className="text-xs text-[#4B4869] truncate">
                {lang === 'fr'
                  ? 'Accès hors-ligne, alertes MoMo & mode plein écran'
                  : 'Offline access, MoMo alerts & standalone app mode'}
              </p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#5433FF] px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap">
            <Download className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'Installer' : 'Install'}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          title={lang === 'fr' ? "Installer l'application PWA" : 'Install PWA App'}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {lang === 'fr' ? 'Installer App' : 'Install App'}
          </span>
        </button>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112B]/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#ECEAF6]">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-9 h-9 rounded-full bg-[#F5F5FA] hover:bg-[#EAE8F5] flex items-center justify-center text-[#4B4869]"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#13112B]">
              {isIOS
                ? lang === 'fr'
                  ? 'Installer sur iPhone / iPad'
                  : 'Install on iPhone / iPad'
                : lang === 'fr'
                  ? "Installer MINI-B sur votre écran d'accueil"
                  : 'Install MINI-B on your home screen'}
            </h3>
            <p className="mt-2 text-sm text-[#4B4869] leading-relaxed">
              {isIOS ? (
                <>
                  1. {lang === 'fr' ? 'Appuyez sur le bouton' : 'Tap the'}{' '}
                  <strong className="inline-flex items-center gap-1 text-[#13112B]">
                    <Share className="w-3.5 h-3.5 text-[#5433FF]" />{' '}
                    {lang === 'fr' ? 'Partager' : 'Share'}
                  </strong>{' '}
                  {lang === 'fr' ? 'dans la barre Safari.' : 'button in Safari toolbar.'}
                  <br />
                  2. {lang === 'fr' ? 'Faites défiler et choisissez' : 'Scroll down and tap'}{' '}
                  <strong className="inline-flex items-center gap-1 text-[#13112B]">
                    <PlusSquare className="w-3.5 h-3.5 text-[#5433FF]" />{' '}
                    {lang === 'fr' ? "Sur l'écran d'accueil" : 'Add to Home Screen'}
                  </strong>
                  .
                </>
              ) : lang === 'fr' ? (
                "Ouvrez le menu de votre navigateur (⋮ ou icône d'installation dans la barre d'adresse) puis sélectionnez « Installer l'application » ou « Ajouter à l'écran d'accueil »."
              ) : (
                'Open your browser menu (⋮ or install icon in the address bar) and select "Install app" or "Add to Home Screen".'
              )}
            </p>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full rounded-xl bg-[#5433FF] hover:bg-[#4423E8] py-3 text-sm font-semibold text-white transition-colors"
            >
              {lang === 'fr' ? 'Compris' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC<{ lang?: Lang }> = ({ lang = 'fr' }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 lg:bottom-5 left-4 right-4 lg:left-auto lg:right-5 z-50 flex items-center justify-center lg:justify-start gap-2.5 rounded-2xl bg-[#13112B] px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-white/10"
    >
      <WifiOff className="w-4 h-4 text-[#F59E0B] shrink-0" />
      <span>
        {lang === 'fr'
          ? 'Mode Hors-Ligne — Données locales MINI-B actives'
          : 'Offline Mode — Cached local MINI-B data active'}
      </span>
    </div>
  );
};
