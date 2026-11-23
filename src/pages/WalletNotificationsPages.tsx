import React, { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Lock,
  MessageSquare,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import { Lang, NotificationItem, PageId, Transaction } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { trNotification, trSeed, trTransaction } from '../data/i18n';
import { ProductVisual } from '../components/VisualAssets';

interface WalletPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  balance: number;
  escrowBalance: number;
  transactions: Transaction[];
  defaultPhone?: string;
  shopName?: string;
  onWithdraw: (amount: number, provider: 'MTN MoMo' | 'Moov' | 'Celtiis Cash', phone: string) => void;
  onShowToast: (msg: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  lang,
  vendorMode,
  balance,
  escrowBalance,
  transactions,
  defaultPhone,
  shopName,
  onWithdraw,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [hideBalance, setHideBalance] = useState(false);
  const [provider, setProvider] = useState<'MTN MoMo' | 'Moov' | 'Celtiis Cash'>('MTN MoMo');
  const [phone, setPhone] = useState(defaultPhone || '+229 97 00 12 12');
  const [editingPhone, setEditingPhone] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(Math.min(50000, balance || 0));
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  useEffect(() => {
    if (defaultPhone) setPhone(defaultPhone);
  }, [defaultPhone]);

  const localizedTransactions = transactions.map((t) => trTransaction(t, lang));
  const monthlyEarnings =
    vendorMode === 'existing'
      ? 4280000
      : transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > balance) {
      onShowToast(
        isFr
          ? 'Montant invalide ou supérieur au solde disponible'
          : 'Invalid amount or exceeds available balance'
      );
      return;
    }
    onWithdraw(withdrawAmount, provider, phone);
    setShowWithdrawForm(false);
  };

  const exportStatement = (format: 'CSV' | 'PDF') => {
    if (format === 'CSV') {
      const slug = (shopName || 'minib')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const headers = isFr
        ? ['ID', 'Titre', 'Détail', 'Date', 'Montant (FCFA)', 'Statut']
        : ['ID', 'Title', 'Details', 'Date', 'Amount (FCFA)', 'Status'];
      const rows = [
        headers.join(','),
        ...localizedTransactions.map((t) =>
          [t.id, `"${t.title}"`, `"${t.subtitle}"`, `"${t.date}"`, t.amount, trSeed(t.status, lang)].join(',')
        ),
      ].join('\n');
      const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = isFr ? `releve-minib-${slug}.csv` : `statement-minib-${slug}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast(isFr ? 'Relevé Excel / CSV exporté !' : 'Excel / CSV statement exported!');
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Escrow Banner */}
      <div className="rounded-2xl bg-[#F0EDFF] border border-[#DFD8F5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs font-semibold text-[#5433FF]">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {isFr
            ? 'Paiements 100% sécurisés par MINI-B Escrow'
            : 'Payments 100% secured by MINI-B Escrow'}
        </span>
        <ShieldCheck className="w-4 h-4 shrink-0 opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Royal Purple Wallet Card */}
        <section className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#5B3BFF] via-[#4D26E2] to-[#3715C9] text-white p-5 sm:p-6 shadow-lg shadow-[#5433FF]/20 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/85 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {isFr ? 'Portefeuille Vendeur' : 'Vendor Wallet'}
            </span>
            <button
              type="button"
              onClick={() => setHideBalance((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              {hideBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>
                {hideBalance ? (isFr ? 'Afficher' : 'Show') : isFr ? 'Masquer' : 'Hide'}
              </span>
            </button>
          </div>

          <div>
            <p className="text-xs text-white/80">
              {isFr ? 'Solde disponible' : 'Available balance'}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums">
                {hideBalance ? '••• •••' : balance.toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-bold text-[#34D399]">FCFA</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/12 border border-white/15 p-3">
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <Lock className="w-3 h-3" /> {isFr ? 'En séquestre' : 'In Escrow'}
              </p>
              <p className="mt-1 text-base font-extrabold tabular-nums font-mono">
                {hideBalance ? '••• •••' : formatFCFA(escrowBalance)}
              </p>
              <p className="text-[10px] text-white/75 mt-0.5">
                {isFr ? 'Déblocage après livraison' : 'Released upon delivery'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/12 border border-white/15 p-3">
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#34D399]" />{' '}
                {isFr ? 'Gains ce mois' : 'Monthly Earnings'}
              </p>
              <p className="mt-1 text-base font-extrabold tabular-nums font-mono text-[#34D399]">
                {hideBalance ? '••• •••' : formatFCFA(monthlyEarnings)}
              </p>
              <p className="text-[10px] text-[#A7F3D0] mt-0.5">
                {vendorMode === 'existing'
                  ? isFr
                    ? '+24% vs mois passé'
                    : '+24% vs last month'
                  : monthlyEarnings === 0
                    ? isFr
                      ? 'Démarre dès la 1ère vente'
                      : 'Starts with 1st sale'
                    : isFr
                      ? 'Encaissements en cours'
                      : 'Active earnings'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              {isFr ? 'Statut compte:' : 'Account status:'}{' '}
              <strong>{isFr ? 'Actif & Vérifié' : 'Active & Verified'}</strong>
            </span>
            <svg width="72" height="20" viewBox="0 0 72 20" fill="none">
              <path
                d="M2 16 L16 11 L28 14 L42 7 L56 10 L70 3"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>

        {/* Instant Mobile Money Withdrawal */}
        <section className="lg:col-span-6 rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-[#13112B] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#5433FF]" />
              {isFr ? 'Retrait Instantané' : 'Instant Withdrawal'}
            </h2>
            <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-1 text-[11px] font-bold">
              {isFr ? 'Frais 0%' : '0% Fee'}
            </span>
          </div>

          <p className="text-xs text-[#4B4869]">
            {isFr
              ? 'Choisissez votre compte Mobile Money au Bénin pour un décaissement sans délai.'
              : 'Select your Benin Mobile Money account for instant, zero-delay settlement.'}
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                { id: 'MTN MoMo', badge: 'm', tone: 'bg-[#FDE68A] text-[#92400E]' },
                { id: 'Moov', badge: 'mv', tone: 'bg-[#DBEAFE] text-[#1D4ED8]' },
                { id: 'Celtiis Cash', badge: 'cc', tone: 'bg-[#D1FAE5] text-[#047857]' },
              ] as const
            ).map((opt) => {
              const selected = provider === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setProvider(opt.id)}
                  className={`rounded-2xl border p-3 flex flex-col items-center gap-2 transition-colors ${
                    selected
                      ? 'bg-[#F5F4FF] border-[#5433FF]'
                      : 'bg-[#F8F7FC] border-[#ECEAF6] hover:border-[#D8D0FE]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full font-extrabold text-sm flex items-center justify-center ${opt.tone}`}
                  >
                    {opt.badge === 'm' ? 'm' : opt.badge === 'mv' ? '⇄' : '⚡'}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#13112B]">{opt.id}</p>
                    <p className="text-[10px] font-semibold text-[#059669]">
                      {isFr ? 'Instantané' : 'Instant'}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selected ? 'bg-[#5433FF] text-white' : 'bg-[#E5E2F5]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Phone Line */}
          <div className="rounded-2xl bg-[#F8F7FC] border border-[#ECEAF6] px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Smartphone className="w-4 h-4 text-[#5433FF] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#7C7998] font-medium">
                  {isFr ? 'Ligne de réception' : 'Receiving line'}
                </p>
                {editingPhone ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white rounded-lg border border-[#5433FF] px-2 py-1 text-xs font-bold text-[#13112B] outline-none"
                  />
                ) : (
                  <p className="text-xs font-bold text-[#13112B] truncate">
                    {provider} ({phone})
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingPhone((v) => !v)}
              className="text-xs font-bold text-[#5433FF] hover:underline shrink-0"
            >
              {editingPhone ? 'OK' : isFr ? 'Modifier' : 'Edit'}
            </button>
          </div>

          {showWithdrawForm ? (
            <form
              onSubmit={handleConfirmWithdraw}
              className="space-y-3 rounded-2xl bg-[#F5F4FF] p-3.5 border border-[#D8D0FE]"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#13112B]">
                  {isFr ? 'Montant à retirer (FCFA)' : 'Amount to withdraw (FCFA)'}
                </label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(balance)}
                  className="text-[11px] font-bold text-[#5433FF] hover:underline"
                >
                  Max ({formatFCFA(balance, 'F')})
                </button>
              </div>
              <input
                type="number"
                min={1000}
                max={balance}
                step={500}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full rounded-xl bg-white border border-[#D8D0FE] px-3.5 py-2.5 text-base font-extrabold text-[#13112B] tabular-nums outline-none focus:border-[#5433FF]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-2.5 text-xs font-bold min-h-[42px]"
                >
                  {isFr ? 'Confirmer' : 'Confirm'} {formatFCFA(withdrawAmount)}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="rounded-xl bg-white border border-[#E5E2F5] px-4 py-2.5 text-xs font-bold text-[#4B4869]"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (balance <= 0) {
                  onShowToast(
                    isFr
                      ? 'Solde disponible à 0 FCFA — effectuez une vente pour retirer.'
                      : 'Available balance is 0 FCFA — complete a sale before withdrawing.'
                  );
                  return;
                }
                setWithdrawAmount(Math.min(50000, balance));
                setShowWithdrawForm(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold transition-colors min-h-[48px]"
            >
              <Send className="w-4 h-4" />
              <span>{isFr ? 'Retirer vers Mobile Money' : 'Withdraw to Mobile Money'}</span>
            </button>
          )}
        </section>
      </div>

      {/* Recent Transactions */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-[#13112B]">
            {isFr ? 'Transactions récentes' : 'Recent Transactions'}{' '}
            <span className="ml-1 rounded-full bg-[#F2F1FA] px-2 py-0.5 text-[11px] text-[#5433FF] tabular-nums">
              {transactions.length}
            </span>
          </h2>
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => exportStatement('CSV')}
              className="text-xs font-bold text-[#5433FF] hover:underline"
            >
              {isFr ? 'Voir tout ›' : 'Export all ›'}
            </button>
          )}
        </div>

        <div className="divide-y divide-[#F1EFF9]">
          {localizedTransactions.length === 0 ? (
            <div className="py-8 text-center space-y-1.5">
              <Wallet className="w-8 h-8 text-[#5433FF]/50 mx-auto" />
              <p className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Aucune transaction pour le moment' : 'No transactions yet'}
              </p>
              <p className="text-xs text-[#7C7998] max-w-md mx-auto">
                {isFr
                  ? 'Vos paiements clients protégés par séquestre et vos retraits Mobile Money s’afficheront ici.'
                  : 'Your escrow-protected buyer payments and Mobile Money payouts will appear here.'}
              </p>
            </div>
          ) : (
            localizedTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {tx.visualType ? (
                    <ProductVisual type={tx.visualType} className="w-11 h-11" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#92400E] font-extrabold text-sm flex items-center justify-center shrink-0">
                      {tx.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#13112B] truncate">{tx.title}</p>
                    <p className="text-xs text-[#7C7998] truncate">{tx.subtitle}</p>
                    <p className="text-[11px] text-[#7C7998]">{tx.date}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-extrabold tabular-nums ${
                      tx.amount > 0
                        ? tx.status === 'EN SÉQUESTRE'
                          ? 'text-[#D97706]'
                          : 'text-[#059669]'
                        : 'text-[#13112B]'
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatFCFA(tx.amount)}` : formatFCFA(tx.amount)}
                  </p>
                  <span
                    className={`inline-block mt-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      tx.status === 'DÉBLOQUÉ' || tx.status === 'SUCCÈS'
                        ? 'bg-[#ECFDF5] text-[#059669]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {trSeed(tx.status, lang)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Account Statement Export */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#13112B]">
            {isFr ? 'Relevé de compte' : 'Account Statement'}
          </h3>
          <p className="text-xs text-[#7C7998]">
            {isFr
              ? 'Exportez vos écritures financières certifiées'
              : 'Export your certified financial ledger'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportStatement('PDF')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] px-3.5 py-2 text-xs font-bold min-h-[40px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            onClick={() => exportStatement('CSV')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] px-3.5 py-2 text-xs font-bold min-h-[40px]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </section>
    </div>
  );
};

interface NotificationsPageProps {
  lang: Lang;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onResolveSecurity: (id: string, decision: 'trusted' | 'blocked') => void;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  lang,
  notifications,
  onMarkAllRead,
  onResolveSecurity,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [tab, setTab] = useState<'Toutes' | 'Commandes' | 'Finances' | 'Sécurité'>('Toutes');
  const [waAlerts, setWaAlerts] = useState(true);

  const filtered = notifications
    .filter((n) => {
      if (tab === 'Toutes') return true;
      if (tab === 'Sécurité') return n.category === 'Sécurité' || n.category === 'Stock';
      return n.category === tab;
    })
    .map((n) => trNotification(n, lang));

  const todayList = filtered.filter((n) => n.group === 'today');
  const yesterdayList = filtered.filter((n) => n.group === 'yesterday');
  const unreadCount = notifications.filter((n) => n.unread).length;

  const filterTabs = [
    { id: 'Toutes' as const, label: isFr ? 'Toutes' : 'All', count: notifications.length },
    {
      id: 'Commandes' as const,
      label: isFr ? 'Commandes' : 'Orders',
      count: notifications.filter((n) => n.category === 'Commandes').length,
    },
    {
      id: 'Finances' as const,
      label: isFr ? 'Finances' : 'Finance',
      count: notifications.filter((n) => n.category === 'Finances').length,
    },
    {
      id: 'Sécurité' as const,
      label: isFr ? 'Sécurité' : 'Security',
      count: notifications.filter((n) => n.category === 'Sécurité' || n.category === 'Stock').length,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#13112B]">Notifications</h1>
          <p className="text-xs text-[#7C7998]">
            {isFr ? 'Restez informé en temps réel' : 'Stay updated in real time'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onMarkAllRead();
            onShowToast(
              isFr
                ? 'Toutes les notifications marquées comme lues'
                : 'All notifications marked as read'
            );
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-3.5 py-2 text-xs font-bold min-h-[40px]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Tout marquer comme lu' : 'Mark all as read'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterTabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 min-h-[40px] ${
                active
                  ? 'bg-[#5433FF] text-white'
                  : 'bg-white border border-[#ECEAF6] text-[#4B4869]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold tabular-nums ${
                  active ? 'bg-white/20 text-white' : 'bg-[#F2F1FA] text-[#5433FF]'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {todayList.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C7998]">
              {isFr ? "Aujourd'hui" : 'Today'}
            </h2>
            <span className="text-xs font-bold text-[#059669]">
              {unreadCount} {isFr ? 'non-lues' : 'unread'}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {todayList.map((n) => (
              <article
                key={n.id}
                className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        n.category === 'Commandes'
                          ? 'bg-[#ECFDF5] text-[#059669]'
                          : n.category === 'Finances'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#F0EDFF] text-[#5433FF]'
                      }`}
                    >
                      {n.category === 'Avis' ? (
                        <Star className="w-5 h-5" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#13112B] flex items-center gap-2">
                        {n.unread && <span className="w-2 h-2 rounded-full bg-[#5433FF]" />}
                        {n.title}
                      </h3>
                      <p className="text-xs text-[#4B4869] mt-0.5">{n.body}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#7C7998] tabular-nums shrink-0">
                    {n.time}
                  </span>
                </div>

                {n.quote && (
                  <p className="rounded-2xl bg-[#F8F7FC] p-3 text-xs italic text-[#4B4869]">
                    {n.quote}
                  </p>
                )}

                {n.meta && (
                  <div className="rounded-xl bg-[#F8F7FC] px-3 py-2 text-xs font-semibold text-[#13112B]">
                    {n.meta}
                  </div>
                )}

                {n.targetPage && (
                  <button
                    type="button"
                    onClick={() => onNavigate(n.targetPage!)}
                    className={`w-full rounded-xl py-2.5 text-xs font-bold min-h-[40px] transition-colors ${
                      n.category === 'Commandes'
                        ? 'bg-[#5433FF] hover:bg-[#4423E8] text-white'
                        : 'bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF]'
                    }`}
                  >
                    {n.category === 'Commandes'
                      ? isFr
                        ? 'Voir la commande →'
                        : 'View Order →'
                      : n.category === 'Avis'
                        ? isFr
                          ? 'Répondre au client'
                          : 'Reply to Buyer'
                        : isFr
                          ? 'Ouvrir le portefeuille'
                          : 'Open Wallet'}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {todayList.length === 0 && yesterdayList.length === 0 && (
        <div className="rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-1.5">
          <CheckCircle2 className="w-8 h-8 text-[#5433FF]/60 mx-auto" />
          <p className="text-sm font-bold text-[#13112B]">
            {isFr ? 'Aucune notification dans cette catégorie' : 'No notifications in this category'}
          </p>
          <p className="text-xs text-[#7C7998]">
            {isFr
              ? 'Vos alertes de commandes, paiements MoMo et sécurité apparaîtront ici.'
              : 'Your order, MoMo payout, and security alerts will appear here.'}
          </p>
        </div>
      )}

      {yesterdayList.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C7998]">
              {isFr ? 'Hier' : 'Yesterday'}
            </h2>
            <span className="text-xs text-[#7C7998]">
              {yesterdayList.length} {isFr ? 'traitées' : 'handled'}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {yesterdayList.map((n) => (
              <article
                key={n.id}
                className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#13112B]">{n.title}</h3>
                    <p className="text-xs text-[#4B4869] mt-1">{n.body}</p>
                  </div>
                  <span className="text-[11px] text-[#7C7998] tabular-nums shrink-0">
                    {n.time}
                  </span>
                </div>

                {n.category === 'Stock' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('products')}
                    className="rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-4 py-2 text-xs font-bold min-h-[40px]"
                  >
                    {isFr ? '+ Réapprovisionner' : '+ Restock'}
                  </button>
                )}

                {n.category === 'Sécurité' && (
                  <div className="flex items-center gap-2">
                    {n.securityResolved ? (
                      <span className="text-xs font-bold text-[#059669]">
                        {n.securityResolved === 'trusted'
                          ? isFr
                            ? '✓ Appareil confirmé comme fiable'
                            : '✓ Device confirmed as trusted'
                          : isFr
                            ? '✓ Session bloquée et sécurisée'
                            : '✓ Session blocked & secured'}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onResolveSecurity(n.id, 'blocked');
                            onShowToast(
                              isFr
                                ? 'Appareil bloqué par sécurité'
                                : 'Device blocked for security'
                            );
                          }}
                          className="flex-1 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] py-2 text-xs font-bold min-h-[40px]"
                        >
                          {isFr ? 'Non, bloquer' : 'No, block it'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onResolveSecurity(n.id, 'trusted');
                            onShowToast(isFr ? 'Connexion validée' : 'Sign-in confirmed');
                          }}
                          className="flex-1 rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] py-2 text-xs font-bold min-h-[40px]"
                        >
                          {isFr ? "Oui, c'était moi" : 'Yes, that was me'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Active WhatsApp Alerts Footer */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#047857] text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Alertes WhatsApp actives' : 'WhatsApp Alerts Active'}
            </h3>
            <p className="text-xs text-[#7C7998] truncate">
              {isFr
                ? 'Recevez vos commandes et alertes MoMo instantanément sur votre téléphone.'
                : 'Receive orders and MoMo alerts instantly on your phone.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={waAlerts}
          onClick={() => setWaAlerts((v) => !v)}
          className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
            waAlerts ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
              waAlerts ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </section>
    </div>
  );
};
