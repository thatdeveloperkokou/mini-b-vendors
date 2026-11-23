import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  MapPin,
  MessageSquare,
  PackagePlus,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
  UserPlus,
} from 'lucide-react';
import { Lang, PageId, VendorOnboardingPayload } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { AvatarBadge, getInitials, PRODUCT_PHOTO_MAP } from '../components/VisualAssets';

interface AuthPagesProps {
  lang: Lang;
  mode: 'welcome' | 'login' | 'register' | 'otp';
  registeredPhone?: string;
  hasExistingCustomStore?: boolean;
  customStoreName?: string;
  onNavigate: (page: PageId) => void;
  onCompleteOnboarding: (payload: VendorOnboardingPayload) => void;
  onSignInExisting?: () => void;
  onLaunchKoffiDemo?: () => void;
  onResumeCustomStore?: () => void;
  onShowToast: (msg: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  lang,
  mode,
  registeredPhone,
  hasExistingCustomStore,
  customStoreName,
  onNavigate,
  onCompleteOnboarding,
  onSignInExisting,
  onLaunchKoffiDemo,
  onResumeCustomStore,
  onShowToast,
}) => {
  const isFr = lang === 'fr';

  /* Login state */
  const [phone, setPhone] = useState('97 00 12 34');
  const [password, setPassword] = useState('koffitech2025');
  const [showPass, setShowPass] = useState(false);

  /* Onboarding (Register) 4-Step State */
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);
  const [managerName, setManagerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('Cotonou - Haie Vive');
  const [streetAddress, setStreetAddress] = useState('');
  const [slogan, setSlogan] = useState('');
  const [category, setCategory] = useState('High-Tech & Élec');

  const [payoutProvider, setPayoutProvider] = useState<'MTN MoMo' | 'Moov Money' | 'Celtiis Cash'>(
    'MTN MoMo'
  );
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [ifuNumber, setIfuNumber] = useState('');

  const [weekdayHours, setWeekdayHours] = useState('08:30 - 19:30');
  const [sundayHours, setSundayHours] = useState('10:00 - 15:00');
  const [gozemExpress, setGozemExpress] = useState(true);
  const [warranty, setWarranty] = useState(
    isFr ? 'Garantie vendeur 6 mois' : '6-month seller warranty'
  );

  const [addStarterProduct, setAddStarterProduct] = useState(false);
  const [starterName, setStarterName] = useState('');
  const [starterPrice, setStarterPrice] = useState('45000');
  const [starterStock, setStarterStock] = useState('5');
  const [starterPhoto, setStarterPhoto] = useState<string>(PRODUCT_PHOTO_MAP['laptop-dell']);
  const starterFileRef = useRef<HTMLInputElement | null>(null);

  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [pendingVendor, setPendingVendor] = useState<VendorOnboardingPayload | null>(null);

  /* OTP state */
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (mode !== 'otp') return;
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [mode]);

  const fillExampleVendor = () => {
    setManagerName('Aminatou Sègla');
    setShopName('Bénin Style & Tech');
    setCity('Cotonou - Akpakpa');
    setStreetAddress('Carrefour Sacré-Cœur, Rue 214');
    setSlogan(
      isFr
        ? 'Accessoires certifiés & gadgets sélectionnés à Cotonou.'
        : 'Certified accessories & curated gadgets in Cotonou.'
    );
    setCategory('High-Tech & Élec');
    setPayoutProvider('MTN MoMo');
    setRegPhone('97 45 88 10');
    setRegPassword('minib2025');
    setIfuNumber('0202488192014');
    setAddStarterProduct(true);
    setStarterName('Sac Laptop Imperméable Pro');
    setStarterPrice('25000');
    setStarterStock('12');
    setStarterPhoto(PRODUCT_PHOTO_MAP.backpack);
    setCgvAccepted(true);
    onShowToast(
      isFr ? 'Exemple nouveau vendeur rempli' : 'Sample new vendor details filled'
    );
  };

  const handleStarterPhotoUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setStarterPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderModeSwitcher = () => (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-white border border-[#ECEAF6] p-1">
      <button
        type="button"
        onClick={() => onNavigate('login')}
        className={`rounded-xl py-2.5 text-xs font-extrabold transition-colors min-h-[42px] ${
          mode === 'login'
            ? 'bg-[#5433FF] text-white shadow-xs'
            : 'text-[#4B4869] hover:text-[#13112B]'
        }`}
      >
        {isFr ? 'Connexion Vendeur' : 'Vendor Sign In'}
      </button>
      <button
        type="button"
        onClick={() => {
          setRegStep(1);
          onNavigate('register');
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-colors min-h-[42px] ${
          mode === 'register'
            ? 'bg-[#5433FF] text-white shadow-xs'
            : 'text-[#4B4869] hover:text-[#13112B]'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>{isFr ? 'Nouveau Vendeur' : 'New Vendor Sign Up'}</span>
      </button>
    </div>
  );

  if (mode === 'welcome') {
    return (
      <div className="space-y-4">
        {/* Startup Hero Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] via-[#4D26E2] to-[#3715C9] text-white p-6 space-y-3 shadow-lg shadow-[#5433FF]/20">
          <div>
            <span className="inline-block rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold">
              {isFr ? 'MINI-B VENDORS · BÉNIN' : 'MINI-B VENDORS · BENIN'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-balance">
            {isFr
              ? 'Comment souhaitez-vous démarrer ?'
              : 'How would you like to get started?'}
          </h1>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            {isFr
              ? 'Découvrez une boutique déjà active ou créez la vôtre dès maintenant.'
              : 'Check out a pre-existing store or build one for yourself.'}
          </p>
        </section>

        {/* Resume existing custom storefront if user already created one */}
        {hasExistingCustomStore && customStoreName && onResumeCustomStore && (
          <button
            type="button"
            onClick={onResumeCustomStore}
            className="w-full rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#D1FAE5] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <AvatarBadge initials={getInitials(customStoreName)} tone="emerald" online size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#065F46] truncate">
                  {isFr
                    ? `Reprendre ma boutique : ${customStoreName}`
                    : `Resume my store: ${customStoreName}`}
                </p>
                <p className="text-[11px] text-[#047857] truncate">
                  {isFr
                    ? 'Accéder directement à votre tableau de bord enregistré'
                    : 'Jump straight back into your saved storefront dashboard'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#059669] shrink-0" />
          </button>
        )}

        {/* Two Startup Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Koffi Tech Hub Mock Store */}
          <article className="rounded-3xl bg-white border-2 border-[#ECEAF6] hover:border-[#5433FF] p-5 flex flex-col justify-between gap-4 transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <AvatarBadge initials="KM" tone="purple" online size="md" />
                  <div>
                    <span className="inline-block rounded-md bg-[#F0EDFF] text-[#5433FF] px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      {isFr ? 'Boutique Démo' : 'Mock Store'}
                    </span>
                    <h2 className="text-base font-extrabold text-[#13112B] mt-0.5">
                      Koffi Tech Hub
                    </h2>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              </div>

              <p className="text-xs text-[#4B4869] leading-relaxed">
                {isFr
                  ? 'Testez toutes les fonctionnalités avec un marchand établi à Cotonou : catalogue actif, commandes en direct, solde MoMo et statistiques.'
                  : 'Explore every feature with an established Cotonou merchant: live inventory, active orders, MoMo balance, and analytics.'}
              </p>

              <div className="rounded-2xl bg-[#F8F7FC] p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Catalogue' : 'Catalog'}</span>
                  <span className="font-bold text-[#13112B] tabular-nums">
                    {isFr ? '5 produits · Photos réelles' : '5 products · Real photos'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Commandes' : 'Orders'}</span>
                  <span className="font-bold text-[#13112B] tabular-nums">
                    {isFr ? '5 actives (Gozem / Zem)' : '5 active (Gozem / Zem)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Portefeuille' : 'Wallet'}</span>
                  <span className="font-extrabold text-[#5433FF] tabular-nums">
                    {formatFCFA(645800)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onLaunchKoffiDemo) {
                  onLaunchKoffiDemo();
                } else {
                  onSignInExisting?.();
                  onNavigate('hub');
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 px-4 text-xs sm:text-sm font-bold min-h-[48px] transition-colors"
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>
                {isFr ? 'Utiliser Koffi Mock Store' : 'Use Koffi Mock Store'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </article>

          {/* Option 2: Create a New Storefront */}
          <article className="rounded-3xl bg-white border-2 border-[#ECEAF6] hover:border-[#059669] p-5 flex flex-col justify-between gap-4 transition-colors shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-block rounded-md bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      {isFr ? 'Nouveau Vendeur' : 'Fresh Start'}
                    </span>
                    <h2 className="text-base font-extrabold text-[#13112B] mt-0.5">
                      {isFr ? 'Nouvelle Boutique' : 'New Storefront'}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#4B4869] leading-relaxed">
                {isFr
                  ? 'Lancez votre propre boutique à zéro : aucun produit ni vente pré-remplis, nom & slogan personnalisés et retraits Mobile Money.'
                  : 'Launch your own store from scratch: zero pre-filled products or sales, custom shop profile, and Mobile Money payouts.'}
              </p>

              <div className="rounded-2xl bg-[#F8F7FC] p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Produits initiaux' : 'Initial products'}</span>
                  <span className="font-bold text-[#13112B]">
                    {isFr ? '0 (catalogue vierge)' : '0 (clean catalog)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Ventes & Solde' : 'Sales & Balance'}</span>
                  <span className="font-bold text-[#13112B] tabular-nums">0 FCFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Configuration' : 'Setup'}</span>
                  <span className="font-extrabold text-[#059669]">
                    {isFr ? '4 étapes guidées' : '4 guided steps'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRegStep(1);
                onNavigate('register');
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#13112B] hover:bg-[#231F47] text-white py-3.5 px-4 text-xs sm:text-sm font-bold min-h-[48px] transition-colors"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>
                {isFr ? 'Créer une nouvelle boutique' : 'Create a New Storefront'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </article>
        </div>

        {/* Existing Account Sign-in Shortcut */}
        <div className="rounded-2xl bg-white border border-[#ECEAF6] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#4B4869]">
            <Phone className="w-4 h-4 text-[#5433FF] shrink-0" />
            <span className="font-semibold">
              {isFr
                ? 'Déjà un compte vendeur MINI-B ?'
                : 'Already have a MINI-B vendor account?'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="rounded-xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-3.5 py-2 text-xs font-extrabold transition-colors"
          >
            {isFr ? 'Se connecter avec numéro' : 'Sign in with phone'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="space-y-4">
        {renderModeSwitcher()}

        {/* Hero Purple Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] via-[#4D26E2] to-[#3715C9] text-white p-6 space-y-3 shadow-lg shadow-[#5433FF]/20">
          <span className="inline-block rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold">
            {isFr ? 'ESPACE VENDEUR PRO MINI-B BÉNIN' : 'MINI-B BENIN VENDOR PRO HUB'}
          </span>
          <h1 className="text-2xl font-extrabold leading-tight text-balance">
            {isFr
              ? 'Gérez votre boutique & vos ventes en toute simplicité'
              : 'Manage your storefront & sales effortlessly'}
          </h1>
          <p className="text-xs text-white/85 leading-relaxed">
            {isFr
              ? 'La marketplace N°1 au Bénin avec paiements Mobile Money sécurisés intégrés instantanément.'
              : 'Benin’s #1 marketplace with instant, escrow-protected Mobile Money payouts.'}
          </p>
        </section>

        <div className="rounded-2xl bg-white border border-[#ECEAF6] px-4 py-3 flex items-center justify-between text-xs font-bold text-[#13112B]">
          <span className="flex items-center gap-2 text-[#059669]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {isFr
              ? '+12 500 marchands actifs à Cotonou, Porto-Novo & Calavi'
              : '12,500+ active merchants in Cotonou, Porto-Novo & Calavi'}
          </span>
        </div>

        {/* Login Form */}
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#13112B]">
                {isFr ? 'Connexion Compte Marchand' : 'Merchant Account Sign In'}
              </h2>
              <p className="text-xs text-[#7C7998]">
                {isFr
                  ? 'Accédez à vos commandes et votre solde'
                  : 'Access your orders and wallet balance'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">
                {isFr ? 'Numéro Téléphone / WhatsApp Marchand' : 'Merchant Phone / WhatsApp Number'}
              </label>
              <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                <span className="text-xs font-extrabold text-[#13112B] shrink-0">BJ +229</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-[#13112B] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-bold text-[#4B4869]">
                  {isFr ? 'Code secret / Mot de passe' : 'Secret PIN / Password'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPendingVendor(null);
                    setOtpDigits(['4', '8', '1', '9', '', '']);
                    onNavigate('otp');
                  }}
                  className="font-bold text-[#5433FF] hover:underline"
                >
                  {isFr ? 'Code oublié ?' : 'Forgot PIN?'}
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                <Lock className="w-4 h-4 text-[#7C7998]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-[#13112B] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-[#7C7998]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPendingVendor(null);
                setOtpDigits(['4', '8', '1', '9', '', '']);
                onNavigate('otp');
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold min-h-[48px]"
            >
              <span>{isFr ? 'Se connecter à mon Hub' : 'Sign in to my Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onShowToast(
                  isFr
                    ? 'Authentification biométrique validée !'
                    : 'Biometric authentication verified!'
                );
                const cleanInput = phone.replace(/\D/g, '');
                const cleanRegistered = (registeredPhone || '').replace(/\D/g, '');
                if (cleanInput === '97001234' || (!cleanRegistered && cleanInput !== cleanRegistered)) {
                  onSignInExisting?.();
                }
                onNavigate('hub');
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] py-3 text-xs font-bold min-h-[44px]"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{isFr ? 'Connexion biométrique rapide' : 'Quick Biometric Sign In'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#F1EFF9]">
            <button
              type="button"
              onClick={() => {
                setRegStep(1);
                onNavigate('register');
              }}
              className="w-full rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] px-4 py-3 flex items-center justify-between text-left hover:bg-[#D1FAE5] transition-colors"
            >
              <div>
                <p className="text-xs font-extrabold text-[#065F46]">
                  {isFr ? 'Ouvrir ma boutique gratuitement' : 'Open my store for free'}
                </p>
                <p className="text-[11px] text-[#047857]">
                  {isFr ? 'Inscription guidée en 4 étapes' : 'Guided 4-step vendor onboarding'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#059669]" />
            </button>
          </div>
        </section>

        {/* Demo Autofill */}
        <div className="rounded-2xl bg-white border border-[#ECEAF6] px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#4B4869]">
            {isFr ? 'Essai démo Marchand Cotonou' : 'Cotonou Merchant Demo'}
          </span>
          <button
            type="button"
            onClick={() => {
              setPhone('97 00 12 34');
              setPassword('koffitech2025');
              onShowToast(
                isFr
                  ? 'Identifiants Koffi Tech Hub pré-remplis'
                  : 'Koffi Tech Hub credentials filled'
              );
            }}
            className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-1.5 text-xs font-bold"
          >
            {isFr ? 'Remplir auto' : 'Auto-fill'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'register') {
    const categories = [
      { key: 'High-Tech & Élec', label: isFr ? 'High-Tech & Élec' : 'Tech & Electronics' },
      { key: 'Mode & Wax', label: isFr ? 'Mode & Wax' : 'Fashion & Wax' },
      { key: 'Beauté & Soins', label: isFr ? 'Beauté & Soins' : 'Beauty & Care' },
      { key: 'Alimentation & Bio', label: isFr ? 'Alimentation & Bio' : 'Food & Organic' },
    ];

    const stepTitles = isFr
      ? ['Identité Boutique', 'Paiement Mobile Money', 'Horaires & Produit', 'Validation']
      : ['Store Identity', 'Mobile Money Payout', 'Hours & First Item', 'Review & Launch'];

    const goNextStep = () => {
      if (regStep === 1) {
        if (!managerName.trim() || !shopName.trim()) {
          onShowToast(
            isFr
              ? 'Veuillez saisir le nom du gérant et de la boutique.'
              : 'Please enter the manager name and store name.'
          );
          return;
        }
        setRegStep(2);
        return;
      }

      if (regStep === 2) {
        const cleanDigits = regPhone.replace(/\D/g, '');
        if (cleanDigits.length < 8) {
          onShowToast(
            isFr
              ? 'Veuillez entrer un numéro Mobile Money béninois valide (8+ chiffres).'
              : 'Please enter a valid Benin Mobile Money number (8+ digits).'
          );
          return;
        }
        if (regPassword.trim().length < 6) {
          onShowToast(
            isFr
              ? 'Choisissez un mot de passe d’au moins 6 caractères.'
              : 'Choose a password of at least 6 characters.'
          );
          return;
        }
        setRegStep(3);
        return;
      }

      if (regStep === 3) {
        if (addStarterProduct && !starterName.trim()) {
          onShowToast(
            isFr
              ? 'Indiquez le nom de votre premier produit ou désactivez l’option.'
              : 'Enter your first product name or turn off the starter item toggle.'
          );
          return;
        }
        setRegStep(4);
        return;
      }

      if (!cgvAccepted) {
        onShowToast(
          isFr
            ? 'Veuillez accepter les Conditions Générales et le séquestre MINI-B.'
            : 'Please accept the Terms of Sale and MINI-B Escrow agreement.'
        );
        return;
      }

      const payload: VendorOnboardingPayload = {
        managerName: managerName.trim(),
        shopName: shopName.trim(),
        category,
        city,
        streetAddress: streetAddress.trim() || city,
        slogan:
          slogan.trim() ||
          (isFr
            ? `Boutique vérifiée ${category} basée à ${city}.`
            : `Verified ${category} storefront based in ${city}.`),
        payoutProvider,
        phone: regPhone.trim(),
        ifuNumber: ifuNumber.trim() || undefined,
        weekdayHours,
        sundayHours,
        gozemExpress,
        warranty,
        starterProduct: addStarterProduct
          ? {
              name: starterName.trim(),
              price: Math.max(500, Number(starterPrice) || 25000),
              stock: Math.max(1, Number(starterStock) || 1),
              imageUrl: starterPhoto,
            }
          : undefined,
      };

      setPendingVendor(payload);
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(45);
      onShowToast(
        isFr
          ? 'Dossier enregistré ! Confirmez votre numéro par OTP.'
          : 'Store profile ready! Confirm your phone via OTP.'
      );
      onNavigate('otp');
    };

    return (
      <div className="space-y-4">
        {renderModeSwitcher()}

        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#5433FF]">
            {isFr
              ? `Étape ${regStep}/4 · ${stepTitles[regStep - 1]}`
              : `Step ${regStep}/4 · ${stepTitles[regStep - 1]}`}
          </span>
          <button
            type="button"
            onClick={fillExampleVendor}
            className="inline-flex items-center gap-1 rounded-lg bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] px-2.5 py-1 font-bold transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isFr ? 'Remplir exemple' : 'Fill example'}</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-colors ${
                step <= regStep ? 'bg-[#5433FF]' : 'bg-[#E5E2F5]'
              }`}
            />
          ))}
        </div>

        <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] to-[#3715C9] text-white p-5 space-y-1.5">
          <h1 className="text-lg font-extrabold text-balance">
            {isFr
              ? "Ouvrez votre boutique MINI-B au Bénin & en Afrique de l'Ouest"
              : 'Launch your MINI-B store in Benin & West Africa'}
          </h1>
          <p className="text-xs text-white/85 leading-relaxed">
            {isFr
              ? 'Encaissez via MTN MoMo, Moov Money & Celtiis Cash avec séquestre sécurisé et livraison Gozem intégrée.'
              : 'Accept MTN MoMo, Moov Money & Celtiis Cash with protected escrow and built-in Gozem delivery.'}
          </p>
        </section>

        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-[#13112B]">
              {stepTitles[regStep - 1]}
            </h2>
            {regStep > 1 && (
              <button
                type="button"
                onClick={() => setRegStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5433FF] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isFr ? 'Précédent' : 'Back'}</span>
              </button>
            )}
          </div>

          {regStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Nom complet du gérant *' : 'Owner / Manager Full Name *'}
                </label>
                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <User className="w-4 h-4 text-[#7C7998]" />
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder={isFr ? 'Ex : Aminatou Sègla' : 'e.g. Aminatou Segla'}
                    className="w-full bg-transparent text-sm font-semibold text-[#13112B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Nom commercial de la boutique *' : 'Storefront / Business Name *'}
                </label>
                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <Store className="w-4 h-4 text-[#7C7998]" />
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={isFr ? 'Ex : Cotonou Digital Store' : 'e.g. Cotonou Digital Store'}
                    className="w-full bg-transparent text-sm font-semibold text-[#13112B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                    {isFr ? 'Ville & Quartier' : 'City & District'}
                  </label>
                  <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                    <MapPin className="w-4 h-4 text-[#7C7998] shrink-0" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-[#13112B] outline-none"
                    >
                      <option>Cotonou - Haie Vive</option>
                      <option>Cotonou - Akpakpa</option>
                      <option>Cotonou - Ganhi / Dantokpa</option>
                      <option>Abomey-Calavi</option>
                      <option>Porto-Novo - Ouando</option>
                      <option>Parakou</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                    {isFr ? 'Adresse / Repère physique' : 'Street / Landmark'}
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder={isFr ? 'Rue 340, face pharmacie...' : 'Street 340, near pharmacy...'}
                    className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-semibold text-[#13112B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? "Catégorie Principale d'activité" : 'Primary Business Category'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                        category === cat.key
                          ? 'bg-[#5433FF] text-white'
                          : 'bg-[#F5F5FA] text-[#4B4869] hover:text-[#13112B]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Slogan vitrine (optionnel)' : 'Storefront tagline (optional)'}
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder={
                    isFr
                      ? 'Ex : Qualité certifiée et livraison express à Cotonou'
                      : 'e.g. Certified quality and express delivery in Cotonou'
                  }
                  className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-xs font-semibold text-[#13112B] outline-none"
                />
              </div>
            </div>
          )}

          {regStep === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1.5">
                  {isFr ? 'Réseau Mobile Money principal *' : 'Primary Mobile Money Network *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MTN MoMo', 'Moov Money', 'Celtiis Cash'] as const).map((net) => {
                    const active = payoutProvider === net;
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setPayoutProvider(net)}
                        className={`rounded-2xl border p-2.5 text-center transition-colors ${
                          active
                            ? 'bg-[#F0EDFF] border-[#5433FF] text-[#5433FF]'
                            : 'bg-[#F8F7FC] border-[#ECEAF6] text-[#4B4869]'
                        }`}
                      >
                        <p className="text-xs font-extrabold">{net}</p>
                        <p className="text-[10px] font-semibold text-[#059669]">
                          {isFr ? '0% frais' : '0% fee'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr
                    ? 'Numéro Téléphone & WhatsApp de réception *'
                    : 'Payout Phone & WhatsApp Number *'}
                </label>
                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <Phone className="w-4 h-4 text-[#5433FF] shrink-0" />
                  <span className="text-xs font-bold text-[#13112B]">+229</span>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="97 00 00 00"
                    className="w-full bg-transparent text-sm font-bold text-[#13112B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Mot de passe / Code secret Hub *' : 'Hub Password / Secret PIN *'}
                </label>
                <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <Lock className="w-4 h-4 text-[#7C7998]" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={isFr ? 'Minimum 6 caractères' : 'Minimum 6 characters'}
                    className="w-full bg-transparent text-sm font-bold text-[#13112B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass((v) => !v)}
                    className="text-[#7C7998]"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Numéro IFU / RCCM (optionnel maintenant)' : 'IFU / Tax ID (optional now)'}
                </label>
                <input
                  type="text"
                  value={ifuNumber}
                  onChange={(e) => setIfuNumber(e.target.value)}
                  placeholder="02024XXXXXXXX"
                  className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-mono font-bold text-[#13112B] outline-none"
                />
                <p className="mt-1 text-[11px] text-[#7C7998]">
                  {isFr
                    ? 'Vous pourrez aussi finaliser votre KYC dans le menu à tout moment.'
                    : 'You can also complete full KYC later inside the Menu settings.'}
                </p>
              </div>
            </div>
          )}

          {regStep === 3 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                    {isFr ? 'Horaires Lun–Sam' : 'Mon–Sat Hours'}
                  </label>
                  <div className="flex items-center gap-2 rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-[#5433FF]" />
                    <input
                      type="text"
                      value={weekdayHours}
                      onChange={(e) => setWeekdayHours(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                    {isFr ? 'Dimanche' : 'Sunday'}
                  </label>
                  <input
                    type="text"
                    value={sundayHours}
                    onChange={(e) => setSundayHours(e.target.value)}
                    className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8F7FC] p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#13112B]">
                      {isFr ? 'Activer Gozem / Zem Express' : 'Enable Gozem / Zem Express'}
                    </p>
                    <p className="text-[11px] text-[#7C7998]">
                      {isFr
                        ? 'Dispatch livreur moto à Cotonou & Calavi'
                        : 'Urban motorbike dispatch in Cotonou & Calavi'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={gozemExpress}
                  onClick={() => setGozemExpress((v) => !v)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                    gozemExpress ? 'bg-[#059669]' : 'bg-[#CBD5E1]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      gozemExpress ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Politique de garantie boutique' : 'Store Warranty Policy'}
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="rounded-2xl border border-[#E5E2F5] p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PackagePlus className="w-4 h-4 text-[#5433FF]" />
                    <span className="text-xs font-bold text-[#13112B]">
                      {isFr
                        ? 'Publier mon 1er produit maintenant'
                        : 'Publish my 1st product now'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={addStarterProduct}
                    onClick={() => setAddStarterProduct((v) => !v)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                      addStarterProduct ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        addStarterProduct ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {addStarterProduct && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F1EFF9]">
                    <input
                      ref={starterFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStarterPhotoUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <img
                        src={starterPhoto}
                        alt={starterName || 'Product preview'}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5E2F5] shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => starterFileRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-2 text-xs font-bold"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isFr ? 'Choisir photo réelle' : 'Upload real photo'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={starterName}
                      onChange={(e) => setStarterName(e.target.value)}
                      placeholder={
                        isFr ? 'Nom du produit (ex: Laptop Dell XPS)' : 'Product name (e.g. Dell XPS Laptop)'
                      }
                      className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2 text-xs font-semibold outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={starterPrice}
                        onChange={(e) => setStarterPrice(e.target.value)}
                        placeholder="Prix FCFA"
                        className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2 text-xs font-bold outline-none tabular-nums"
                      />
                      <input
                        type="number"
                        value={starterStock}
                        onChange={(e) => setStarterStock(e.target.value)}
                        placeholder={isFr ? 'Stock' : 'Qty'}
                        className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2 text-xs font-bold outline-none tabular-nums"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {regStep === 4 && (
            <div className="space-y-3.5">
              <div className="rounded-2xl bg-[#F8F7FC] border border-[#ECEAF6] p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Boutique' : 'Storefront'}</span>
                  <span className="font-extrabold text-[#13112B]">{shopName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Gérant' : 'Manager'}</span>
                  <span className="font-bold text-[#13112B]">{managerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Catégorie' : 'Category'}</span>
                  <span className="font-bold text-[#5433FF]">{category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Zone' : 'Location'}</span>
                  <span className="font-semibold text-[#13112B]">{city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7998]">{isFr ? 'Retraits' : 'Payouts'}</span>
                  <span className="font-bold text-[#059669]">
                    {payoutProvider} · +229 {regPhone}
                  </span>
                </div>
                {addStarterProduct && starterName.trim() && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#ECEAF6]">
                    <span className="text-[#7C7998]">{isFr ? '1er article' : 'First item'}</span>
                    <span className="font-bold text-[#13112B]">
                      {starterName} ({formatFCFA(Number(starterPrice) || 25000)})
                    </span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#4B4869] cursor-pointer">
                <input
                  type="checkbox"
                  checked={cgvAccepted}
                  onChange={(e) => setCgvAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#5433FF] w-4 h-4"
                />
                <span>
                  {isFr
                    ? "J'accepte les Conditions Générales de Vente et le protocole de séquestre sécurisé MINI-B Bénin."
                    : 'I agree to the Merchant Terms of Sale and MINI-B Benin secure escrow protocol.'}
                </span>
              </label>
            </div>
          )}

          <button
            type="button"
            onClick={goNextStep}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold min-h-[48px]"
          >
            <span>
              {regStep < 4
                ? isFr
                  ? 'Continuer'
                  : 'Continue'
                : isFr
                  ? 'Créer ma boutique & Vérifier OTP'
                  : 'Create Store & Verify OTP'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-[#7C7998]">
            {isFr ? 'Déjà un compte vendeur ?' : 'Already have a vendor account?'}{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-bold text-[#5433FF] hover:underline"
            >
              {isFr ? 'Se connecter' : 'Sign in'}
            </button>
          </p>
        </section>
      </div>
    );
  }

  /* OTP Verification Page */
  const displayPhone = pendingVendor?.phone || phone;
  const displayProvider = pendingVendor?.payoutProvider || 'MTN MoMo';

  return (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#5433FF] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#5433FF]/25">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-[#13112B]">
          {isFr ? 'Confirmez votre identité' : 'Verify Your Identity'}
        </h1>
        <p className="text-xs text-[#4B4869] mt-1">
          {pendingVendor
            ? isFr
              ? `Finalisez la création de « ${pendingVendor.shopName} » avec le code envoyé au :`
              : `Complete setup for "${pendingVendor.shopName}" with the code sent to:`
            : isFr
              ? 'Un code de sécurité à 6 chiffres a été envoyé par SMS et WhatsApp au :'
              : 'A 6-digit security code was sent via SMS & WhatsApp to:'}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white border border-[#ECEAF6] px-4 py-2 text-xs font-bold text-[#13112B]">
          <span>BJ +229 {displayPhone}</span>
          <span className="rounded-md bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 text-[10px]">
            {displayProvider}
          </span>
        </div>
      </div>

      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-4 text-left">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#13112B]">
            {isFr ? 'Code de sécurité' : 'Security Code'}
          </span>
          <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-0.5 font-bold">
            {isFr ? 'Valide 10 min' : 'Valid 10 min'}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                setOtpDigits((prev) => prev.map((d, i) => (i === idx ? val : d)));
                if (val && idx < 5) {
                  otpRefs.current[idx + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digit && idx > 0) {
                  otpRefs.current[idx - 1]?.focus();
                }
              }}
              className={`h-13 rounded-2xl border text-center text-xl font-extrabold font-mono outline-none transition-colors ${
                digit
                  ? 'bg-[#F8F7FC] border-[#5433FF] text-[#13112B]'
                  : 'bg-[#F5F5FA] border-[#E5E2F5] text-[#13112B] focus:border-[#5433FF]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setOtpDigits(['4', '8', '1', '9', '7', '2'])}
            className="font-bold text-[#5433FF] hover:underline"
          >
            {isFr ? 'Remplissage automatique (481972)' : 'Auto-fill code (481972)'}
          </button>
          <span className="font-mono font-bold text-[#5433FF]">
            00:{String(countdown).padStart(2, '0')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setCountdown(45);
            onShowToast(
              isFr
                ? 'Code OTP renvoyé gratuitement sur WhatsApp Business'
                : 'OTP code resent free via WhatsApp Business'
            );
          }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] py-2.5 text-xs font-bold min-h-[42px]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {isFr
              ? 'Recevoir le code par WhatsApp (GRATUIT)'
              : 'Get code via WhatsApp (FREE)'}
          </span>
        </button>
      </section>

      <div className="rounded-2xl bg-[#F5EFE6] border border-[#EADBC8] p-4 text-left text-xs text-[#5C4B3B]">
        <p className="font-bold text-[#78350F]">
          {isFr ? 'Protection Anti-Fraude & BCEAO' : 'Anti-Fraud & BCEAO Protection'}
        </p>
        <p className="mt-1 leading-relaxed">
          {isFr
            ? 'Ne partagez jamais ce code. Les agents MINI-B ne vous demanderont jamais votre code OTP ni votre code secret MTN MoMo ou Moov Money.'
            : 'Never share this code. MINI-B staff will never ask for your OTP or your MTN MoMo / Moov Money PIN.'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (otpDigits.some((d) => !d)) {
            onShowToast(
              isFr
                ? 'Veuillez entrer les 6 chiffres ou cliquer sur Remplissage automatique.'
                : 'Please enter all 6 digits or tap Auto-fill code.'
            );
            return;
          }
          if (pendingVendor) {
            onCompleteOnboarding(pendingVendor);
            setPendingVendor(null);
            return;
          }
          const cleanInput = phone.replace(/\D/g, '');
          const cleanRegistered = (registeredPhone || '').replace(/\D/g, '');
          if (cleanInput === '97001234' || (!cleanRegistered && cleanInput !== cleanRegistered)) {
            onSignInExisting?.();
          }
          onShowToast(
            isFr ? 'Identité vérifiée · Bienvenue sur votre Hub !' : 'Identity verified · Welcome to your Hub!'
          );
          onNavigate('hub');
        }}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold min-h-[48px]"
      >
        <span>
          {pendingVendor
            ? isFr
              ? 'Valider et Ouvrir ma Boutique'
              : 'Verify & Launch My Store'
            : isFr
              ? 'Valider et Continuer'
              : 'Verify & Continue'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
