import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  ChatMessage,
  Customer,
  Lang,
  NotificationItem,
  Order,
  OrderStatus,
  PageId,
  Product,
  PromoCode,
  Review,
  StoreSettings,
  TeamMember,
  Transaction,
  VendorOnboardingPayload,
} from './types/app';
import {
  formatFCFA,
  INITIAL_CHAT,
  INITIAL_CUSTOMERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_PROMOS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_TEAM,
  INITIAL_TRANSACTIONS,
} from './data/mockStore';
import { getInitials } from './components/VisualAssets';
import { AppShell } from './components/AppShell';
import { OfflineIndicator } from './components/PWAComponents';
import { HubPage } from './pages/HubPage';
import { ChatPage, DispatchPage, OrdersPage } from './pages/OrdersPages';
import { AddProductPage, ProductsPage } from './pages/ProductsPages';
import { NotificationsPage, WalletPage } from './pages/WalletNotificationsPages';
import { AnalyticsPage, CrmPage, MarketingPage, ReviewsPage } from './pages/GrowthPages';
import {
  KycPage,
  MenuSettingsPage,
  StorefrontPage,
  SupportPage,
  TeamPage,
} from './pages/AccountPages';
import { AuthPages } from './pages/AuthPages';

function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('welcome');
  const [contextId, setContextId] = useState<string | undefined>(undefined);
  const [lang, setLang] = usePersistentState<Lang>('minib_lang', 'fr');
  const [vendorMode, setVendorMode] = usePersistentState<'existing' | 'new'>(
    'minib_vendor_mode',
    'existing'
  );
  const [registeredVendorPhone, setRegisteredVendorPhone] = usePersistentState<string>(
    'minib_registered_phone',
    ''
  );
  const [balance, setBalance] = usePersistentState<number>('minib_balance', 645800);
  const [escrowBalance, setEscrowBalance] = usePersistentState<number>('minib_escrow', 312000);
  const [products, setProducts] = usePersistentState<Product[]>('minib_products', INITIAL_PRODUCTS);
  const [orders, setOrders] = usePersistentState<Order[]>('minib_orders', INITIAL_ORDERS);
  const [transactions, setTransactions] = usePersistentState<Transaction[]>(
    'minib_transactions',
    INITIAL_TRANSACTIONS
  );
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>(
    'minib_notifications',
    INITIAL_NOTIFICATIONS
  );
  const [reviews, setReviews] = usePersistentState<Review[]>('minib_reviews', INITIAL_REVIEWS);
  const [customers, setCustomers] = usePersistentState<Customer[]>(
    'minib_customers',
    INITIAL_CUSTOMERS
  );
  const [promos, setPromos] = usePersistentState<PromoCode[]>('minib_promos', INITIAL_PROMOS);
  const [team, setTeam] = usePersistentState<TeamMember[]>('minib_team', INITIAL_TEAM);
  const [chatMessages, setChatMessages] = usePersistentState<ChatMessage[]>(
    'minib_chat',
    INITIAL_CHAT
  );
  const [settings, setSettings] = usePersistentState<StoreSettings>(
    'minib_settings',
    INITIAL_SETTINGS
  );
  const [weekendBoostActive, setWeekendBoostActive] = usePersistentState<boolean>(
    'minib_boost',
    false
  );
  const [hideBalance, setHideBalance] = usePersistentState<boolean>('minib_hide_balance', false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleNavigate = (page: PageId, nextContextId?: string) => {
    setCurrentPage(page);
    setContextId(nextContextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotifs = notifications.filter((n) => n.unread).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Nouveau' || o.status === 'En cours'
  ).length;

  const activeOrder =
    orders.find((o) => o.id === contextId) ||
    orders.find((o) => o.id === '#MB-9042') ||
    orders[0];
  const editingProduct = contextId ? products.find((p) => p.id === contextId) : undefined;

  const handleUpdateStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const handleToggleVisibility = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, visible: !p.visible } : p))
    );
  };

  const handleSaveProduct = (product: Product, _isDraft: boolean) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.map((p) => (p.id === product.id ? product : p));
      return [product, ...prev];
    });
    handleNavigate('products');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleWithdraw = (
    amount: number,
    provider: 'MTN MoMo' | 'Moov' | 'Celtiis Cash',
    phone: string
  ) => {
    setBalance((b) => Math.max(0, b - amount));
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: `Retrait ${provider}`,
      subtitle: `Vers ${phone}`,
      date: "À l'instant",
      amount: -amount,
      type: 'withdrawal',
      status: 'SUCCÈS',
      provider: provider === 'MTN MoMo' ? 'mtn' : provider === 'Moov' ? 'moov' : 'celtiis',
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      lang === 'fr'
        ? `Retrait de ${formatFCFA(amount)} envoyé vers ${provider} !`
        : `Withdrawal of ${formatFCFA(amount)} sent to ${provider}!`
    );
  };

  const handleSendChat = (text: string) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'merchant',
        text,
        time: `${hh}:${mm}`,
      },
    ]);
  };

  const handleReplyReview = (reviewId: string, text: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, reply: { text, timeAgo: "À l'instant" } } : r
      )
    );
  };

  const handleThankReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, thanked: true } : r))
    );
  };

  const handleCompleteOnboarding = (payload: VendorOnboardingPayload) => {
    setVendorMode('new');
    setRegisteredVendorPhone(payload.phone);
    setSettings({
      shopName: payload.shopName,
      managerName: payload.managerName,
      slogan: payload.slogan,
      address: `${payload.streetAddress}, ${payload.city}`,
      whatsapp: `+229 ${payload.phone}`,
      isOpen: true,
      weekdayHours: payload.weekdayHours,
      sundayHours: payload.sundayHours,
      warranty: payload.warranty,
      returnPolicy: lang === 'fr' ? 'Retours acceptés sous 48h' : 'Returns accepted within 48h',
      accentColor: '#5433FF',
      pushWhatsApp: true,
      biometrics: true,
      twoFactor: false,
      category: payload.category,
      payoutProvider: payload.payoutProvider,
      ifuNumber: payload.ifuNumber,
    });

    if (payload.starterProduct) {
      const starter: Product = {
        id: `prod-${Date.now()}`,
        name: payload.starterProduct.name,
        specs: `${payload.shopName} · ${payload.category}`,
        category: payload.category,
        brand: payload.shopName,
        price: payload.starterProduct.price,
        stock: payload.starterProduct.stock,
        sku: `MB-${Math.floor(1000 + Math.random() * 9000)}`,
        badgeLabel: lang === 'fr' ? 'Nouveau' : 'New',
        rating: 0,
        reviewCount: 0,
        visible: true,
        visualType: 'laptop-dell',
        imageUrl: payload.starterProduct.imageUrl,
        photos: payload.starterProduct.imageUrl ? [payload.starterProduct.imageUrl] : undefined,
        gozemExpress: payload.gozemExpress,
        weightKg: 1.0,
        description: payload.slogan,
      };
      setProducts([starter]);
    } else {
      setProducts([]);
    }

    // New vendors start from scratch with zero sales, orders, wallet balance, customers, reviews, or promos
    setOrders([]);
    setTransactions([]);
    setBalance(0);
    setEscrowBalance(0);
    setReviews([]);
    setCustomers([]);
    setPromos([]);
    setChatMessages([]);
    setWeekendBoostActive(false);
    setTeam([
      {
        id: 'tm-owner',
        name: payload.managerName,
        initials: getInitials(payload.managerName),
        roleTitle: 'Propriétaire & Signataire financier',
        phone: `+229 ${payload.phone}`,
        status: 'PROPRIÉTAIRE',
        permissions: ['Retraits MoMo illimités', 'Audit & Comptabilité'],
        noWithdrawal: false,
        description: `${payload.shopName} · Compte Principal`,
      },
    ]);

    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      group: 'today',
      category: 'Sécurité',
      title:
        lang === 'fr'
          ? `Boutique « ${payload.shopName} » activée !`
          : `Store "${payload.shopName}" activated!`,
      body:
        lang === 'fr'
          ? `Retraits ${payload.payoutProvider} (+229 ${payload.phone}) prêts et protégés par séquestre MINI-B.`
          : `${payload.payoutProvider} payouts (+229 ${payload.phone}) ready and protected by MINI-B Escrow.`,
      time: lang === 'fr' ? "À l'instant" : 'Just now',
      unread: true,
      targetPage: payload.starterProduct ? 'storefront' : 'add-product',
    };
    setNotifications([welcomeNotif]);

    showToast(
      lang === 'fr'
        ? `Bienvenue ${payload.managerName} ! « ${payload.shopName} » est prêt à démarrer.`
        : `Welcome ${payload.managerName}! "${payload.shopName}" is ready to launch.`
    );
    handleNavigate('hub');
  };

  const handleResetDemo = (notify = true) => {
    setVendorMode('existing');
    setSettings(INITIAL_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBalance(645800);
    setEscrowBalance(312000);
    setReviews(INITIAL_REVIEWS);
    setCustomers(INITIAL_CUSTOMERS);
    setPromos(INITIAL_PROMOS);
    setTeam(INITIAL_TEAM);
    setChatMessages(INITIAL_CHAT);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWeekendBoostActive(false);
    if (notify) {
      showToast(
        lang === 'fr'
          ? 'Profil démo Koffi Tech Hub restauré'
          : 'Koffi Tech Hub demo profile restored'
      );
    }
  };

  const handleLaunchKoffiDemo = () => {
    handleResetDemo(false);
    showToast(
      lang === 'fr'
        ? 'Boutique démo Koffi Tech Hub ouverte'
        : 'Koffi Tech Hub mock store opened'
    );
    handleNavigate('hub');
  };

  return (
    <>
      <AppShell
        currentPage={currentPage}
        onNavigate={(p) => handleNavigate(p)}
        lang={lang}
        onToggleLang={setLang}
        unreadNotifs={unreadNotifs}
        pendingOrdersCount={pendingOrdersCount}
        settings={settings}
      >
        {currentPage === 'hub' && (
          <HubPage
            lang={lang}
            vendorMode={vendorMode}
            balance={balance}
            hideBalance={hideBalance}
            onToggleHideBalance={() => setHideBalance((v) => !v)}
            orders={orders}
            products={products}
            reviews={reviews}
            team={team}
            settings={settings}
            weekendBoostActive={weekendBoostActive}
            onToggleWeekendBoost={() => setWeekendBoostActive((v) => !v)}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage
            lang={lang}
            vendorMode={vendorMode}
            hideBalance={hideBalance}
            onToggleHideBalance={() => setHideBalance((v) => !v)}
            orders={orders}
            onNavigate={handleNavigate}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'dispatch' && (
          <DispatchPage
            lang={lang}
            order={activeOrder}
            onConfirmHandover={(id) => handleUpdateOrderStatus(id, 'Expédié')}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'chat' && (
          <ChatPage
            lang={lang}
            order={activeOrder}
            messages={chatMessages}
            onSendMessage={handleSendChat}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            lang={lang}
            products={products}
            onUpdateStock={handleUpdateStock}
            onToggleVisibility={handleToggleVisibility}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'add-product' && (
          <AddProductPage
            lang={lang}
            editingProduct={editingProduct}
            onSaveProduct={handleSaveProduct}
            onCancel={() => handleNavigate('products')}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'wallet' && (
          <WalletPage
            lang={lang}
            vendorMode={vendorMode}
            balance={balance}
            escrowBalance={escrowBalance}
            hideBalance={hideBalance}
            onToggleHideBalance={() => setHideBalance((v) => !v)}
            transactions={transactions}
            defaultPhone={settings.whatsapp}
            shopName={settings.shopName}
            onWithdraw={handleWithdraw}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'notifications' && (
          <NotificationsPage
            lang={lang}
            notifications={notifications}
            onMarkAllRead={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
            }
            onResolveSecurity={(id, decision) =>
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, securityResolved: decision } : n))
              )
            }
            onNavigate={(p) => handleNavigate(p)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage
            lang={lang}
            vendorMode={vendorMode}
            orders={orders}
            products={products}
            onNavigate={(p) => handleNavigate(p)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'crm' && (
          <CrmPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            customers={customers}
            onNavigate={(p) => handleNavigate(p)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'reviews' && (
          <ReviewsPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            reviews={reviews}
            onReplyReview={handleReplyReview}
            onThankReview={handleThankReview}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'marketing' && (
          <MarketingPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            productsCount={products.length}
            promos={promos}
            onTogglePromo={(id) =>
              setPromos((prev) =>
                prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
              )
            }
            onAddPromo={(promo) => setPromos((prev) => [promo, ...prev])}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'team' && (
          <TeamPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            team={team}
            onAddMember={(m) => setTeam((prev) => [...prev, m])}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'storefront' && (
          <StorefrontPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            products={products}
            reviews={reviews}
            onSaveSettings={setSettings}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'kyc' && (
          <KycPage
            lang={lang}
            vendorMode={vendorMode}
            settings={settings}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'support' && <SupportPage lang={lang} onShowToast={showToast} />}

        {currentPage === 'menu' && (
          <MenuSettingsPage
            lang={lang}
            vendorMode={vendorMode}
            hideBalance={hideBalance}
            onToggleHideBalance={() => setHideBalance((v) => !v)}
            onToggleLang={setLang}
            settings={settings}
            onUpdateSettings={setSettings}
            onNavigate={(p) => handleNavigate(p)}
            onResetDemo={() => handleResetDemo(true)}
            onShowToast={showToast}
          />
        )}

        {(currentPage === 'welcome' ||
          currentPage === 'login' ||
          currentPage === 'register' ||
          currentPage === 'otp') && (
          <AuthPages
            lang={lang}
            mode={currentPage}
            registeredPhone={registeredVendorPhone}
            hasExistingCustomStore={vendorMode === 'new'}
            customStoreName={settings.shopName}
            onNavigate={(p) => handleNavigate(p)}
            onCompleteOnboarding={handleCompleteOnboarding}
            onSignInExisting={() => handleResetDemo(false)}
            onLaunchKoffiDemo={handleLaunchKoffiDemo}
            onResumeCustomStore={() => handleNavigate('hub')}
            onShowToast={showToast}
          />
        )}
      </AppShell>

      <OfflineIndicator lang={lang} />

      {/* Non-intrusive Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed top-16 right-4 z-50 flex items-center gap-2 rounded-2xl bg-[#13112B] text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-white/10"
        >
          <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
