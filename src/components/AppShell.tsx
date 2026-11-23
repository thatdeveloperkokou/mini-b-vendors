import React from 'react';
import {
  Bell,
  LayoutGrid,
  Package,
  Truck,
  Wallet,
  Menu as MenuIcon,
  Users,
  BarChart3,
  Megaphone,
  Star,
  Store,
  UserCheck,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { Lang, PageId, StoreSettings } from '../types/app';
import { AvatarBadge, getInitials, MiniBLogo } from './VisualAssets';
import { PWAInstallButton } from './PWAComponents';
import { T } from '../data/mockStore';

interface AppShellProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  lang: Lang;
  onToggleLang: (lang: Lang) => void;
  unreadNotifs: number;
  pendingOrdersCount: number;
  settings: StoreSettings;
  children: React.ReactNode;
}

const PRIMARY_TABS: { id: PageId; labelKey: keyof typeof T.fr; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hub', labelKey: 'hub', icon: LayoutGrid },
  { id: 'products', labelKey: 'products', icon: Package },
  { id: 'orders', labelKey: 'orders', icon: Truck },
  { id: 'wallet', labelKey: 'wallet', icon: Wallet },
  { id: 'menu', labelKey: 'menu', icon: MenuIcon },
];

const SECONDARY_MODULES: {
  id: PageId;
  labelFr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'crm', labelFr: 'Clients & CRM', labelEn: 'Customers & CRM', icon: Users },
  { id: 'analytics', labelFr: 'Rapports & Ventes', labelEn: 'Sales & Analytics', icon: BarChart3 },
  { id: 'marketing', labelFr: 'Marketing & Promos', labelEn: 'Marketing & Promos', icon: Megaphone },
  { id: 'reviews', labelFr: 'Avis & Réputation', labelEn: 'Reviews & Rating', icon: Star },
  { id: 'storefront', labelFr: 'Ma Boutique', labelEn: 'Storefront', icon: Store },
  { id: 'team', labelFr: "Gestion d'Équipe", labelEn: 'Team & Roles', icon: UserCheck },
  { id: 'kyc', labelFr: 'Identité & KYC', labelEn: 'KYC & Compliance', icon: ShieldCheck },
  { id: 'support', labelFr: 'Assistance 24/7', labelEn: '24/7 Support', icon: Headphones },
];

const PAGE_TITLES: Record<PageId, { fr: string; en: string; parent?: PageId }> = {
  welcome: { fr: 'Accueil Marchand', en: 'Merchant Startup' },
  hub: { fr: 'Hub Marchand', en: 'Merchant Hub' },
  products: { fr: 'Catalogue Produits', en: 'Product Catalog' },
  'add-product': { fr: 'Ajouter un Produit', en: 'Add New Product', parent: 'products' },
  orders: { fr: 'Commandes & Dispatch', en: 'Orders & Dispatch' },
  dispatch: { fr: 'Expédition & Livreur', en: 'Fulfillment & Rider', parent: 'orders' },
  wallet: { fr: 'Portefeuille & MoMo', en: 'Wallet & MoMo' },
  notifications: { fr: 'Notifications', en: 'Notifications', parent: 'hub' },
  chat: { fr: 'Messagerie Client', en: 'Customer Chat', parent: 'orders' },
  analytics: { fr: 'Intelligence Commerciale', en: 'Sales Analytics', parent: 'hub' },
  crm: { fr: 'Répertoire Clients & CRM', en: 'Customers & CRM', parent: 'hub' },
  reviews: { fr: 'Avis & Réputation', en: 'Reviews & Reputation', parent: 'hub' },
  marketing: { fr: 'Marketing & Croissance', en: 'Marketing & Growth', parent: 'hub' },
  team: { fr: "Gestion d'Équipe & Rôles", en: 'Team & Roles', parent: 'menu' },
  storefront: { fr: 'Vitrine Publique', en: 'Public Storefront', parent: 'menu' },
  kyc: { fr: 'Vérification KYC', en: 'KYC Verification', parent: 'menu' },
  support: { fr: 'Assistance Vendeur 24/7', en: '24/7 Merchant Support', parent: 'menu' },
  menu: { fr: 'Menu & Paramètres', en: 'Menu & Settings' },
  login: { fr: 'Connexion Marchand', en: 'Vendor Sign In' },
  register: { fr: 'Inscription Vendeur', en: 'Vendor Onboarding' },
  otp: { fr: 'Vérification OTP', en: 'OTP Verification' },
};

export const AppShell: React.FC<AppShellProps> = ({
  currentPage,
  onNavigate,
  lang,
  onToggleLang,
  unreadNotifs,
  pendingOrdersCount,
  settings,
  children,
}) => {
  const isAuthPage =
    currentPage === 'welcome' ||
    currentPage === 'login' ||
    currentPage === 'register' ||
    currentPage === 'otp';
  const pageMeta = PAGE_TITLES[currentPage];
  const labels = T[lang];

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F5F5FA] flex flex-col">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ECEAF6]">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              {currentPage !== 'welcome' ? (
                <button
                  type="button"
                  onClick={() => onNavigate(currentPage === 'otp' ? 'login' : 'welcome')}
                  className="w-9 h-9 rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] flex items-center justify-center text-[#13112B] transition-colors shrink-0"
                  aria-label={lang === 'fr' ? 'Retour' : 'Back'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <MiniBLogo size="sm" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#13112B] truncate">
                  {lang === 'fr' ? 'Espace Vendeur Pro' : 'Vendor Pro Hub'}
                </p>
                <p className="text-[11px] text-[#7C7998] truncate">Cotonou · Benin</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:inline-flex">
                <PWAInstallButton lang={lang} variant="compact" />
              </div>
              <div className="inline-flex items-center rounded-xl bg-[#F2F1FA] p-0.5 border border-[#E7E4F6]">
                {(['fr', 'en'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onToggleLang(code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                      lang === code
                        ? 'bg-[#5433FF] text-white shadow-2xs'
                        : 'text-[#4B4869] hover:text-[#13112B]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
              {currentPage !== 'welcome' && (
                <button
                  type="button"
                  onClick={() => onNavigate('welcome')}
                  className="text-xs font-semibold text-[#5433FF] hover:underline px-2 py-1.5 whitespace-nowrap"
                >
                  {lang === 'fr' ? 'Accueil' : 'Start'}
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5FA] text-[#13112B] lg:flex">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 lg:shrink-0 bg-white border-r border-[#ECEAF6] sticky top-0 h-screen">
        <div className="p-4 border-b border-[#ECEAF6] flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <MiniBLogo size="md" />
            <span className="text-[10px] font-bold text-[#5433FF] bg-[#F0EDFF] px-2 py-0.5 rounded-md">
              PRO
            </span>
          </div>
          <p className="text-xs font-semibold text-[#4B4869] truncate pl-0.5">{settings.shopName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7C7998]">
              {lang === 'fr' ? 'Navigation Principale' : 'Primary Navigation'}
            </p>
            <nav className="space-y-1">
              {PRIMARY_TABS.map((tab) => {
                const Icon = tab.icon;
                const active =
                  currentPage === tab.id ||
                  (tab.id === 'orders' && (currentPage === 'dispatch' || currentPage === 'chat')) ||
                  (tab.id === 'products' && currentPage === 'add-product');
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onNavigate(tab.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#5433FF] text-white shadow-sm shadow-[#5433FF]/25'
                        : 'text-[#4B4869] hover:bg-[#F5F5FA] hover:text-[#13112B]'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{labels[tab.labelKey]}</span>
                    </span>
                    {tab.id === 'orders' && pendingOrdersCount > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                          active ? 'bg-white text-[#5433FF]' : 'bg-[#EF4444] text-white'
                        }`}
                      >
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7C7998]">
              {lang === 'fr' ? 'Modules Marchand' : 'Merchant Modules'}
            </p>
            <nav className="space-y-1">
              {SECONDARY_MODULES.map((mod) => {
                const Icon = mod.icon;
                const active = currentPage === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => onNavigate(mod.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#F0EDFF] text-[#5433FF]'
                        : 'text-[#4B4869] hover:bg-[#F5F5FA] hover:text-[#13112B]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{lang === 'fr' ? mod.labelFr : mod.labelEn}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-3 border-t border-[#ECEAF6] space-y-2">
          <PWAInstallButton lang={lang} variant="banner" />
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] px-3 py-2 text-xs font-bold text-[#5433FF] transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Ouvrir une boutique' : 'New Vendor Sign Up'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{labels.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ECEAF6]">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {pageMeta.parent ? (
                <button
                  type="button"
                  onClick={() => onNavigate(pageMeta.parent!)}
                  className="w-9 h-9 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] flex items-center justify-center text-[#13112B] transition-colors shrink-0 lg:hidden"
                  aria-label={lang === 'fr' ? 'Retour' : 'Back'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('hub')}
                  className="lg:hidden shrink-0"
                  aria-label="Mini-B Hub"
                >
                  <MiniBLogo size="sm" />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#13112B] truncate">
                    {settings.shopName.replace(' Bénin', '')}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#7C7998] truncate">
                  <MapPin className="w-3 h-3 shrink-0 text-[#7C7998]" />
                  <span className="truncate">{lang === 'fr' ? 'Cotonou, Bénin' : 'Cotonou, Benin'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#5433FF] truncate">
                    {lang === 'fr' ? pageMeta.fr : pageMeta.en}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:inline-flex">
                <PWAInstallButton lang={lang} variant="compact" />
              </div>

              <div className="inline-flex items-center rounded-xl bg-[#F2F1FA] p-0.5 border border-[#E7E4F6]">
                {(['fr', 'en'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onToggleLang(code)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors min-h-[28px] ${
                      lang === code
                        ? 'bg-[#5433FF] text-white shadow-2xs'
                        : 'text-[#4B4869] hover:text-[#13112B]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onNavigate('notifications')}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  currentPage === 'notifications'
                    ? 'bg-[#F0EDFF] text-[#5433FF]'
                    : 'bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B]'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-white" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-[#5433FF]"
                aria-label={lang === 'fr' ? 'Profil et Menu' : 'Profile and Menu'}
              >
                <AvatarBadge
                  initials={getInitials(settings.managerName)}
                  tone="purple"
                  online={settings.isOpen}
                  size="sm"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable View Body */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-6 pt-4 pb-24 lg:pb-10">
          {children}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar (5 Tabs) */}
        <nav
          aria-label={lang === 'fr' ? 'Navigation mobile' : 'Mobile navigation'}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEAF6] pb-safe"
        >
          <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
            {PRIMARY_TABS.map((tab) => {
              const Icon = tab.icon;
              const active =
                currentPage === tab.id ||
                (tab.id === 'orders' && (currentPage === 'dispatch' || currentPage === 'chat')) ||
                (tab.id === 'products' && currentPage === 'add-product');
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigate(tab.id)}
                  className="relative flex flex-col items-center justify-center h-full min-h-[44px] gap-1 transition-colors"
                >
                  <div
                    className={`relative px-3.5 py-1.5 rounded-xl transition-colors ${
                      active ? 'bg-[#5433FF] text-white shadow-xs' : 'text-[#4B4869]'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {tab.id === 'orders' && pendingOrdersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white tabular-nums">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-tight whitespace-nowrap ${
                      active ? 'text-[#5433FF]' : 'text-[#7C7998]'
                    }`}
                  >
                    {labels[tab.labelKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
