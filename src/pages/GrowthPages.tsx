import React, { useEffect, useState } from 'react';
import {
  Copy,
  Download,
  Heart,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Send,
  Share2,
  Star,
  ThumbsUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Customer, Lang, Order, PageId, Product, PromoCode, Review, StoreSettings } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { trCustomer, trPromo, trReview, trSeed } from '../data/i18n';
import { AvatarBadge, ProductVisual } from '../components/VisualAssets';

interface AnalyticsPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  orders: Order[];
  products: Product[];
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  lang,
  vendorMode,
  orders,
  products,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [period, setPeriod] = useState<'today' | '7d' | 'month' | 'year'>('7d');

  const liveRev = orders.reduce((sum, o) => sum + o.amount, 0);
  const liveCount = orders.length;
  const liveAvg = liveCount > 0 ? Math.round(liveRev / liveCount) : 0;

  const statsMap =
    vendorMode === 'new'
      ? {
          rev: liveRev,
          orders: liveCount,
          avg: liveAvg,
          conv: liveCount > 0 ? '2.4%' : '0.0%',
          peak: liveRev > 0 ? formatFCFA(liveRev, 'F') : '0 F',
          bars: liveRev > 0 ? [0, 0, 0, 0, 0, 100, 0] : [0, 0, 0, 0, 0, 0, 0],
        }
      : {
          today: { rev: 284500, orders: 6, avg: 47416, conv: '4.1%', peak: '145 000 F', bars: [25, 42, 38, 55, 68, 88, 60] },
          '7d': { rev: 4280000, orders: 68, avg: 62940, conv: '4.8%', peak: '1 250 000 F', bars: [34, 48, 50, 44, 72, 100, 62] },
          month: { rev: 16420000, orders: 245, avg: 67020, conv: '5.1%', peak: '1 480 000 F', bars: [52, 60, 68, 64, 84, 96, 78] },
          year: { rev: 148500000, orders: 2180, avg: 68119, conv: '4.9%', peak: '18.2M F', bars: [45, 58, 62, 74, 80, 92, 86] },
        }[period];

  const hasAnalyticsSales = vendorMode === 'existing' || liveCount > 0;

  const days = isFr
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const exportReport = () => {
    const csv = [
      isFr ? 'Jour,Revenu (FCFA)' : 'Day,Revenue (FCFA)',
      ...days.map((d, idx) =>
        `${d},${vendorMode === 'new' ? (idx === 5 ? liveRev : 0) : Math.round((statsMap.bars[idx] / 100) * 1250000)}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isFr ? `rapport-ventes-minib-${period}.csv` : `sales-report-minib-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(isFr ? 'Rapport détaillé CSV téléchargé !' : 'Detailed CSV report downloaded!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#13112B]">
            {isFr ? 'Intelligence Commerciale' : 'Sales Analytics'}
          </h1>
          <p className="text-xs text-[#7C7998]">
            {isFr ? 'Performances des ventes & flux clients' : 'Sales performance & customer flow'}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onShowToast(
              isFr ? 'Données actualisées en temps réel' : 'Real-time analytics refreshed'
            )
          }
          className="rounded-xl bg-white border border-[#ECEAF6] px-3 py-2 text-xs font-bold text-[#5433FF]"
        >
          {isFr ? 'Actualiser' : 'Refresh'}
        </button>
      </div>

      {/* Period Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { id: 'today', label: isFr ? "Aujourd'hui" : 'Today' },
            { id: '7d', label: isFr ? '7 Derniers Jours' : 'Last 7 Days' },
            { id: 'month', label: isFr ? 'Ce Mois' : 'This Month' },
            { id: 'year', label: isFr ? 'Année 2026' : 'Year 2026' },
          ] as const
        ).map((item) => {
          const active = period === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 min-h-[40px] ${
                active
                  ? 'bg-[#5433FF] text-white'
                  : 'bg-white border border-[#ECEAF6] text-[#4B4869]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Top Purple Hero + 4 KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#5B3BFF] to-[#3715C9] text-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/85">
                {isFr ? "Chiffre d'Affaires Total" : 'Total Revenue'}
              </span>
              <span className="rounded-lg bg-[#ECFDF5]/20 text-[#34D399] px-2.5 py-0.5 text-xs font-bold">
                {hasAnalyticsSales ? '+24.5%' : '0%'}
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold font-mono tabular-nums">
              {statsMap.rev.toLocaleString('fr-FR')}{' '}
              <span className="text-sm font-bold text-white/85">FCFA</span>
            </p>
            <p className="text-xs text-white/75 mt-1">
              {hasAnalyticsSales
                ? isFr
                  ? 'vs période précédente (+820 000 FCFA)'
                  : 'vs previous period (+820,000 FCFA)'
                : isFr
                  ? 'Les indicateurs évolueront dès votre 1ère vente'
                  : 'Metrics start tracking upon your 1st sale'}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl bg-white/12 p-3">
              <p className="text-[11px] text-white/80">{isFr ? 'Commandes' : 'Orders'}</p>
              <p className="mt-1 text-lg font-extrabold tabular-nums">{statsMap.orders}</p>
              <p className="text-[10px] text-[#34D399]">{hasAnalyticsSales ? '+12%' : '—'}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-3">
              <p className="text-[11px] text-white/80">{isFr ? 'Panier Moyen' : 'Avg. Basket'}</p>
              <p className="mt-1 text-base font-extrabold tabular-nums">
                {statsMap.avg.toLocaleString('fr-FR')} F
              </p>
              <p className="text-[10px] text-[#34D399]">{hasAnalyticsSales ? '+3.2%' : '—'}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-3">
              <p className="text-[11px] text-white/80">{isFr ? 'Conversion' : 'Conversion'}</p>
              <p className="mt-1 text-lg font-extrabold tabular-nums">{statsMap.conv}</p>
              <p className="text-[10px] text-[#34D399]">{hasAnalyticsSales ? '+0.9pt' : '—'}</p>
            </div>
          </div>
        </section>

        {/* Weekly Trend Chart */}
        <section className="lg:col-span-7 rounded-3xl bg-white border border-[#ECEAF6] p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#13112B]">
                {isFr ? 'Évolution Hebdomadaire' : 'Weekly Sales Trend'}
              </h2>
              <p className="text-xs text-[#7C7998]">
                {isFr ? 'Répartition des recettes journalières' : 'Daily revenue breakdown'}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F5F4FF] border border-[#E2DDFE] px-3 py-1.5 text-right">
              <p className="text-[11px] font-bold text-[#5433FF]">
                {isFr ? 'Samedi Record' : 'Saturday Peak'}
              </p>
              <p className="text-xs font-extrabold text-[#13112B] tabular-nums">{statsMap.peak}</p>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <div className="grid grid-cols-7 gap-2.5 items-end h-44">
              {days.map((day, idx) => {
                const height = statsMap.bars[idx];
                const isPeak = idx === 5 && height > 0;
                return (
                  <div key={day} className="flex flex-col items-center justify-end h-full gap-2">
                    {isPeak && (
                      <span className="rounded-md bg-[#5433FF] text-white px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                        {vendorMode === 'new' ? formatFCFA(liveRev, 'F') : '1.25M'}
                      </span>
                    )}
                    <div className="w-full max-w-[34px] flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isPeak
                            ? 'bg-gradient-to-t from-[#3715C9] to-[#5B3BFF]'
                            : 'bg-[#E9E6FA] hover:bg-[#D5CEFA]'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isPeak ? 'text-[#5433FF]' : 'text-[#7C7998]'
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Top Selling Products + Geographic Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#13112B]">
              {isFr ? 'Top Produits Vendus' : 'Top Selling Products'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#5433FF] hover:underline"
            >
              {isFr ? 'Voir tout ›' : 'View all ›'}
            </button>
          </div>

          <div className="space-y-3">
            {vendorMode === 'new' && orders.length === 0 ? (
              <div className="rounded-2xl bg-[#F8F7FC] p-6 text-center space-y-2">
                <p className="text-sm font-bold text-[#13112B]">
                  {isFr ? 'Aucune vente enregistrée' : 'No product sales yet'}
                </p>
                <p className="text-xs text-[#7C7998]">
                  {isFr
                    ? `Votre catalogue compte ${products.length} article(s). Le classement apparaîtra après votre première commande.`
                    : `Your catalog has ${products.length} item(s). Top performers appear after your first order.`}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="inline-flex items-center rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3.5 py-2 text-xs font-bold"
                >
                  {isFr ? 'Gérer mon catalogue' : 'Manage Catalog'}
                </button>
              </div>
            ) : (
              (vendorMode === 'existing'
                ? [
                    {
                      rank: 1,
                      name: 'Dell XPS 13 (2024)',
                      sales: isFr ? '18 ventes' : '18 sales',
                      rev: '11 700 000 F',
                      rot: 88,
                      type: 'laptop-dell' as const,
                    },
                    {
                      rank: 2,
                      name: isFr ? 'Sac Laptop Imperméable' : 'Waterproof Laptop Backpack',
                      sales: isFr ? '34 ventes' : '34 sales',
                      rev: '850 000 F',
                      rot: 74,
                      type: 'backpack' as const,
                    },
                    {
                      rank: 3,
                      name: 'HP Pavilion 15 Silver',
                      sales: isFr ? '8 ventes' : '8 sales',
                      rev: '3 920 000 F',
                      rot: 52,
                      type: 'laptop-hp' as const,
                    },
                  ]
                : orders.slice(0, 3).map((o, i) => ({
                    rank: i + 1,
                    name: o.productName,
                    sales: isFr ? '1 vente' : '1 sale',
                    rev: formatFCFA(o.amount, 'F'),
                    rot: 100,
                    type: o.visualType,
                  }))
              ).map((item) => (
                <div key={item.rank} className="rounded-2xl bg-[#F8F7FC] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#5433FF] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {item.rank}
                      </span>
                      <ProductVisual type={item.type} className="w-11 h-10" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#13112B] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#059669] font-semibold">{item.sales}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-[#13112B] tabular-nums">{item.rev}</p>
                      <p className="text-[10px] font-bold text-[#059669]">
                        {isFr ? 'Rotation' : 'Turnover'}: {item.rot}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E9E6FA] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#10B981]"
                      style={{ width: `${item.rot}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[#13112B]">
                  {isFr ? 'Zones de Livraison' : 'Delivery Zones'}
                </h2>
                <p className="text-xs text-[#7C7998]">
                  {isFr ? 'Pôles de livraison au Bénin' : 'Delivery hubs across Benin'}
                </p>
              </div>
              <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-1 text-[11px] font-bold">
                Grand Nokoué
              </span>
            </div>

            {vendorMode === 'new' && orders.length === 0 ? (
              <div className="space-y-3">
                <div className="w-full h-2.5 rounded-full bg-[#F2F1FA]" />
                <div className="rounded-2xl bg-[#F8F7FC] p-5 text-center text-xs text-[#7C7998]">
                  {isFr
                    ? 'La répartition géographique (Cotonou, Abomey-Calavi, Porto-Novo) s’affichera dès votre première livraison.'
                    : 'Geographic breakdown (Cotonou, Abomey-Calavi, Porto-Novo) will appear after your first delivery.'}
                </div>
              </div>
            ) : (
              <>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-[#5433FF] h-full" style={{ width: '62%' }} />
                  <div className="bg-[#10B981] h-full" style={{ width: '24%' }} />
                  <div className="bg-[#B45309] h-full" style={{ width: '14%' }} />
                </div>

                <div className="space-y-2.5">
                  {[
                    { city: 'Cotonou Intra', areas: 'Haie Vive, Akpakpa, Cadjehoun', pct: '62%', rev: '2 782 000 F', dot: 'bg-[#5433FF]' },
                    { city: 'Abomey-Calavi', areas: 'Campus, Arconville, Zogbadjè', pct: '24%', rev: '1 070 000 F', dot: 'bg-[#10B981]' },
                    { city: 'Porto-Novo', areas: 'Ouando, Avakpa, Djassin', pct: '14%', rev: '428 000 F', dot: 'bg-[#B45309]' },
                  ].map((z) => (
                    <div
                      key={z.city}
                      className="rounded-2xl bg-[#F8F7FC] px-3.5 py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${z.dot}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#13112B]">{z.city}</p>
                          <p className="text-[11px] text-[#7C7998] truncate">{z.areas}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-[#13112B] tabular-nums">{z.pct}</p>
                        <p className="text-[10px] text-[#7C7998] tabular-nums">{z.rev}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={exportReport}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold min-h-[48px]"
          >
            <Download className="w-4 h-4" />
            <span>
              {isFr
                ? 'Télécharger le Rapport Détaillé (Excel / CSV)'
                : 'Download Detailed Report (Excel / CSV)'}
            </span>
          </button>
        </section>
      </div>
    </div>
  );
};

interface CrmPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  customers: Customer[];
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

export const CrmPage: React.FC<CrmPageProps> = ({
  lang,
  vendorMode,
  settings,
  customers,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<'Tous' | 'VIP Cotonou' | 'Nouveaux'>('Tous');
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState(
    isFr
      ? `Offre VIP ${settings.shopName} : -10% ce week-end avec le code VIP10 + livraison Zem offerte à Cotonou !`
      : `${settings.shopName} VIP Offer: 10% off this weekend with code VIP10 + free Zem delivery in Cotonou!`
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const totalCustomers = vendorMode === 'existing' ? Math.max(142, customers.length) : customers.length;
  const vipCount =
    vendorMode === 'existing'
      ? Math.max(38, customers.filter((c) => c.tier !== 'CLIENT ACTIF').length)
      : customers.filter((c) => c.tier !== 'CLIENT ACTIF').length;
  const cotonouVipCount =
    vendorMode === 'existing'
      ? 24
      : customers.filter((c) => c.segment === 'VIP Cotonou').length;
  const avgBasket =
    vendorMode === 'existing'
      ? 62940
      : customers.length > 0
        ? Math.round(
            customers.reduce((s, c) => s + c.totalSpent, 0) /
              Math.max(1, customers.reduce((s, c) => s + c.ordersCount, 0))
          )
        : 0;

  const filtered = customers
    .filter((c) => {
      const matchSeg = segment === 'Tous' || c.segment === segment;
      const matchText =
        !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      return matchSeg && matchText;
    })
    .map((c) => trCustomer(c, lang));

  const segmentLabels = [
    { key: 'Tous' as const, label: isFr ? `Tous (${totalCustomers})` : `All (${totalCustomers})` },
    {
      key: 'VIP Cotonou' as const,
      label: isFr ? `VIP Cotonou (${cotonouVipCount})` : `Cotonou VIP (${cotonouVipCount})`,
    },
    { key: 'Nouveaux' as const, label: isFr ? 'Nouveaux (<7j)' : 'New (<7d)' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-extrabold text-[#13112B] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#5433FF]" />
          {isFr ? 'Répertoire Clients & CRM' : 'Customer Directory & CRM'}
        </h1>
        <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-1 text-xs font-bold tabular-nums">
          {isFr ? `${totalCustomers} Actifs` : `${totalCustomers} Active`}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4">
          <p className="text-xs text-[#7C7998]">{isFr ? 'Total Clients' : 'Total Customers'}</p>
          <p className="mt-1 text-2xl font-extrabold text-[#13112B] tabular-nums">
            {totalCustomers}
          </p>
          <p className="text-xs font-bold text-[#059669] mt-1">
            {totalCustomers > 0
              ? isFr
                ? '↗ +14% ce mois'
                : '↗ +14% this month'
              : isFr
                ? 'Démarre à la 1ère vente'
                : 'Starts on 1st sale'}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4">
          <p className="text-xs text-[#7C7998]">{isFr ? 'Clients VIP' : 'VIP Buyers'}</p>
          <p className="mt-1 text-2xl font-extrabold text-[#13112B] tabular-nums">
            {vipCount} VIP
          </p>
          <p className="text-xs text-[#7C7998] mt-1">
            {isFr ? '≥ 2 commandes' : '≥ 2 orders'}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4">
          <p className="text-xs text-[#7C7998]">
            {isFr ? 'Panier Moyen Global' : 'Global Avg. Order'}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#13112B] tabular-nums">
            {avgBasket.toLocaleString('fr-FR')}{' '}
            <span className="text-xs text-[#5433FF]">FCFA</span>
          </p>
          <p className="text-xs font-bold text-[#059669] mt-1">
            {avgBasket > 0
              ? isFr
                ? '+5 200 F vs Trim. 3'
                : '+5,200 F vs Q3'
              : isFr
                ? 'Aucune commande'
                : 'No orders yet'}
          </p>
        </div>
      </div>

      {/* Smart CRM WhatsApp Campaign Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-[#5B3BFF] to-[#3715C9] text-white p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#34D399]" />
          <h2 className="text-sm font-extrabold">
            {isFr ? 'Campagne WhatsApp Ciblée' : 'Targeted WhatsApp Campaign'}
          </h2>
          <span className="rounded-md bg-[#10B981] text-white px-2 py-0.5 text-[10px] font-bold">
            SMART CRM
          </span>
        </div>
        <p className="text-xs text-white/85 leading-relaxed">
          {vipCount > 0 ? (
            isFr ? (
              <>
                Envoyez une offre promotionnelle privée à vos <strong>{vipCount} clients VIP</strong>{' '}
                en 1 clic via leurs messageries WhatsApp.
              </>
            ) : (
              <>
                Send a private promotional offer to your <strong>{vipCount} VIP customers</strong> in
                1 click directly via WhatsApp.
              </>
            )
          ) : isFr ? (
            'Vos clients réguliers seront automatiquement classés VIP dès leur 2e commande sur votre boutique.'
          ) : (
            'Repeat buyers are automatically tagged as VIP after their 2nd order in your store.'
          )}
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (vipCount === 0) {
                onShowToast(
                  isFr
                    ? 'Aucun client VIP enregistré pour le moment.'
                    : 'No VIP buyers recorded yet.'
                );
                return;
              }
              onShowToast(
                isFr
                  ? `Diffusion WhatsApp envoyée aux ${vipCount} clients VIP !`
                  : `WhatsApp broadcast sent to ${vipCount} VIP buyers!`
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-[#5433FF] hover:bg-[#F5F3FF] px-4 py-2.5 text-xs font-extrabold min-h-[40px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isFr ? 'Diffuser aux VIPs' : 'Broadcast to VIPs'}</span>
          </button>
          <button
            type="button"
            onClick={() => setBroadcastOpen((v) => !v)}
            className="rounded-xl bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 text-xs font-bold min-h-[40px]"
          >
            {isFr ? 'Personnaliser' : 'Customize'}
          </button>
        </div>
      </section>

      {broadcastOpen && (
        <div className="rounded-3xl bg-white border border-[#D8D0FE] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#13112B]">
              {isFr ? 'Message de campagne VIP' : 'VIP Campaign Message'}
            </h3>
            <button
              type="button"
              onClick={() => setBroadcastOpen(false)}
              className="text-xs text-[#7C7998]"
            >
              {isFr ? 'Fermer' : 'Close'}
            </button>
          </div>
          <textarea
            rows={3}
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] p-3 text-xs text-[#13112B] outline-none focus:border-[#5433FF]"
          />
          <button
            type="button"
            onClick={() => {
              setBroadcastOpen(false);
              onShowToast(
                vipCount > 0
                  ? isFr
                    ? `Message personnalisé envoyé à ${vipCount} clients VIP !`
                    : `Custom message sent to ${vipCount} VIP customers!`
                  : isFr
                    ? 'Modèle de message sauvegardé pour vos futurs VIPs !'
                    : 'Message template saved for your future VIP buyers!'
              );
            }}
            className="rounded-xl bg-[#5433FF] text-white px-4 py-2 text-xs font-bold"
          >
            {isFr ? 'Envoyer maintenant' : 'Send now'}
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 flex items-center gap-2 rounded-2xl bg-white border border-[#ECEAF6] px-4 py-2.5">
          <Search className="w-4 h-4 text-[#7C7998]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isFr
                ? 'Rechercher par nom, ville, WhatsApp...'
                : 'Search by name, city, WhatsApp...'
            }
            className="w-full bg-transparent text-xs font-medium text-[#13112B] outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {segmentLabels.map((seg) => (
            <button
              key={seg.key}
              type="button"
              onClick={() => setSegment(seg.key)}
              className={`rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 min-h-[40px] ${
                segment === seg.key
                  ? 'bg-[#5433FF] text-white'
                  : 'bg-white border border-[#ECEAF6] text-[#4B4869]'
              }`}
            >
              {seg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-2">
            <Users className="w-9 h-9 text-[#5433FF]/60 mx-auto" />
            <p className="text-sm font-bold text-[#13112B]">
              {customers.length === 0
                ? isFr
                  ? 'Aucun client enregistré pour le moment'
                  : 'No customers recorded yet'
                : isFr
                  ? 'Aucun client ne correspond à ce filtre'
                  : 'No customers match this filter'}
            </p>
            <p className="text-xs text-[#7C7998] max-w-md mx-auto">
              {customers.length === 0
                ? isFr
                  ? 'Chaque acheteur MINI-B Pay est automatiquement ajouté à votre répertoire client dès sa première commande.'
                  : 'Every MINI-B Pay buyer is automatically added to your CRM directory on their first order.'
                : isFr
                  ? 'Essayez un autre segment ou réinitialisez la recherche.'
                  : 'Try another segment or clear your search.'}
            </p>
          </div>
        ) : (
          filtered.map((cust) => (
          <article
            key={cust.id}
            className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarBadge
                  initials={cust.initials}
                  tone={
                    cust.tier === 'VIP OR'
                      ? 'amber'
                      : cust.tier === 'VIP'
                        ? 'purple'
                        : 'emerald'
                  }
                  size="md"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#13112B] truncate">{cust.name}</h3>
                  <p className="text-xs text-[#7C7998] truncate">{cust.location}</p>
                </div>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold shrink-0 ${
                  cust.tier === 'VIP OR'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : cust.tier === 'VIP'
                      ? 'bg-[#F0EDFF] text-[#5433FF]'
                      : 'bg-[#ECFDF5] text-[#059669]'
                }`}
              >
                {trSeed(cust.tier, lang)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#F8F7FC] p-3">
              <div>
                <p className="text-[11px] text-[#7C7998]">{isFr ? 'Commandes' : 'Orders'}</p>
                <p className="text-sm font-extrabold text-[#13112B]">
                  {cust.ordersCount} {isFr ? 'réglées' : 'paid'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#7C7998]">
                  {isFr ? 'Dépensé cumulé' : 'Lifetime Spend'}
                </p>
                <p className="text-sm font-extrabold text-[#5433FF] tabular-nums">
                  {formatFCFA(cust.totalSpent)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#4B4869]">
              <span className="truncate font-medium">{cust.lastProduct}</span>
              <span className="font-semibold text-[#059669] shrink-0">{cust.lastOrderTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('chat')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] py-2.5 text-xs font-bold min-h-[42px]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onShowToast(isFr ? `Appel vers ${cust.phone}...` : `Calling ${cust.phone}...`)
                }
                className="w-11 h-11 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B] flex items-center justify-center shrink-0"
                aria-label={isFr ? 'Appeler client' : 'Call buyer'}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomer(cust)}
                className="rounded-xl border border-[#E5E2F5] hover:bg-[#F5F5FA] px-3.5 py-2.5 text-xs font-bold text-[#5433FF] min-h-[42px]"
              >
                {isFr ? 'Historique ›' : 'History ›'}
              </button>
            </div>
          </article>
        ))
        )}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112B]/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#13112B]">
                {isFr ? 'Fiche Client' : 'Customer Profile'} · {selectedCustomer.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-[#F5F5FA] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl bg-[#F8F7FC] p-3.5 space-y-1.5 text-xs">
              <p>
                <strong>{isFr ? 'Téléphone :' : 'Phone:'}</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>{isFr ? 'Zone :' : 'Zone:'}</strong> {selectedCustomer.location}
              </p>
              <p>
                <strong>{isFr ? 'Dernier achat :' : 'Last purchase:'}</strong>{' '}
                {selectedCustomer.lastProduct}
              </p>
              <p>
                <strong>{isFr ? 'Total cumulé :' : 'Total spent:'}</strong>{' '}
                {formatFCFA(selectedCustomer.totalSpent)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCustomer(null);
                onNavigate('chat');
              }}
              className="w-full rounded-xl bg-[#5433FF] text-white py-3 text-xs font-bold"
            >
              {isFr ? 'Ouvrir la conversation' : 'Open Conversation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ReviewsPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  reviews: Review[];
  onReplyReview: (reviewId: string, text: string) => void;
  onThankReview: (reviewId: string) => void;
  onShowToast: (msg: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  lang,
  vendorMode,
  settings,
  reviews,
  onReplyReview,
  onThankReview,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [filter, setFilter] = useState<'Tous' | 'Avec photos' | '5 Étoiles'>('Tous');
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = reviews
    .filter((r) => {
      if (filter === 'Avec photos') return r.hasPhoto;
      if (filter === '5 Étoiles') return r.rating === 5;
      return true;
    })
    .map((r) => trReview(r, lang));

  const totalReviews = vendorMode === 'existing' ? Math.max(128, reviews.length) : reviews.length;
  const photosCount =
    vendorMode === 'existing' ? 42 : reviews.filter((r) => r.hasPhoto).length;
  const fiveStarCount =
    vendorMode === 'existing' ? 112 : reviews.filter((r) => r.rating === 5).length;
  const avgScore =
    vendorMode === 'existing'
      ? '4.9'
      : reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

  const distribution =
    vendorMode === 'existing'
      ? [
          { stars: 5, pct: 88 },
          { stars: 4, pct: 10 },
          { stars: 3, pct: 2 },
          { stars: 2, pct: 0 },
          { stars: 1, pct: 0 },
        ]
      : [5, 4, 3, 2, 1].map((stars) => ({
          stars,
          pct:
            reviews.length === 0
              ? 0
              : Math.round(
                  (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
                ),
        }));

  const filterTabs = [
    { key: 'Tous' as const, label: isFr ? `Tous (${totalReviews})` : `All (${totalReviews})` },
    {
      key: 'Avec photos' as const,
      label: isFr ? `Avec photos (${photosCount})` : `With photos (${photosCount})`,
    },
    {
      key: '5 Étoiles' as const,
      label: isFr ? `5 Étoiles (${fiveStarCount})` : `5 Stars (${fiveStarCount})`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#13112B]">
              {isFr ? 'Avis & Réputation' : 'Reviews & Reputation'}
            </h1>
            <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[11px] font-bold">
              {vendorMode === 'existing'
                ? 'Top 1%'
                : isFr
                  ? 'Nouvelle Boutique'
                  : 'New Store'}
            </span>
          </div>
          <p className="text-xs text-[#7C7998]">
            {isFr
              ? `${settings.shopName} · Fidélisation et retours clients`
              : `${settings.shopName} · Loyalty & buyer feedback`}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onShowToast(
              totalReviews > 0
                ? isFr
                  ? `Badge Vendeur ${avgScore}/5 copié !`
                  : `Seller ${avgScore}/5 badge copied!`
                : isFr
                  ? 'Lien d’invitation d’avis copié !'
                  : 'Review invite link copied!'
            )
          }
          className="w-10 h-10 rounded-full bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0"
          aria-label={isFr ? 'Partager réputation' : 'Share rating'}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Rating Summary Card */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#13112B] tabular-nums">
                {avgScore}
              </span>
              <span className="text-sm font-bold text-[#7C7998]">/5</span>
            </div>
            <div
              className={`mt-1 flex items-center gap-0.5 ${
                totalReviews > 0 ? 'text-[#F59E0B]' : 'text-[#CBD5E1]'
              }`}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-[#7C7998]">
              {isFr
                ? `${totalReviews} avis vérifiés`
                : `${totalReviews} verified reviews`}
            </p>
          </div>

          <div className="sm:col-span-8 space-y-1.5">
            {distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-2.5 text-xs">
                <span className="w-6 font-bold text-[#4B4869] flex items-center gap-0.5 tabular-nums">
                  {row.stars} <Star className="w-3 h-3 text-[#F59E0B] fill-current" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#F2F1FA] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5433FF]"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[#7C7998] font-semibold tabular-nums">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F7FC] px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#13112B]">
            {totalReviews > 0
              ? isFr
                ? 'Top Vendeur Recommandé'
                : 'Top Recommended Seller'
              : isFr
                ? 'Profil Boutique Vérifié MINI-B'
                : 'MINI-B Verified Storefront'}
          </span>
          <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 font-bold">
            {totalReviews > 0
              ? isFr
                ? '98% satisfaction'
                : '98% satisfaction'
              : isFr
                ? "En attente du 1er avis"
                : 'Awaiting 1st review'}
          </span>
        </div>
      </section>

      {/* Pro Tip */}
      <div className="rounded-2xl bg-[#F0EDFF] border border-[#E0D9FE] p-4 flex items-start gap-3">
        <Zap className="w-5 h-5 text-[#5433FF] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-extrabold text-[#13112B]">
            {isFr ? 'Conseil Pro Croissance' : 'Pro Growth Tip'}{' '}
            <span className="text-[#059669] ml-1">{isFr ? '+22% Ventes' : '+22% Sales'}</span>
          </p>
          <p className="text-xs text-[#4B4869] mt-0.5 leading-relaxed">
            {isFr
              ? 'Répondre aux avis dans les 2 heures renforce la confiance des nouveaux acheteurs et booste votre visibilité sur MINI-B.'
              : 'Replying to reviews within 2 hours builds buyer trust and boosts your storefront ranking on MINI-B.'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 min-h-[40px] ${
              filter === tab.key
                ? 'bg-[#5433FF] text-white'
                : 'bg-white border border-[#ECEAF6] text-[#4B4869]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-2">
            <Star className="w-9 h-9 text-[#5433FF]/50 mx-auto" />
            <p className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Aucun avis client pour le moment' : 'No customer reviews yet'}
            </p>
            <p className="text-xs text-[#7C7998] max-w-md mx-auto">
              {isFr
                ? 'Dès qu’un client reçoit sa commande, il reçoit un lien vérifié pour noter votre boutique.'
                : 'Once a buyer receives their order, they receive a verified link to rate your store.'}
            </p>
          </div>
        ) : (
          filtered.map((rev) => (
          <article key={rev.id} className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${
                  rev.reply ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF3C7] text-[#B45309]'
                }`}
              >
                {rev.reply
                  ? isFr
                    ? '✓ Répondu'
                    : '✓ Replied'
                  : isFr
                    ? '● En attente de réponse'
                    : '● Awaiting reply'}
              </span>
              <span className="text-xs text-[#7C7998]">{rev.timeAgo}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarBadge initials={rev.initials} tone="emerald" size="sm" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#13112B] truncate">{rev.customerName}</h3>
                  <p className="text-[11px] text-[#7C7998] truncate">{rev.verifiedLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-[#F59E0B] shrink-0">
                {Array.from({ length: rev.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#F8F7FC] px-3 py-2 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#13112B] truncate">{rev.productName}</span>
              <span className="font-bold text-[#5433FF] shrink-0 tabular-nums">
                {formatFCFA(rev.productPrice)}
              </span>
            </div>

            <p className="text-xs text-[#13112B] leading-relaxed">{rev.comment}</p>

            {rev.reply ? (
              <div className="rounded-2xl bg-[#F5F4FF] border border-[#E2DDFE] p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#5433FF]">
                    {isFr ? `Réponse de ${settings.shopName}` : `Reply from ${settings.shopName}`}
                  </span>
                  <span className="text-[#7C7998]">{rev.reply.timeAgo}</span>
                </div>
                <p className="text-xs text-[#13112B] leading-relaxed">{rev.reply.text}</p>
              </div>
            ) : replyOpenId === rev.id ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isFr
                      ? `Merci pour votre commande chez ${settings.shopName}...`
                      : `Thank you for shopping at ${settings.shopName}...`
                  }
                  className="w-full rounded-xl bg-[#F5F5FA] border border-[#D8D0FE] p-2.5 text-xs outline-none focus:border-[#5433FF]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!replyText.trim()) return;
                      onReplyReview(rev.id, replyText.trim());
                      setReplyOpenId(null);
                      setReplyText('');
                      onShowToast(isFr ? 'Réponse publique publiée !' : 'Public reply posted!');
                    }}
                    className="rounded-xl bg-[#5433FF] text-white px-4 py-2 text-xs font-bold"
                  >
                    {isFr ? 'Publier' : 'Post Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyOpenId(null)}
                    className="rounded-xl bg-[#F5F5FA] text-[#4B4869] px-3 py-2 text-xs font-bold"
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setReplyOpenId(rev.id);
                    setReplyText(
                      isFr
                        ? `Merci beaucoup ${rev.customerName.split(' ')[0]} ! Ravi que l'article vous plaise. À très bientôt sur MINI-B !`
                        : `Thank you ${rev.customerName.split(' ')[0]}! Glad you love your purchase. See you again soon on MINI-B!`
                    );
                  }}
                  className="flex-1 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-2.5 text-xs font-bold min-h-[42px]"
                >
                  {isFr ? 'Répondre à cet avis public' : 'Reply publicly'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onThankReview(rev.id);
                    onShowToast(
                      isFr ? 'Remerciement envoyé au client !' : 'Thank-you note sent to buyer!'
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] px-3.5 py-2.5 text-xs font-bold min-h-[42px]"
                >
                  <Heart className={`w-3.5 h-3.5 ${rev.thanked ? 'fill-current' : ''}`} />
                  <span>
                    {rev.thanked ? (isFr ? 'Remercié' : 'Thanked') : isFr ? 'Remercier' : 'Thank'}
                  </span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-[#7C7998] pt-1 border-t border-[#F1EFF9]">
              <span className="inline-flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> {isFr ? 'Utile' : 'Helpful'} ({rev.helpfulCount})
              </span>
              <span className="text-[#059669] font-semibold">
                {isFr ? 'Livraison Gozem vérifiée' : 'Verified Gozem Delivery'}
              </span>
            </div>
          </article>
        ))
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onShowToast(
            totalReviews > 0
              ? isFr
                ? 'Invitation WhatsApp/SMS envoyée aux 5 derniers acheteurs !'
                : 'WhatsApp/SMS review invite sent to your 5 latest buyers!'
              : isFr
                ? 'Lien d’invitation d’avis prêt à partager après votre 1ère vente !'
                : 'Review invite link ready to share after your 1st sale!'
          )
        }
        className="w-full rounded-2xl bg-white border border-[#D8D0FE] hover:bg-[#F5F4FF] text-[#5433FF] py-3.5 text-sm font-bold min-h-[48px]"
      >
        {isFr
          ? 'Inviter mes clients récents à laisser un avis'
          : 'Invite recent buyers to leave a review'}
      </button>
    </div>
  );
};

interface MarketingPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  productsCount: number;
  promos: PromoCode[];
  onTogglePromo: (id: string) => void;
  onAddPromo: (promo: PromoCode) => void;
  onShowToast: (msg: string) => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  lang,
  vendorMode,
  settings,
  productsCount,
  promos,
  onTogglePromo,
  onAddPromo,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [secondsLeft, setSecondsLeft] = useState(4 * 3600 + 28 * 60 + 9);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCode, setNewCode] = useState('COTONOU20');
  const [newDiscount, setNewDiscount] = useState('-20%');
  const [newDesc, setNewDesc] = useState(
    isFr
      ? 'Offre flash week-end sur accessoires & PC'
      : 'Weekend flash deal on accessories & laptops'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 4 * 3600 + 28 * 60 + 9));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const localizedPromos = promos.map((p) => trPromo(p, lang));

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onAddPromo({
      id: `promo-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountLabel: newDiscount,
      description: newDesc,
      target: 'Tous les clients Cotonou',
      expiresIn: 'Expire dans 48h',
      used: 0,
      maxUses: 50,
      active: true,
      type: 'discount',
    });
    setShowNewModal(false);
    onShowToast(
      isFr
        ? `Code promo ${newCode.toUpperCase()} créé !`
        : `Promo code ${newCode.toUpperCase()} created!`
    );
  };

  const storeSlug =
    settings.shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'ma-boutique';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#13112B]">
            {isFr ? 'Marketing & Croissance' : 'Marketing & Growth'}
          </h1>
          <p className="text-xs text-[#7C7998]">
            {isFr
              ? 'Attirez plus de clients et boostez vos ventes locales'
              : 'Attract more shoppers and grow your local sales'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold min-h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span>{isFr ? 'Créer' : 'Create'}</span>
        </button>
      </div>

      {/* Live Flash Sale Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] via-[#4D26E2] to-[#3715C9] text-white p-5 sm:p-6 space-y-4 shadow-lg shadow-[#5433FF]/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold">
            {isFr ? '● EN DIRECT · COTONOU' : '● LIVE · COTONOU'}
          </span>
          <span className="rounded-lg bg-[#10B981] px-2.5 py-1 text-[11px] font-bold">
            {vendorMode === 'existing' ? '↗ +38% Conv.' : isFr ? 'Nouvelle campagne' : 'New campaign'}
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold">
            {isFr ? 'Vente Flash Week-end Cotonou' : 'Cotonou Weekend Flash Sale'}
          </h2>
          <p className="text-xs text-white/85 mt-1">
            {productsCount === 0
              ? isFr
                ? 'Ajoutez des produits au catalogue pour activer votre première vente flash'
                : 'Add products to your catalog to launch your first flash sale'
              : isFr
                ? `${productsCount} article(s) du catalogue éligibles à la promotion express`
                : `${productsCount} catalog item(s) eligible for express promotion`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 tabular-nums font-mono">
            {[
              { val: hrs, label: isFr ? 'HEURES' : 'HOURS' },
              { val: mins, label: 'MINS' },
              { val: secs, label: 'SECS' },
            ].map((b, i) => (
              <React.Fragment key={b.label}>
                <div className="rounded-xl bg-white/15 border border-white/15 px-3 py-2 text-center min-w-[60px]">
                  <p className="text-xl font-extrabold">{b.val}</p>
                  <p className="text-[9px] text-white/75 font-sans font-bold">{b.label}</p>
                </div>
                {i < 2 && <span className="text-lg font-extrabold text-white/70">:</span>}
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onShowToast(
                productsCount === 0
                  ? isFr
                    ? 'Ajoutez un produit avant de lancer la vente flash.'
                    : 'Add a product first to launch a flash sale.'
                  : isFr
                    ? `${productsCount} article(s) en Vente Flash actifs sur MINI-B`
                    : `${productsCount} Flash Sale item(s) active on MINI-B`
              )
            }
            className="rounded-xl bg-white text-[#5433FF] hover:bg-[#F5F3FF] px-4 py-2.5 text-xs font-extrabold min-h-[42px]"
          >
            {isFr ? "Gérer l'offre →" : 'Manage Offer →'}
          </button>
        </div>
      </section>

      {/* Revenue + WhatsApp Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Recettes générées via promos' : 'Promo-driven Revenue'}
            </h2>
            <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 text-[11px] font-bold">
              {vendorMode === 'existing'
                ? isFr
                  ? '+24% ce mois'
                  : '+24% this month'
                : isFr
                  ? '0% ce mois'
                  : '0% this month'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-extrabold text-[#13112B] tabular-nums">
              {vendorMode === 'existing' ? '1 420 000' : '0'}{' '}
              <span className="text-xs font-bold text-[#5433FF]">FCFA</span>
            </p>
            <span className="text-xs text-[#7C7998]">
              {vendorMode === 'existing'
                ? isFr
                  ? '60 commandes soldées'
                  : '60 promo orders'
                : isFr
                  ? '0 commande soldée'
                  : '0 promo orders'}
            </span>
          </div>
          {vendorMode === 'existing' ? (
            <>
              <div className="w-full h-2 rounded-full overflow-hidden flex">
                <div className="bg-[#5433FF]" style={{ width: '62%' }} />
                <div className="bg-[#10B981]" style={{ width: '25%' }} />
                <div className="bg-[#F59E0B]" style={{ width: '13%' }} />
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-[#4B4869]">
                <span>● {isFr ? 'Vente Flash' : 'Flash Sale'} (62%)</span>
                <span>● Koffi2025 (25%)</span>
                <span>● Akpakpa (13%)</span>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="w-full h-2 rounded-full bg-[#F2F1FA]" />
              <p className="text-[11px] text-[#7C7998]">
                {isFr
                  ? 'Créez un code promo pour suivre son utilisation ici.'
                  : 'Create a promo code to track redemptions here.'}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Partage Réseaux & WhatsApp' : 'Social & WhatsApp Sharing'}
              </h2>
              <p className="text-xs text-[#7C7998]">
                {isFr ? 'Lien direct de commande Mobile Money' : 'Direct Mobile Money checkout link'}
              </p>
            </div>
            <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-1 text-[11px] font-bold">
              {isFr ? "Prêt à l'envoi" : 'Ready to share'}
            </span>
          </div>
          <p className="text-xs text-[#4B4869]">
            {isFr
              ? 'Générez une fiche promo illustrée intégrant vos liens directs MTN MoMo, Moov Money et Celtiis Cash en 1 clic.'
              : 'Generate an illustrated promo card with direct MTN MoMo, Moov Money, and Celtiis Cash checkout links in 1 click.'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                onShowToast(
                  isFr
                    ? 'Visuel Statut WhatsApp prêt à partager !'
                    : 'WhatsApp Status graphic ready to share!'
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] py-2.5 text-xs font-bold min-h-[42px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isFr ? 'Statut WhatsApp' : 'WhatsApp Status'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`https://mini-b.bj/${storeSlug}/promo`);
                onShowToast(
                  isFr
                    ? 'Lien boutique copié dans le presse-papiers !'
                    : 'Store promo link copied to clipboard!'
                );
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B] py-2.5 text-xs font-bold min-h-[42px]"
            >
              <Copy className="w-4 h-4" />
              <span>{isFr ? 'Copier Lien' : 'Copy Link'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Active Promo Codes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#13112B]">
            {isFr
              ? `Codes Promo & Réductions (${promos.filter((p) => p.active).length} actifs)`
              : `Promo Codes & Discounts (${promos.filter((p) => p.active).length} active)`}
          </h2>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="text-xs font-bold text-[#5433FF] hover:underline"
          >
            {isFr ? '+ Nouveau code' : '+ New code'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {localizedPromos.length === 0 ? (
            <div className="lg:col-span-3 rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-2.5">
              <p className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Aucun code promo créé' : 'No promo codes yet'}
              </p>
              <p className="text-xs text-[#7C7998]">
                {isFr
                  ? 'Créez un code de réduction pour vos premiers clients à Cotonou et Calavi.'
                  : 'Create a discount code to reward your first buyers in Cotonou & Calavi.'}
              </p>
              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5433FF] text-white px-4 py-2 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFr ? 'Créer mon 1er code promo' : 'Create my 1st promo code'}</span>
              </button>
            </div>
          ) : (
            localizedPromos.map((promo) => (
              <div key={promo.id} className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold font-mono text-[#13112B]">
                        {promo.code}
                      </span>
                      <span className="rounded-md bg-[#F0EDFF] text-[#5433FF] px-2 py-0.5 text-[11px] font-bold">
                        {promo.discountLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B4869] mt-1">{promo.description}</p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={promo.active}
                    onClick={() => onTogglePromo(promo.id)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                      promo.active ? 'bg-[#059669]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        promo.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#7C7998]">
                    <span>{isFr ? 'Utilisations' : 'Redemptions'}</span>
                    <span className="font-bold text-[#13112B] tabular-nums">
                      {promo.used} / {promo.maxUses} max
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F2F1FA] overflow-hidden">
                    <div
                      className="h-full bg-[#5433FF]"
                      style={{ width: `${Math.min(100, (promo.used / promo.maxUses) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#059669] font-semibold">
                    {isFr ? 'Cible' : 'Target'}: {promo.target}
                  </span>
                  <span className="text-[#B45309] font-semibold">{promo.expiresIn}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* New Promo Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112B]/50 p-4">
          <form
            onSubmit={handleCreatePromo}
            className="w-full max-w-md rounded-3xl bg-white p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#13112B]">
                {isFr ? 'Nouveau Code Promo' : 'New Promo Code'}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5FA] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">Code</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-mono font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">
                {isFr ? 'Réduction' : 'Discount'}
              </label>
              <input
                type="text"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#5433FF] text-white py-3 text-sm font-bold"
            >
              {isFr ? 'Activer le code promo' : 'Activate Promo Code'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
