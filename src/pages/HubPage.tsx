import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Headphones,
  Megaphone,
  MessageSquare,
  Package,
  Plus,
  Rocket,
  ShieldCheck,
  Store,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Wallet,
  Zap,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { Lang, Order, PageId, Product, Review, StoreSettings, TeamMember } from '../types/app';
import { formatFCFA, T } from '../data/mockStore';
import { trOrder } from '../data/i18n';
import { ProductVisual } from '../components/VisualAssets';

interface HubPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  balance: number;
  orders: Order[];
  products: Product[];
  reviews: Review[];
  team: TeamMember[];
  settings: StoreSettings;
  weekendBoostActive: boolean;
  onToggleWeekendBoost: () => void;
  onNavigate: (page: PageId, contextId?: string) => void;
  onShowToast: (msg: string) => void;
}

export const HubPage: React.FC<HubPageProps> = ({
  lang,
  vendorMode,
  balance,
  orders,
  products,
  reviews,
  team,
  settings,
  weekendBoostActive,
  onToggleWeekendBoost,
  onNavigate,
  onShowToast,
}) => {
  const [dateRange, setDateRange] = useState<'today' | 'week'>('today');
  const labels = T[lang];
  const isFr = lang === 'fr';
  const firstName = settings.managerName.trim().split(/\s+/)[0] || (isFr ? 'Vendeur' : 'Seller');

  const pendingOrders = orders.filter((o) => o.status === 'Nouveau' || o.status === 'En cours');
  const shippedOrdersCount = orders.filter((o) => o.status === 'Expédié').length;
  const lowStockCount =
    products.filter((p) => p.stock > 0 && p.stock <= 3).length +
    products.filter((p) => p.stock === 0).length;
  const activeProductsCount = products.filter((p) => p.visible).length;
  const rawPriorityOrder = orders.find((o) => o.urgency === 'Urgent') || orders[0];
  const priorityOrder = rawPriorityOrder ? trOrder(rawPriorityOrder, lang) : undefined;

  const liveRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const dailySalesText =
    vendorMode === 'existing'
      ? dateRange === 'today'
        ? '284 500'
        : '1 890 000'
      : liveRevenue.toLocaleString('fr-FR');
  const weekVolumeText =
    vendorMode === 'existing' ? '1 890 000' : liveRevenue.toLocaleString('fr-FR');
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const quickTools: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tone: string;
    badge?: number;
    page?: PageId;
    toast?: string;
  }[] = [
    { label: isFr ? '+ Produit' : '+ Product', icon: Plus, tone: 'bg-[#5433FF] text-white', page: 'add-product' },
    {
      label: isFr ? 'Commandes' : 'Orders',
      icon: Truck,
      tone: 'bg-[#EEF0FF] text-[#5433FF]',
      badge: pendingOrders.length,
      page: 'orders',
    },
    { label: isFr ? 'Portefeuille' : 'Wallet', icon: Wallet, tone: 'bg-[#ECFDF5] text-[#059669]', page: 'wallet' },
    { label: 'WhatsApp', icon: MessageSquare, tone: 'bg-[#D1FAE5] text-[#047857]', page: 'chat' },
    { label: isFr ? 'Ventes & Stats' : 'Analytics', icon: BarChart3, tone: 'bg-[#EEF0FF] text-[#4F46E5]', page: 'analytics' },
    { label: isFr ? 'Promotions' : 'Promos', icon: Zap, tone: 'bg-[#FEF3C7] text-[#D97706]', page: 'marketing' },
    { label: isFr ? `Équipe (${team.length})` : `Team (${team.length})`, icon: UserCheck, tone: 'bg-[#F1F5F9] text-[#334155]', page: 'team' },
    { label: isFr ? 'Boutique' : 'Storefront', icon: Store, tone: 'bg-[#F3F4F6] text-[#1F2937]', page: 'storefront' },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#13112B] text-balance">
            {isFr ? `Bonjour, ${firstName} !` : `Hello, ${firstName}!`}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#4B4869]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#059669]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {vendorMode === 'existing'
                ? 'RCCM RB/COT/23-A-1094'
                : settings.ifuNumber
                  ? `IFU ${settings.ifuNumber}`
                  : isFr
                    ? 'Nouvelle Boutique MINI-B'
                    : 'New MINI-B Store'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#13112B]">
              {vendorMode === 'existing'
                ? isFr
                  ? 'Boutique Pro'
                  : 'Pro Store'
                : settings.category || (isFr ? 'Boutique Partenaire' : 'Partner Store')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDateRange(dateRange === 'today' ? 'week' : 'today')}
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#ECEAF6] px-3.5 py-2 text-xs font-semibold text-[#13112B] shadow-2xs hover:bg-[#F9F8FE] transition-colors min-h-[40px]"
        >
          <Calendar className="w-3.5 h-3.5 text-[#5433FF]" />
          <span>
            {dateRange === 'today'
              ? isFr
                ? "Aujourd'hui, 24 Mai"
                : 'Today, May 24'
              : isFr
                ? '7 Derniers Jours'
                : 'Last 7 Days'}
          </span>
        </button>
      </div>

      {/* Top Desktop 2-Column Split: Royal Purple Wallet Card + 2x2 Key Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Hero Royal Purple Balance Card */}
        <section className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#5B3BFF] via-[#4D26E2] to-[#3715C9] text-white p-5 sm:p-6 shadow-lg shadow-[#5433FF]/20 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white/85 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>{labels.availableBalance}</span>
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
                    {balance.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-sm font-bold text-white/85">FCFA</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('wallet')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white text-[#5433FF] hover:bg-[#F5F3FF] px-3.5 py-2.5 text-xs font-bold shadow-sm transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{labels.withdraw}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-white/90">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                MTN MoMo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                Moov Money
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                Celtiis Cash
              </span>
            </div>
            <span className="font-semibold text-[#A7F3D0]">
              {isFr ? '0% frais réseau' : '0% network fee'}
            </span>
          </div>
        </section>

        {/* Key Indicators 2x2 Grid */}
        <section className="lg:col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-[#13112B]">{labels.keyIndicators}</h2>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-[#5433FF] hover:underline"
            >
              {labels.realtime}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-left rounded-2xl bg-white border border-[#ECEAF6] p-3.5 hover:border-[#5433FF]/30 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#7C7998]">{labels.dailySales}</span>
                <span className="w-7 h-7 rounded-lg bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
                  <Wallet className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <p className="text-lg sm:text-xl font-extrabold text-[#13112B] tabular-nums">
                  {dailySalesText}{' '}
                  <span className="text-xs font-semibold text-[#7C7998]">FCFA</span>
                </p>
                {vendorMode === 'existing' ? (
                  <p className="mt-1 text-[11px] font-semibold text-[#059669] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +14.2%{' '}
                    <span className="text-[#7C7998] font-normal">
                      {isFr ? 'vs hier' : 'vs yesterday'}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] font-semibold text-[#7C7998]">
                    {orders.length === 0
                      ? isFr
                        ? 'En attente de 1ère vente'
                        : 'Awaiting 1st sale'
                      : isFr
                        ? `${orders.length} commande(s) reçue(s)`
                        : `${orders.length} order(s) received`}
                  </p>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-left rounded-2xl bg-white border border-[#ECEAF6] p-3.5 hover:border-[#5433FF]/30 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#7C7998]">{labels.toProcess}</span>
                <span className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <p className="text-lg sm:text-xl font-extrabold text-[#13112B] tabular-nums">
                  {pendingOrders.length}{' '}
                  <span className="text-xs font-semibold text-[#7C7998]">
                    {isFr ? 'commandes' : 'orders'}
                  </span>
                </p>
                <p
                  className={`mt-1 text-[11px] font-semibold ${
                    pendingOrders.length > 0 ? 'text-[#B45309]' : 'text-[#059669]'
                  }`}
                >
                  {pendingOrders.length > 0
                    ? isFr
                      ? 'Urgence moyenne'
                      : 'Medium urgency'
                    : isFr
                      ? 'Aucune attente'
                      : 'All caught up'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-left rounded-2xl bg-white border border-[#ECEAF6] p-3.5 hover:border-[#5433FF]/30 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#7C7998]">{labels.weekVolume}</span>
                <span className="w-7 h-7 rounded-lg bg-[#EEF0FF] text-[#5433FF] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <p className="text-lg sm:text-xl font-extrabold text-[#13112B] tabular-nums">
                  {weekVolumeText} <span className="text-xs font-semibold text-[#7C7998]">F</span>
                </p>
                <p
                  className={`mt-1 text-[11px] font-semibold ${
                    vendorMode === 'existing' || orders.length > 0
                      ? 'text-[#059669]'
                      : 'text-[#7C7998]'
                  }`}
                >
                  {vendorMode === 'existing'
                    ? isFr
                      ? '29 ventes'
                      : '29 sales'
                    : isFr
                      ? `${orders.length} vente${orders.length > 1 ? 's' : ''}`
                      : `${orders.length} sale${orders.length === 1 ? '' : 's'}`}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="text-left rounded-2xl bg-white border border-[#ECEAF6] p-3.5 hover:border-[#5433FF]/30 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#7C7998]">{labels.catalog}</span>
                <span className="w-7 h-7 rounded-lg bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
                  <Package className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <p className="text-lg sm:text-xl font-extrabold text-[#13112B] tabular-nums">
                  {activeProductsCount}{' '}
                  <span className="text-xs font-semibold text-[#7C7998]">
                    {isFr ? 'en ligne' : 'live'}
                  </span>
                </p>
                {products.length === 0 ? (
                  <p className="mt-1 text-[11px] font-semibold text-[#5433FF]">
                    {isFr ? '+ Ajouter un produit' : '+ Add first product'}
                  </p>
                ) : (
                  <p
                    className={`mt-1 text-[11px] font-semibold flex items-center gap-1 ${
                      lowStockCount > 0 ? 'text-[#DC2626]' : 'text-[#059669]'
                    }`}
                  >
                    {lowStockCount > 0 && <AlertTriangle className="w-3 h-3" />}
                    {lowStockCount > 0
                      ? `${lowStockCount} ${isFr ? 'stocks bas' : 'low stock'}`
                      : isFr
                        ? 'Stock optimal'
                        : 'Healthy stock'}
                  </p>
                )}
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Priority Dispatch Card OR First-Launch Checklist Card for New Vendors */}
      {priorityOrder ? (
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-[#13112B] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span>{labels.priorityDispatch}</span>
            </h2>
            <span className="rounded-lg bg-[#FEE2E2] text-[#DC2626] px-2.5 py-1 text-[11px] font-bold">
              {isFr ? 'À expédier avant 12h' : 'Ship before 12:00 PM'}
            </span>
          </div>

          <div className="rounded-2xl bg-[#F8F7FC] border border-[#ECEAF6] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <ProductVisual
                type={priorityOrder.visualType}
                imageUrl={
                  products.find((p) => p.visualType === priorityOrder.visualType)?.imageUrl
                }
                alt={priorityOrder.productName}
                className="w-16 h-14"
              />
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#13112B] truncate">
                    {priorityOrder.productName}
                  </p>
                </div>
                <p className="text-xs text-[#4B4869] truncate mt-0.5">
                  {isFr ? 'Client' : 'Buyer'}: {priorityOrder.customerName} · {priorityOrder.customerLocation}
                </p>
                <p className="text-[11px] font-semibold text-[#059669] mt-1">
                  Zem Express · {isFr ? 'Payé via' : 'Paid via'} {priorityOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-base font-extrabold text-[#5433FF] tabular-nums">
                {formatFCFA(priorityOrder.amount, 'F')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dispatch', priorityOrder.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap min-h-[44px]"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isFr ? 'Assigner Livreur Zem' : 'Assign Zem Rider'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('chat', priorityOrder.id)}
                  className="w-11 h-11 rounded-xl bg-white border border-[#E5E2F5] hover:bg-[#F0EDFF] text-[#13112B] flex items-center justify-center transition-colors shrink-0"
                  aria-label={isFr ? 'Message client' : 'Message buyer'}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
              {products.length === 0 ? <Plus className="w-5 h-5" /> : <Store className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <span className="inline-block rounded-md bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[10px] font-bold uppercase mb-1">
                {isFr ? 'Démarrage Boutique' : 'Store Launch'}
              </span>
              <h2 className="text-sm font-extrabold text-[#13112B]">
                {products.length === 0
                  ? isFr
                    ? 'Ajoutez votre premier produit pour commencer à vendre'
                    : 'Add your first product to start selling'
                  : isFr
                    ? 'Votre boutique est prête pour sa 1ère commande !'
                    : 'Your store is ready for its 1st order!'}
              </h2>
              <p className="text-xs text-[#7C7998] mt-0.5">
                {products.length === 0
                  ? isFr
                    ? 'Publiez vos articles avec photos réelles, stock et prix FCFA.'
                    : 'Publish items with real photos, stock levels, and FCFA pricing.'
                  : isFr
                    ? 'Partagez votre lien vitrine sur WhatsApp pour encaisser via Mobile Money.'
                    : 'Share your storefront link on WhatsApp to accept Mobile Money payments.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(products.length === 0 ? 'add-product' : 'storefront')}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold transition-colors min-h-[44px]"
          >
            <span>
              {products.length === 0
                ? isFr
                  ? '+ Ajouter un produit'
                  : '+ Add first product'
                : isFr
                  ? 'Voir & partager ma vitrine'
                  : 'View & share storefront'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* Quick Actions & Operations */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#13112B]">{labels.quickActions}</h2>
          <span className="text-xs font-medium text-[#7C7998]">
            {isFr ? '8 outils' : '8 tools'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => {
                  if (tool.page) onNavigate(tool.page);
                  else if (tool.toast) onShowToast(tool.toast);
                }}
                className="relative rounded-2xl bg-white border border-[#ECEAF6] hover:border-[#5433FF]/35 p-3 flex flex-col items-center justify-center gap-2 transition-colors min-h-[84px]"
              >
                <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${tool.tone}`}>
                  <Icon className="w-5 h-5" />
                  {tool.badge !== undefined && tool.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white tabular-nums">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-[#13112B] text-center leading-tight">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hub Modules & Features Directory */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#13112B]">{labels.hubModules}</h2>
          <span className="text-xs font-semibold text-[#5433FF]">
            {isFr ? '18 Écrans' : '18 Screens'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Module 1: Catalog & Stock */}
          <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="w-full flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#13112B] group-hover:text-[#5433FF] transition-colors">
                    {isFr ? 'Catalogue & Stocks' : 'Catalog & Inventory'}
                  </h3>
                  <p className="text-xs text-[#7C7998] truncate">
                    {isFr
                      ? `${products.length} produits actifs · ${lowStockCount} alertes stock`
                      : `${products.length} active products · ${lowStockCount} stock alerts`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7C7998] shrink-0" />
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Liste Produits' : 'Product List'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('add-product')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? '+ Nouveau Produit' : '+ New Product'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] px-3 py-1.5 text-xs font-bold text-[#DC2626]"
              >
                {isFr ? `Alerte Rupture (${lowStockCount})` : `Low Stock Alert (${lowStockCount})`}
              </button>
            </div>
          </div>

          {/* Module 2: Orders & Dispatch */}
          <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="w-full flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#13112B] group-hover:text-[#5433FF] transition-colors">
                    {isFr ? 'Commandes & Dispatch' : 'Orders & Dispatch'}
                  </h3>
                  <p className="text-xs text-[#7C7998] truncate">
                    {isFr
                      ? `${pendingOrders.length} en préparation · ${shippedOrdersCount} en cours de route`
                      : `${pendingOrders.length} preparing · ${shippedOrdersCount} in transit`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7C7998] shrink-0" />
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] px-3 py-1.5 text-xs font-bold text-[#5433FF]"
              >
                {isFr ? `À Confirmer (${pendingOrders.length})` : `To Confirm (${pendingOrders.length})`}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dispatch')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Réseau Livreurs (Zem)' : 'Rider Network (Zem)'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dispatch')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? "Bordereaux d'Envoi" : 'Shipping Slips'}
              </button>
            </div>
          </div>

          {/* Module 3: Finance & Mobile Money */}
          <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('wallet')}
              className="w-full flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#13112B] group-hover:text-[#5433FF] transition-colors">
                    {isFr ? 'Finances & Mobile Money' : 'Finance & Mobile Money'}
                  </h3>
                  <p className="text-xs text-[#7C7998] truncate">
                    {isFr
                      ? 'Séquestre sécurisé · Retraits instantanés'
                      : 'Secured escrow · Instant payouts'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7C7998] shrink-0" />
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('wallet')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Solde Séquestre' : 'Escrow Balance'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('wallet')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Retrait MTN MoMo' : 'MTN MoMo Payout'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('kyc')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Conformité KYC & IFU' : 'KYC & Tax Compliance'}
              </button>
            </div>
          </div>

          {/* Module 4: Customers & Reputation */}
          <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('crm')}
              className="w-full flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#13112B] group-hover:text-[#5433FF] transition-colors">
                    {isFr ? 'Clients & Réputation' : 'Customers & Reputation'}
                  </h3>
                  <p className="text-xs text-[#7C7998] truncate">
                    {vendorMode === 'existing'
                      ? isFr
                        ? 'Note boutique : 4.9/5 (128 avis)'
                        : 'Store rating: 4.9/5 (128 reviews)'
                      : reviews.length === 0
                        ? isFr
                          ? 'Aucun avis client pour le moment'
                          : 'No customer reviews yet'
                        : isFr
                          ? `Note boutique : ${avgRating}/5 (${reviews.length} avis)`
                          : `Store rating: ${avgRating}/5 (${reviews.length} reviews)`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7C7998] shrink-0" />
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('crm')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Fichier VIP Cotonou' : 'Cotonou VIP List'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reviews')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]"
              >
                {isFr ? 'Avis Clients' : 'Customer Reviews'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('support')}
                className="rounded-xl bg-[#F5F5FA] hover:bg-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B] inline-flex items-center gap-1"
              >
                <Headphones className="w-3.5 h-3.5 text-[#5433FF]" />
                {isFr ? 'Assistance 24/7' : '24/7 Support'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Boost Banner */}
      <section className="rounded-3xl bg-[#EFEBF9] border border-[#DFD8F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#5433FF] text-white flex items-center justify-center shrink-0 shadow-sm">
            {weekendBoostActive ? <Rocket className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#13112B]">
              {weekendBoostActive
                ? isFr
                  ? 'Boost Week-end Actif sur Ganhi & Akpakpa'
                  : 'Weekend Boost Active in Ganhi & Akpakpa'
                : isFr
                  ? 'Booster vos ventes ce week-end'
                  : 'Boost your weekend sales'}
            </h3>
            <p className="text-xs text-[#4B4869] mt-0.5">
              {isFr
                ? 'Activez la livraison gratuite à Ganhi & Akpakpa pour augmenter vos conversions.'
                : 'Enable free delivery in Ganhi & Akpakpa to increase your conversion rate.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onToggleWeekendBoost();
            onShowToast(
              weekendBoostActive
                ? isFr
                  ? 'Livraison gratuite week-end désactivée'
                  : 'Weekend free delivery disabled'
                : isFr
                  ? 'Campagne Livraison Gratuite Ganhi & Akpakpa activée !'
                  : 'Free Delivery campaign for Ganhi & Akpakpa activated!'
            );
          }}
          className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors min-h-[44px] ${
            weekendBoostActive
              ? 'bg-[#059669] text-white'
              : 'bg-[#5433FF] hover:bg-[#4423E8] text-white'
          }`}
        >
          <span>
            {weekendBoostActive ? (isFr ? 'Activé ✓' : 'Active ✓') : isFr ? 'Activer' : 'Activate'}
          </span>
          {!weekendBoostActive && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </section>
    </div>
  );
};
