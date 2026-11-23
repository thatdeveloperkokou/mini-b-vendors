import React, { useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck,
  Filter,
  MapPin,
  MessageSquare,
  Mic,
  PackageCheck,
  Paperclip,
  Phone,
  Play,
  Send,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { ChatMessage, Lang, Order, OrderStatus, PageId } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { trChat, trOrder, trOrderStatus, trOrderUrgency } from '../data/i18n';
import { AvatarBadge, CotonouMapPreview, HandoverQR, ProductVisual } from '../components/VisualAssets';

interface OrdersPageProps {
  lang: Lang;
  vendorMode?: 'existing' | 'new';
  orders: Order[];
  onNavigate: (page: PageId, contextId?: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onShowToast: (msg: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  lang,
  vendorMode = 'existing',
  orders,
  onNavigate,
  onUpdateOrderStatus,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'Tous'>('Nouveau');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const counts = {
    Nouveau: orders.filter((o) => o.status === 'Nouveau').length,
    'En cours': orders.filter((o) => o.status === 'En cours').length,
    Expédié: orders.filter((o) => o.status === 'Expédié').length,
    Livré: orders.filter((o) => o.status === 'Livré').length,
  };

  const dailyTotal =
    vendorMode === 'new' ? orders.reduce((sum, o) => sum + o.amount, 0) : 824000;
  const shippedTotal =
    vendorMode === 'new' ? counts.Expédié + counts.Livré : 12;

  const filtered = orders
    .filter((o) => {
      const matchTab = statusFilter === 'Tous' || o.status === statusFilter;
      const matchQuery =
        !searchQuery.trim() ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchQuery;
    })
    .map((o) => trOrder(o, lang));

  const tabLabels: Record<OrderStatus | 'Tous', string> = {
    Nouveau: isFr ? 'Nouveau' : 'New',
    'En cours': isFr ? 'En cours' : 'In Progress',
    Expédié: isFr ? 'Expédié' : 'Shipped',
    Livré: isFr ? 'Livré' : 'Delivered',
    Tous: isFr ? 'Tous' : 'All',
  };

  return (
    <div className="space-y-4">
      {/* Daily Overview Card */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B4869]">
            {isFr ? 'Aperçu Quotidien' : 'Daily Overview'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {isFr ? 'En direct' : 'Live'}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#13112B] tabular-nums">
              {dailyTotal.toLocaleString('fr-FR')}
            </span>
            <span className="text-sm font-bold text-[#5433FF]">FCFA</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#ECEAF6] px-3 py-1.5 text-xs font-semibold text-[#13112B]">
            <Truck className="w-4 h-4 text-[#5433FF]" />
            <span>
              {isFr
                ? `${shippedTotal} colis expédié${shippedTotal > 1 ? 's' : ''}`
                : `${shippedTotal} parcel${shippedTotal === 1 ? '' : 's'} shipped`}
            </span>
          </div>
        </div>
      </section>

      {/* Attention Banner */}
      {counts.Nouveau + counts['En cours'] > 0 && (
        <button
          type="button"
          onClick={() => setStatusFilter('Nouveau')}
          className="w-full rounded-2xl bg-[#F5EFE6] border border-[#EADBC8] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#EFE7DA] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8D5BA] text-[#78350F] flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Attention requise' : 'Action Required'}
              </p>
              <p className="text-xs text-[#5C4B3B]">
                {isFr
                  ? `${counts.Nouveau + counts['En cours']} commandes à valider avant 14:00`
                  : `${counts.Nouveau + counts['En cours']} orders to confirm before 2:00 PM`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#78350F] shrink-0" />
        </button>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['Nouveau', 'En cours', 'Expédié', 'Livré', 'Tous'] as const).map((tab) => {
          const active = statusFilter === tab;
          const badgeCount = tab === 'Tous' ? orders.length : counts[tab];
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                active
                  ? 'bg-[#5433FF] text-white shadow-xs'
                  : 'bg-white border border-[#ECEAF6] text-[#4B4869] hover:text-[#13112B]'
              }`}
            >
              <span>{tabLabels[tab]}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold tabular-nums ${
                  active ? 'bg-white/20 text-white' : 'bg-[#F2F1FA] text-[#5433FF]'
                }`}
              >
                {badgeCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Drawer */}
      {showFilters && (
        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-3.5 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isFr ? 'Filtrer par #MB, client ou produit...' : 'Filter by #MB, buyer or product...'
            }
            className="flex-1 min-w-[200px] rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2 text-xs font-medium text-[#13112B] outline-none focus:border-[#5433FF]"
          />
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('Tous');
            }}
            className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-2 text-xs font-bold"
          >
            {isFr ? 'Réinitialiser' : 'Reset'}
          </button>
        </div>
      )}

      {/* Orders Grid (2 columns on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-3">
            <PackageCheck className="w-10 h-10 text-[#5433FF] mx-auto" />
            <div>
              <p className="text-sm font-bold text-[#13112B]">
                {orders.length === 0
                  ? isFr
                    ? 'Aucune commande reçue pour le moment'
                    : 'No orders received yet'
                  : isFr
                    ? 'Aucune commande dans cette catégorie'
                    : 'No orders in this category'}
              </p>
              <p className="text-xs text-[#7C7998] mt-1 max-w-md mx-auto">
                {orders.length === 0
                  ? isFr
                    ? 'Dès qu’un acheteur paie par MTN MoMo, Moov Money ou Celtiis Cash, sa commande apparaît ici sous séquestre sécurisé.'
                    : 'As soon as a buyer pays via MTN MoMo, Moov Money, or Celtiis Cash, their escrow-protected order will appear here.'
                  : isFr
                    ? 'Sélectionnez « Tous » pour consulter l’historique complet.'
                    : 'Select "All" to view your complete order history.'}
              </p>
            </div>
            {orders.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold min-h-[42px]"
                >
                  {isFr ? 'Gérer mes produits' : 'Manage products'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('storefront')}
                  className="rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-4 py-2.5 text-xs font-bold min-h-[42px]"
                >
                  {isFr ? 'Partager ma vitrine' : 'Share storefront'}
                </button>
              </div>
            )}
          </div>
        ) : (
          filtered.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#13112B] font-mono">
                      {order.id}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        order.urgency === 'Urgent'
                          ? 'bg-[#F0EDFF] text-[#5433FF]'
                          : order.status === 'Expédié'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : 'bg-[#F5F5FA] text-[#4B4869]'
                      }`}
                    >
                      {order.status === 'Expédié'
                        ? trOrderStatus('Expédié', lang)
                        : trOrderUrgency(order.urgency, lang)}
                    </span>
                  </div>
                  <span className="text-xs text-[#7C7998] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {order.timeAgo}
                  </span>
                </div>

                {/* Customer Row */}
                <div className="rounded-2xl bg-[#F8F7FC] p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <AvatarBadge initials={order.customerInitials} tone="purple" size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#13112B] truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-[#7C7998] truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {order.customerLocation}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-1 text-[11px] font-bold">
                    {order.customerTag}
                  </span>
                </div>

                {/* Product Row */}
                <div className="flex items-center gap-3.5">
                  <ProductVisual type={order.visualType} className="w-16 h-14" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#13112B] truncate">
                      {order.productName}
                    </p>
                    <p className="text-xs text-[#7C7998] truncate mt-0.5">{order.productSpecs}</p>
                    <p className="text-sm font-extrabold text-[#5433FF] mt-1 tabular-nums">
                      {formatFCFA(order.amount)}
                    </p>
                  </div>
                </div>

                {/* Escrow & Rider Status */}
                <div className="rounded-2xl bg-[#F8F7FC] border border-[#ECEAF6] p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#13112B] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                      {isFr ? 'Séquestre MINI-B' : 'MINI-B Escrow'}
                    </span>
                    <span className="font-bold text-[#059669]">
                      {isFr ? 'Validé' : 'Verified'} {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[#4B4869]">
                    <span>
                      {order.riderId
                        ? `Gozem Express ${order.riderId}`
                        : isFr
                          ? "En attente d'expédition"
                          : 'Awaiting dispatch'}
                    </span>
                    <span className="font-semibold text-[#059669]">
                      {order.riderArrival || (isFr ? 'Payé (En ligne)' : 'Paid (Online)')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {order.status === 'Nouveau' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateOrderStatus(order.id, 'En cours');
                      onShowToast(
                        isFr
                          ? `Commande ${order.id} confirmée en préparation !`
                          : `Order ${order.id} confirmed for packing!`
                      );
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold transition-colors min-h-[44px]"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>{isFr ? 'Confirmer préparation' : 'Confirm Packing'}</span>
                  </button>
                )}
                {order.status === 'En cours' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('dispatch', order.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-4 py-2.5 text-xs font-bold transition-colors min-h-[44px]"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{isFr ? 'Assigner livreur' : 'Assign Rider'}</span>
                  </button>
                )}
                {(order.status === 'Expédié' || order.status === 'Livré') && (
                  <button
                    type="button"
                    onClick={() => onNavigate('dispatch', order.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B] px-4 py-2.5 text-xs font-bold transition-colors min-h-[44px]"
                  >
                    <span>{isFr ? 'Suivi & Bordereau' : 'Tracking & Slip'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('chat', order.id)}
                  className="w-11 h-11 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B] flex items-center justify-center transition-colors shrink-0"
                  aria-label={isFr ? 'Ouvrir la discussion client' : 'Open customer chat'}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dispatch', order.id)}
                  className="rounded-xl border border-[#E5E2F5] hover:bg-[#F5F5FA] px-3.5 py-2.5 text-xs font-bold text-[#13112B] min-h-[44px]"
                >
                  {isFr ? 'Détails' : 'Details'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-[#ECEAF6] px-5 py-2.5 text-xs font-bold text-[#13112B] hover:bg-[#F8F7FC] transition-colors min-h-[44px]"
        >
          <Filter className="w-3.5 h-3.5 text-[#5433FF]" />
          <span>
            {showFilters
              ? isFr
                ? 'Masquer les filtres'
                : 'Hide filters'
              : isFr
                ? 'Filtres avancés & archives'
                : 'Advanced filters & archive'}
          </span>
        </button>
      </div>
    </div>
  );
};

interface DispatchPageProps {
  lang: Lang;
  order?: Order;
  onConfirmHandover: (orderId: string) => void;
  onNavigate: (page: PageId, contextId?: string) => void;
  onShowToast: (msg: string) => void;
}

export const DispatchPage: React.FC<DispatchPageProps> = ({
  lang,
  order: rawOrder,
  onConfirmHandover,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [checks, setChecks] = useState([true, true, true]);
  const completedCount = checks.filter(Boolean).length;

  if (!rawOrder) {
    return (
      <div className="rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[#13112B]">
            {isFr ? 'Aucune expédition en cours' : 'No active dispatch'}
          </h1>
          <p className="text-xs text-[#7C7998] mt-1 max-w-md mx-auto">
            {isFr
              ? 'Lorsqu’une commande est confirmée, vous pourrez assigner un livreur Gozem Zem et générer son QR de remise ici.'
              : 'Once an order is confirmed, you can assign a Gozem Zem rider and generate a handover QR code here.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#5433FF] text-white px-5 py-2.5 text-xs font-bold min-h-[42px]"
        >
          {isFr ? 'Voir les commandes' : 'View Orders'}
        </button>
      </div>
    );
  }

  const order = trOrder(rawOrder, lang);

  const toggleCheck = (idx: number) => {
    setChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const checklistItems = isFr
    ? [
        {
          title: 'Vérifier la facture e-MECeF dans le colis',
          subtitle: 'Obligation fiscale DGI Bénin normalisée insérée avec le numéro NIM.',
          tag: 'VALIDÉ',
        },
        {
          title: 'Sceller avec le ruban adhésif de sécurité MINI-B',
          subtitle: 'Carton scellé & sticker anti-effraction appliqué sans ouverture.',
          tag: 'VÉRIFIÉ',
        },
        {
          title: 'Prendre la photo du colis scellé + chargeur 65W',
          subtitle: 'Preuve horodatée requise en cas de litige de transport.',
          tag: 'INCLUS',
        },
      ]
    : [
        {
          title: 'Verify e-MECeF tax invoice inside parcel',
          subtitle: 'Standardized Benin DGI fiscal invoice included with NIM number.',
          tag: 'VERIFIED',
        },
        {
          title: 'Seal parcel with MINI-B security tape',
          subtitle: 'Box sealed & tamper-evident sticker applied cleanly.',
          tag: 'CHECKED',
        },
        {
          title: 'Take photo of sealed parcel + 65W charger',
          subtitle: 'Timestamped proof required in case of transit dispute.',
          tag: 'INCLUDED',
        },
      ];

  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#13112B] font-mono">{order.id}</h1>
              <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[11px] font-bold">
                {isFr
                  ? `SÉQUESTRE ${order.paymentMethod.toUpperCase()} PAYÉ`
                  : `${order.paymentMethod.toUpperCase()} ESCROW PAID`}
              </span>
            </div>
            <p className="text-xs text-[#7C7998] mt-1">
              {order.productName} · {order.productSpecs}
            </p>
            <p className="text-xs font-semibold text-[#13112B] mt-1">
              {isFr ? 'Client' : 'Buyer'}: {order.customerName} · {order.customerLocation}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-[#5433FF] tabular-nums">
              {formatFCFA(order.amount)}
            </p>
            <span className="inline-block mt-1 rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-0.5 text-[11px] font-bold uppercase">
              {trOrderStatus(order.status, lang)}
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-[#F2FBF7] border border-[#CBEEDF] px-3.5 py-2.5 text-xs text-[#065F46] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>
            {isFr
              ? 'Fonds garantis sous séquestre MINI-B Pay jusqu’à confirmation client ou scan livreur.'
              : 'Funds secured under MINI-B Pay escrow until buyer confirmation or rider QR scan.'}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Packing Protocol Checklist */}
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Protocole de Remise Sécurisée' : 'Secure Handover Protocol'}
            </h2>
            <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 text-xs font-bold tabular-nums">
              {completedCount}/3 {isFr ? 'Prêts' : 'Ready'}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#F2F1FA] overflow-hidden">
            <div
              className="h-full bg-[#5433FF] transition-all duration-200"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>

          <div className="space-y-2.5 pt-1">
            {checklistItems.map((item, idx) => {
              const checked = checks[idx];
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => toggleCheck(idx)}
                  className={`w-full text-left rounded-2xl border p-3.5 flex items-start gap-3 transition-colors ${
                    checked
                      ? 'bg-[#F8F7FC] border-[#D8D0FE]'
                      : 'bg-white border-[#ECEAF6] hover:bg-[#F9F8FE]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      checked
                        ? 'bg-[#10B981] text-white'
                        : 'border-2 border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {checked && <Check className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#13112B]">{item.title}</p>
                      <span className="text-[10px] font-bold text-[#059669] shrink-0">
                        {checked ? item.tag : isFr ? 'À FAIRE' : 'TODO'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7C7998] mt-1">{item.subtitle}</p>
                  </div>
                  {idx === 2 && <Camera className="w-4 h-4 text-[#5433FF] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Assigned Rider + Live Map + Handover PIN */}
        <div className="space-y-4">
          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Livreur Assigné' : 'Assigned Rider'}
              </h2>
              <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-1 text-xs font-bold">
                Gozem Moto {order.riderId || '#GZ-24'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarBadge initials="KB" tone="amber" online size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#13112B] truncate">
                    {order.riderName || 'Koffi Bienvenu'}{' '}
                    <span className="text-[#7C7998] font-medium">· 4.9★</span>
                  </p>
                  <p className="text-xs text-[#4B4869] truncate">
                    {isFr
                      ? 'Moto Boxer (Zem) · BJ-884-AC · 412 courses'
                      : 'Boxer Bike (Zem) · BJ-884-AC · 412 rides'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onShowToast(
                      isFr
                        ? 'Appel vers le livreur Gozem +229 96 11 22 33...'
                        : 'Calling Gozem rider +229 96 11 22 33...'
                    )
                  }
                  className="w-11 h-11 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center"
                  aria-label={isFr ? 'Appeler livreur' : 'Call rider'}
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('chat', order.id)}
                  className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center"
                  aria-label={isFr ? 'WhatsApp livreur' : 'WhatsApp rider'}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            <CotonouMapPreview lang={lang} />
          </section>

          {/* Purple Handover PIN Card */}
          <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] to-[#3715C9] text-white p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/85 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                {isFr ? 'Code Secret de Remise' : 'Handover Secret PIN'}
              </span>
              <span className="rounded-lg bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold">
                {isFr ? 'Sécurisation MINI-B' : 'MINI-B Security'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {order.handoverPin.split('').map((digit, i) => (
                  <div
                    key={i}
                    className="w-11 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl font-extrabold font-mono tabular-nums"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <HandoverQR code={order.handoverPin} />
            </div>

            <p className="text-xs text-white/85 leading-relaxed">
              {isFr ? (
                <>
                  Transmettez ce code à <strong>{order.riderName || 'Koffi Bienvenu'}</strong> ou
                  faites-lui scanner le QR au moment de la remise du colis scellé.
                </>
              ) : (
                <>
                  Share this PIN with <strong>{order.riderName || 'Koffi Bienvenu'}</strong> or have
                  them scan the QR code upon parcel handover.
                </>
              )}
            </p>
          </section>
        </div>
      </div>

      {/* Bottom Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={completedCount < 3 || order.status === 'Expédié' || order.status === 'Livré'}
          onClick={() => {
            onConfirmHandover(order.id);
            onShowToast(
              isFr
                ? `Remise au livreur confirmée pour ${order.id} !`
                : `Rider handover confirmed for ${order.id}!`
            );
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] disabled:opacity-50 text-white px-5 py-3.5 text-sm font-bold transition-colors min-h-[48px]"
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>
            {order.status === 'Expédié' || order.status === 'Livré'
              ? isFr
                ? 'Colis déjà remis au livreur ✓'
                : 'Parcel handed over to rider ✓'
              : isFr
                ? 'Confirmer la remise au livreur Gozem'
                : 'Confirm Gozem Rider Handover'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            const content = isFr
              ? `BORDEREAU MINI-B\nCommande: ${order.id}\nClient: ${order.customerName} (${order.customerLocation})\nProduit: ${order.productName}\nMontant: ${formatFCFA(order.amount)}\nPIN Remise: ${order.handoverPin}`
              : `MINI-B SHIPPING SLIP\nOrder: ${order.id}\nBuyer: ${order.customerName} (${order.customerLocation})\nProduct: ${order.productName}\nAmount: ${formatFCFA(order.amount)}\nHandover PIN: ${order.handoverPin}`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${isFr ? 'bordereau' : 'shipping-slip'}-${order.id.replace('#', '')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            onShowToast(isFr ? 'Bordereau d’envoi téléchargé !' : 'Shipping slip downloaded!');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#E5E2F5] hover:bg-[#F5F5FA] text-[#5433FF] px-5 py-3.5 text-sm font-bold transition-colors min-h-[48px]"
        >
          <Download className="w-4 h-4" />
          <span>{isFr ? 'Télécharger le bordereau (QR)' : 'Download Shipping Slip (QR)'}</span>
        </button>
      </div>
    </div>
  );
};

interface ChatPageProps {
  lang: Lang;
  order?: Order;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onNavigate: (page: PageId, contextId?: string) => void;
  onShowToast: (msg: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  lang,
  order: rawOrder,
  messages,
  onSendMessage,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [draft, setDraft] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!rawOrder) {
    return (
      <div className="rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#047857] flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-[#13112B]">
            {isFr ? 'Aucune conversation client active' : 'No active buyer chats'}
          </h1>
          <p className="text-xs text-[#7C7998] mt-1 max-w-md mx-auto">
            {isFr
              ? 'Vos échanges directs avec les acheteurs et vos notifications WhatsApp apparaîtront ici dès votre première commande.'
              : 'Direct buyer conversations and WhatsApp updates will appear here once you receive your first order.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('storefront')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#5433FF] text-white px-5 py-2.5 text-xs font-bold min-h-[42px]"
        >
          {isFr ? 'Partager ma vitrine' : 'Share my storefront'}
        </button>
      </div>
    );
  }

  const order = trOrder(rawOrder, lang);
  const localizedMessages = messages.map((m) => trChat(m, lang));

  const quickReplies = isFr
    ? ['Facture e-MECeF jointe', 'Colis remis au livreur', 'En cours de préparation']
    : ['e-MECeF invoice attached', 'Handed over to rider', 'Currently packing'];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  return (
    <div className="space-y-4">
      {/* Customer & Pinned Order Header */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarBadge initials={order.customerInitials} tone="amber" online size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-[#13112B] truncate">
                  {order.customerName}
                </h1>
                <span className="rounded-md bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" /> {isFr ? 'VIP OR' : 'GOLD VIP'}
                </span>
              </div>
              <p className="text-xs text-[#7C7998] truncate">
                {order.customerLocation} · {isFr ? 'En ligne' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                onShowToast(
                  isFr ? 'Ouverture du fil WhatsApp Business...' : 'Opening WhatsApp Business thread...'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EB958] text-white px-3 py-2 text-xs font-bold min-h-[40px]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onShowToast(
                  isFr ? `Appel vers ${order.customerName}...` : `Calling ${order.customerName}...`
                )
              }
              className="w-10 h-10 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#13112B] flex items-center justify-center"
              aria-label={isFr ? 'Appeler' : 'Call'}
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('dispatch', order.id)}
          className="w-full rounded-2xl bg-[#F5F4FF] border border-[#E2DDFE] p-3 flex items-center justify-between gap-3 text-left hover:bg-[#ECEAFF] transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <ProductVisual type={order.visualType} className="w-12 h-11" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#13112B] truncate">
                <span className="text-[#5433FF] font-mono mr-1.5">{order.id}</span>
                {order.productName}
              </p>
              <p className="text-[11px] text-[#4B4869] truncate">
                {formatFCFA(order.amount)} · {isFr ? 'Séquestre' : 'Escrow'} {order.paymentMethod}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#5433FF] shrink-0">
            {isFr ? 'Détails ›' : 'Details ›'}
          </span>
        </button>
      </section>

      {/* Escrow Notice */}
      <div className="rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] px-4 py-2.5 text-xs font-medium text-[#065F46] flex items-center justify-center gap-2 text-center">
        <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
        <span>
          {isFr
            ? `Commande payée via ${order.paymentMethod}. Fonds sous séquestre MINI-B sécurisés.`
            : `Order paid via ${order.paymentMethod}. Funds secured in MINI-B Escrow.`}
        </span>
      </div>

      {/* Message Stream */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-4">
        <div className="text-center">
          <span className="rounded-full bg-[#F5F5FA] px-3 py-1 text-[11px] font-semibold text-[#7C7998]">
            {isFr ? "Aujourd'hui · 13:40" : 'Today · 13:40'}
          </span>
        </div>

        <div className="space-y-3.5">
          {localizedMessages.map((msg) => {
            if (msg.sender === 'buyer') {
              return (
                <div key={msg.id} className="flex items-end gap-2.5 max-w-[88%] sm:max-w-[75%]">
                  <AvatarBadge initials={order.customerInitials} tone="amber" size="sm" />
                  <div className="rounded-2xl rounded-bl-sm bg-[#F5F5FA] border border-[#ECEAF6] px-4 py-3">
                    {msg.voiceDuration ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPlayingId(playingId === msg.id ? null : msg.id)
                            }
                            className="w-9 h-9 rounded-full bg-[#5433FF] text-white flex items-center justify-center shrink-0"
                            aria-label={isFr ? 'Écouter le message vocal' : 'Play voice note'}
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                          <div className="flex items-center gap-1 h-6">
                            {[10, 18, 24, 14, 22, 16, 20, 12, 16, 10].map((h, idx) => (
                              <span
                                key={idx}
                                className={`w-1 rounded-full transition-colors ${
                                  playingId === msg.id ? 'bg-[#5433FF]' : 'bg-[#A5A0C8]'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-mono font-bold text-[#4B4869]">
                            {msg.voiceDuration}
                          </span>
                        </div>
                        <p className="text-xs italic text-[#4B4869]">{msg.voiceTranscript}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-[#13112B] leading-relaxed">{msg.text}</p>
                    )}
                    <p className="mt-1 text-[10px] text-[#7C7998]">{msg.time}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col items-end">
                {msg.attachmentTitle ? (
                  <div className="max-w-[80%] sm:max-w-[65%] rounded-2xl bg-[#F0EDFF] border border-[#D8D0FE] p-3">
                    <div className="rounded-xl bg-white p-3 flex items-center gap-3">
                      <ProductVisual type={order.visualType} className="w-12 h-12" />
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#13112B] text-white px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-[#34D399]" />{' '}
                          {isFr ? 'Colis préparé & scellé' : 'Parcel packed & sealed'}
                        </span>
                        <p className="text-xs font-semibold text-[#4B4869] mt-1">
                          {msg.attachmentTitle}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[#5433FF] font-semibold text-right">
                      {msg.text} · {msg.time} ✓✓
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[85%] sm:max-w-[72%] rounded-2xl rounded-br-sm bg-[#5433FF] text-white px-4 py-3 shadow-xs">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="mt-1 text-[10px] text-white/75 text-right">{msg.time} ✓✓</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rider Assigned Status Pill */}
        <div className="rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#065F46] font-semibold">
            <Truck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              {isFr
                ? 'Livreur Gozem assigné (#GZ-24) · Arrivée estimée 13h45'
                : 'Gozem rider assigned (#GZ-24) · ETA 1:45 PM'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('dispatch', order.id)}
            className="font-bold text-[#059669] hover:underline shrink-0"
          >
            {isFr ? 'Suivre' : 'Track'}
          </button>
        </div>

        {/* Quick Reply Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onSendMessage(reply)}
              className="rounded-xl bg-[#F5F5FA] hover:bg-[#F0EDFF] border border-[#ECEAF6] hover:border-[#5433FF]/30 px-3 py-2 text-xs font-semibold text-[#13112B] whitespace-nowrap shrink-0 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              onShowToast(
                isFr
                  ? 'Sélection de pièce jointe prête (PDF / Photo)'
                  : 'Attachment picker ready (PDF / Photo)'
              )
            }
            className="w-11 h-11 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#4B4869] flex items-center justify-center shrink-0"
            aria-label={isFr ? 'Joindre un fichier' : 'Attach file'}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              isFr
                ? `Écrire un message à ${order.customerName.split(' ')[0]}...`
                : `Message ${order.customerName.split(' ')[0]}...`
            }
            className="flex-1 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-4 py-2.5 text-sm text-[#13112B] outline-none focus:border-[#5433FF] min-h-[44px]"
          />
          <button
            type="button"
            onClick={() =>
              onShowToast(
                isFr ? 'Maintenez pour enregistrer un mémo vocal' : 'Hold to record a voice note'
              )
            }
            className="w-11 h-11 rounded-xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#4B4869] hidden sm:flex items-center justify-center shrink-0"
            aria-label={isFr ? 'Message vocal' : 'Voice message'}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white flex items-center justify-center shrink-0 transition-colors"
            aria-label={isFr ? 'Envoyer' : 'Send'}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </div>
  );
};
