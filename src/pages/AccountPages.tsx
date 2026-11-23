import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Headphones,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Store,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Lang, PageId, Product, Review, StoreSettings, TeamMember } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { trProduct, trSeed, trTeamMember } from '../data/i18n';
import { AvatarBadge, getInitials, ProductVisual } from '../components/VisualAssets';
import { PWAInstallButton } from '../components/PWAComponents';

/* 1. TEAM MANAGEMENT */
interface TeamPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  team: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onShowToast: (msg: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  lang,
  vendorMode,
  settings,
  team,
  onAddMember,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+229 97 ');
  const [rolePreset, setRolePreset] = useState<'Caissier' | 'Livreur' | 'Support'>('Caissier');

  const localizedTeam = team.map((m) => trTeamMember(m, lang));
  const filtered = localizedTeam.filter(
    (m) =>
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const initials = name
      .trim()
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    onAddMember({
      id: `tm-${Date.now()}`,
      name: name.trim(),
      initials: initials || 'MB',
      roleTitle:
        rolePreset === 'Caissier'
          ? 'Caissier & Vente directe'
          : rolePreset === 'Livreur'
            ? 'Livreur Interne & Dispatch'
            : 'Support Client & WhatsApp',
      phone,
      status: 'ACTIF',
      permissions:
        rolePreset === 'Caissier'
          ? ['Impression Tickets', 'Encaissement']
          : rolePreset === 'Livreur'
            ? ['Remise aux clients', 'Synchronisation Gozem']
            : ['Discussion Clientèle', 'Création paniers'],
      noWithdrawal: true,
      description: `Profil ${rolePreset} · Retraits MoMo bloqués`,
    });
    setName('');
    setShowAdd(false);
    onShowToast(
      isFr ? 'Collaborateur ajouté avec succès !' : 'Team member added successfully!'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#13112B]">
            {isFr ? "Gestion d'Équipe & Rôles" : 'Team & Roles Management'}
          </h1>
          <p className="text-xs text-[#7C7998]">
            {isFr
              ? `Accès & Rôles Sécurisés · ${team.length} actifs`
              : `Secured Access & Roles · ${team.length} active`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-4 py-2.5 text-xs font-bold min-h-[42px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isFr ? 'Ajouter' : 'Add'}</span>
        </button>
      </div>

      {/* Security Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-[#5B3BFF] to-[#3715C9] text-white p-5 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#34D399]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold">
            {isFr ? 'Coffre Mobile Money protégé' : 'Protected Mobile Money Vault'}
          </h2>
          <p className="text-xs text-white/85 mt-1 leading-relaxed">
            {isFr
              ? 'Attribuez des rôles stricts pour sécuriser votre caisse et vos fonds MTN MoMo, Moov Money et Celtiis Cash. Seul le gérant principal peut débloquer les retraits.'
              : 'Assign strict role permissions to safeguard your cash register and MTN MoMo, Moov Money, and Celtiis Cash funds. Only the store owner can authorize withdrawals.'}
          </p>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-2xl bg-white border border-[#ECEAF6] px-4 py-2.5">
        <Search className="w-4 h-4 text-[#7C7998]" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            isFr ? 'Rechercher par nom ou numéro MoMo...' : 'Search by name or MoMo number...'
          }
          className="w-full bg-transparent text-xs font-medium text-[#13112B] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filtered.map((member) => (
          <article key={member.id} className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarBadge
                  initials={member.initials}
                  tone={member.status === 'PROPRIÉTAIRE' ? 'purple' : 'emerald'}
                  online
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#13112B] truncate">{member.name}</h3>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                        member.status === 'PROPRIÉTAIRE'
                          ? 'bg-[#5433FF] text-white'
                          : member.status === 'ACTIF'
                            ? 'bg-[#ECFDF5] text-[#059669]'
                            : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {trSeed(member.status, lang)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#5433FF] truncate">{member.roleTitle}</p>
                  <p className="text-[11px] text-[#7C7998]">{member.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {member.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded-lg bg-[#F5F5FA] border border-[#ECEAF6] px-2.5 py-1 text-[11px] font-semibold text-[#13112B]"
                >
                  ✓ {perm}
                </span>
              ))}
              {member.noWithdrawal && (
                <span className="rounded-lg bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-bold text-[#DC2626]">
                  {isFr ? 'Sans Retrait MoMo' : 'No MoMo Payouts'}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Role Presets & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
          <h2 className="text-sm font-bold text-[#13112B]">
            {isFr ? "Profils d'accès prédéfinis" : 'Preset Access Profiles'}
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {(
              [
                {
                  key: 'Caissier' as const,
                  title: isFr ? 'Caissier' : 'Cashier',
                  sub: isFr ? 'Vente directe' : 'Point of sale',
                },
                {
                  key: 'Livreur' as const,
                  title: isFr ? 'Livreur' : 'Rider',
                  sub: isFr ? 'Colis & Run' : 'Parcel & Dispatch',
                },
                {
                  key: 'Support' as const,
                  title: 'Support',
                  sub: isFr ? 'Relation Client' : 'Customer Care',
                },
              ]
            ).map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setRolePreset(r.key);
                  setShowAdd(true);
                }}
                className={`rounded-2xl p-3 text-center transition-colors ${
                  r.key === 'Livreur'
                    ? 'bg-[#5433FF] text-white'
                    : 'bg-[#F5F5FA] hover:bg-[#F0EDFF] text-[#13112B]'
                }`}
              >
                <p className="text-xs font-extrabold">{r.title}</p>
                <p className={`text-[10px] mt-0.5 ${r.key === 'Livreur' ? 'text-white/80' : 'text-[#7C7998]'}`}>
                  {r.sub}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#13112B]">
              {isFr ? "Dernières actions de l'équipe" : 'Recent Team Activity'}
            </h2>
            <span className="text-[11px] font-bold text-[#059669]">
              {isFr ? 'En direct' : 'Live'}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {vendorMode === 'existing' ? (
              <>
                <p className="text-[#4B4869]">
                  <strong>Amina Bio</strong> ·{' '}
                  {isFr ? 'A ajusté le stock : HP Pavilion 15' : 'Updated stock: HP Pavilion 15'} ·{' '}
                  <span className="text-[#7C7998]">{isFr ? 'Il y a 12 min' : '12m ago'}</span>
                </p>
                <p className="text-[#4B4869]">
                  <strong>Gildas Akodjènou</strong> ·{' '}
                  {isFr ? 'Colis #MB-9040 pris en charge' : 'Picked up parcel #MB-9040'} ·{' '}
                  <span className="text-[#7C7998]">{isFr ? 'Il y a 34 min' : '34m ago'}</span>
                </p>
                <p className="text-[#4B4869]">
                  <strong>Koffi Mensah</strong> ·{' '}
                  {isFr ? 'Plafonds MoMo vérifiés' : 'Verified MoMo payout limits'} ·{' '}
                  <span className="text-[#7C7998]">{isFr ? 'Hier 18:40' : 'Yesterday 18:40'}</span>
                </p>
              </>
            ) : (
              <p className="text-[#4B4869]">
                <strong>{settings.managerName}</strong> ·{' '}
                {isFr
                  ? `Boutique « ${settings.shopName} » activée`
                  : `Store "${settings.shopName}" activated`}{' '}
                · <span className="text-[#7C7998]">{isFr ? "Aujourd'hui" : 'Today'}</span>
              </p>
            )}
          </div>
        </section>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112B]/50 p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-3xl bg-white p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#13112B]">
                {isFr ? 'Nouveau Collaborateur' : 'New Team Member'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5FA] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">
                {isFr ? 'Nom complet' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isFr ? 'ex. Sèdjro Dossou' : 'e.g. Sèdjro Dossou'}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">
                {isFr ? 'Téléphone WhatsApp' : 'WhatsApp Phone'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B4869] mb-1">
                {isFr ? "Rôle d'accès" : 'Access Role'}
              </label>
              <select
                value={rolePreset}
                onChange={(e) => setRolePreset(e.target.value as 'Caissier' | 'Livreur' | 'Support')}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-semibold"
              >
                <option value="Caissier">
                  {isFr ? 'Caissier (Sans Retrait MoMo)' : 'Cashier (No MoMo Payouts)'}
                </option>
                <option value="Livreur">
                  {isFr ? 'Livreur (Colis & Gozem)' : 'Rider (Parcels & Gozem)'}
                </option>
                <option value="Support">
                  {isFr ? 'Support Client & WhatsApp' : 'Customer Support & WhatsApp'}
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#5433FF] text-white py-3 text-sm font-bold"
            >
              {isFr ? "Ajouter à l'équipe" : 'Add to Team'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* 2. STOREFRONT EDITOR */
interface StorefrontPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  products: Product[];
  reviews: Review[];
  onSaveSettings: (next: StoreSettings) => void;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

export const StorefrontPage: React.FC<StorefrontPageProps> = ({
  lang,
  vendorMode,
  settings,
  products,
  reviews,
  onSaveSettings,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [form, setForm] = useState<StoreSettings>(settings);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const colors = ['#5433FF', '#2563EB', '#059669', '#78350F', '#1E293B'];
  const featuredProducts = products.slice(0, 2).map((p) => trProduct(p, lang));
  const storeSlug =
    form.shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'ma-boutique';
  const reviewCount = vendorMode === 'existing' ? Math.max(128, reviews.length) : reviews.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
        <span className="font-bold text-[#065F46] truncate">
          {isFr
            ? `● Vitrine publique active · mini-b.bj/${storeSlug}`
            : `● Public Storefront Live · mini-b.bj/${storeSlug}`}
        </span>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-bold text-[#5433FF] shadow-2xs shrink-0"
        >
          <span>{isFr ? 'Aperçu client' : 'Buyer preview'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Storefront Hero Banner */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] overflow-hidden">
        <div
          className="h-28 w-full relative flex items-end p-4"
          style={{ background: `linear-gradient(135deg, ${form.accentColor}, #13112B)` }}
        >
          <span className="rounded-lg bg-white/90 text-[#13112B] px-2.5 py-1 text-[11px] font-bold">
            {reviewCount > 0
              ? `★ 4.9 (${reviewCount} ${isFr ? 'avis Cotonou' : 'Cotonou reviews'})`
              : isFr
                ? '★ Nouveau Vendeur MINI-B'
                : '★ New MINI-B Seller'}
          </span>
        </div>
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AvatarBadge
              initials={getInitials(form.shopName)}
              tone="purple"
              online={form.isOpen}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#13112B]">{form.shopName}</h1>
                <span className="rounded-md bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[11px] font-bold">
                  {isFr ? '✓ Vérifié Officiel' : '✓ Official Verified'}
                </span>
              </div>
              <p className="text-xs text-[#7C7998] mt-0.5">{form.slogan}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#13112B]">
              {isFr ? "Identité de l'enseigne" : 'Storefront Identity'}
            </h2>
            <span className="text-[11px] font-bold text-[#059669]">Public</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4B4869] mb-1">
              {isFr ? 'Nom public de la boutique' : 'Public Store Name'}
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4B4869] mb-1">
              {isFr ? 'Slogan ou Description courte' : 'Tagline or Short Bio'}
            </label>
            <textarea
              rows={3}
              value={form.slogan}
              onChange={(e) => setForm({ ...form, slogan: e.target.value })}
              className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] p-3 text-xs leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4B4869] mb-1">
              {isFr ? 'Emplacement physique / Showroom' : 'Physical Address / Showroom'}
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4B4869] mb-1">
              {isFr ? 'Contact WhatsApp Commercial' : 'Business WhatsApp Number'}
            </label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2.5 text-sm font-bold"
            />
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[#13112B]">
                  {isFr ? "Horaires d'ouverture" : 'Opening Hours'}
                </h2>
                <p className="text-xs text-[#7C7998]">
                  {isFr ? 'Affichés aux acheteurs sur MINI-B' : 'Shown to buyers on MINI-B'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isOpen}
                onClick={() => setForm({ ...form, isOpen: !form.isOpen })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  form.isOpen ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    form.isOpen ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="font-bold text-[#13112B]">
                {isFr ? '● Lundi – Samedi' : '● Monday – Saturday'}
              </span>
              <span className="font-extrabold text-[#5433FF]">{form.weekdayHours}</span>
            </div>
            <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="font-bold text-[#13112B]">{isFr ? 'Dimanche' : 'Sunday'}</span>
              <span className="font-bold text-[#4B4869]">{form.sundayHours}</span>
            </div>
          </section>

          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-[#13112B]">
              {isFr ? "Couleur d'accentuation" : 'Brand Accent Color'}
            </h2>
            <div className="flex items-center gap-3">
              {colors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setForm({ ...form, accentColor: hex })}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                    form.accentColor === hex ? 'ring-2 ring-offset-2 ring-[#5433FF] scale-105' : ''
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={`${isFr ? 'Couleur' : 'Color'} ${hex}`}
                >
                  {form.accentColor === hex && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#13112B]">
                {isFr ? 'Mise en avant boutique' : 'Storefront Highlights'}
              </h2>
              <span className="text-xs text-[#7C7998]">
                {featuredProducts.length}{' '}
                {isFr ? 'article(s) épinglé(s)' : 'pinned item(s)'}
              </span>
            </div>
            {featuredProducts.length === 0 ? (
              <div className="rounded-2xl bg-[#F8F7FC] p-4 text-center space-y-2">
                <p className="text-xs text-[#7C7998]">
                  {isFr
                    ? 'Aucun produit dans votre catalogue pour l’instant.'
                    : 'No products in your catalog yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('add-product')}
                  className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-1.5 text-xs font-bold"
                >
                  {isFr ? '+ Ajouter un produit' : '+ Add first product'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.map((p) => (
                  <div key={p.id} className="rounded-2xl bg-[#F8F7FC] p-3 space-y-1.5">
                    <ProductVisual
                      type={p.visualType}
                      imageUrl={p.imageUrl}
                      alt={p.name}
                      className="w-full h-20"
                    />
                    <p className="text-xs font-bold text-[#13112B] truncate">{p.name}</p>
                    <p className="text-xs font-extrabold text-[#5433FF] tabular-nums">
                      {formatFCFA(p.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            onSaveSettings(form);
            onShowToast(
              isFr
                ? 'Modifications de la vitrine enregistrées !'
                : 'Storefront changes saved!'
            );
          }}
          className="flex-1 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-bold min-h-[48px]"
        >
          {isFr ? 'Enregistrer les modifications' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(`https://mini-b.bj/${storeSlug}`);
            onShowToast(
              isFr ? 'Lien vitrine WhatsApp copié !' : 'Storefront WhatsApp link copied!'
            );
          }}
          className="rounded-2xl bg-white border border-[#E5E2F5] hover:bg-[#F5F5FA] text-[#5433FF] px-5 py-3.5 text-sm font-bold min-h-[48px]"
        >
          {isFr ? 'Partager le lien vitrine WhatsApp' : 'Share Storefront on WhatsApp'}
        </button>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#13112B]/55 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#13112B]">
                {isFr ? 'Aperçu Acheteur MINI-B' : 'MINI-B Buyer Preview'}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5FA] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="rounded-2xl p-4 text-white"
              style={{ backgroundColor: form.accentColor }}
            >
              <p className="text-base font-extrabold">{form.shopName}</p>
              <p className="text-xs text-white/85 mt-1">{form.slogan}</p>
              <p className="text-[11px] mt-2 font-semibold">
                {form.isOpen
                  ? isFr
                    ? '● Ouvert maintenant'
                    : '● Open now'
                  : isFr
                    ? '○ Fermé'
                    : '○ Closed'}{' '}
                · {form.address}
              </p>
            </div>
            {featuredProducts.length === 0 ? (
              <div className="rounded-xl border border-[#ECEAF6] p-4 text-center text-xs text-[#7C7998]">
                {isFr
                  ? 'Aucun produit publié pour le moment.'
                  : 'No published products yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {featuredProducts.map((p) => (
                  <div key={p.id} className="rounded-xl border border-[#ECEAF6] p-2.5">
                    <ProductVisual
                      type={p.visualType}
                      imageUrl={p.imageUrl}
                      alt={p.name}
                      className="w-full h-16 mb-2"
                    />
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className="text-xs font-extrabold text-[#5433FF]">{formatFCFA(p.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* 3. KYC VERIFICATION */
export const KycPage: React.FC<{
  lang: Lang;
  vendorMode: 'existing' | 'new';
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
}> = ({ lang, vendorMode, settings, onShowToast }) => {
  const isFr = lang === 'fr';
  const [ifuNumber, setIfuNumber] = useState(
    settings.ifuNumber || (vendorMode === 'existing' ? '0202311894520' : '')
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const progress =
    vendorMode === 'existing'
      ? submitted
        ? 100
        : uploadedFile
          ? 95
          : 75
      : submitted
        ? 85
        : uploadedFile
          ? 65
          : 35;

  const docs =
    vendorMode === 'existing'
      ? isFr
        ? [
            {
              title: "Pièce d'Identité Officielle (CIP / CNI)",
              sub: 'N° 1094829103 · Certificat ANIP Bénin',
              file: 'cip_koffi_mensah_recto_verso.pdf',
              status: 'Validé',
              pending: false,
            },
            {
              title: 'Registre de Commerce (RCCM)',
              sub: 'RB/COT/23-A-1094 · Tribunal de Commerce de Cotonou',
              file: 'RCCM_KoffiTechHub_2023.pdf',
              status: 'Greffe Certifié',
              pending: false,
            },
            {
              title: 'Biométrie Faciale en Direct',
              sub: 'Reconnaissance de vivacité certifiée',
              file: 'Selfie biométrique vérifié',
              status: 'Validé',
              pending: false,
            },
          ]
        : [
            {
              title: 'Official National ID (CIP / CNI)',
              sub: 'No. 1094829103 · Benin ANIP Certificate',
              file: 'cip_koffi_mensah_front_back.pdf',
              status: 'Verified',
              pending: false,
            },
            {
              title: 'Trade Register (RCCM)',
              sub: 'RB/COT/23-A-1094 · Cotonou Commercial Court',
              file: 'RCCM_KoffiTechHub_2023.pdf',
              status: 'Registry Certified',
              pending: false,
            },
            {
              title: 'Live Facial Biometrics',
              sub: 'Certified liveness verification',
              file: 'Verified biometric selfie',
              status: 'Verified',
              pending: false,
            },
          ]
      : isFr
        ? [
            {
              title: 'Téléphone & WhatsApp Marchand',
              sub: `${settings.whatsapp} · OTP SMS confirmé`,
              file: `Compte ${settings.payoutProvider || 'MoMo'} vérifié`,
              status: 'Validé',
              pending: false,
            },
            {
              title: "Pièce d'Identité Officielle (CIP / CNI)",
              sub: `Titulaire : ${settings.managerName}`,
              file: 'À téléverser pour passer au Tier 2',
              status: 'En attente',
              pending: true,
            },
            {
              title: 'Registre de Commerce (RCCM)',
              sub: settings.shopName,
              file: 'Optionnel pour vendeurs individuels',
              status: 'Optionnel',
              pending: true,
            },
          ]
        : [
            {
              title: 'Merchant Phone & WhatsApp',
              sub: `${settings.whatsapp} · SMS OTP verified`,
              file: `${settings.payoutProvider || 'MoMo'} account verified`,
              status: 'Verified',
              pending: false,
            },
            {
              title: 'Official National ID (CIP / CNI)',
              sub: `Owner: ${settings.managerName}`,
              file: 'Upload required to unlock Tier 2',
              status: 'Pending',
              pending: true,
            },
            {
              title: 'Trade Register (RCCM)',
              sub: settings.shopName,
              file: 'Optional for solo merchants',
              status: 'Optional',
              pending: true,
            },
          ];

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] to-[#3715C9] text-white p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold">
            {vendorMode === 'existing'
              ? isFr
                ? 'Tier 3 Marchand UEMOA'
                : 'WAEMU Tier 3 Merchant'
              : isFr
                ? 'Tier 1 Nouveau Marchand'
                : 'Tier 1 New Merchant'}
          </span>
          <span className="text-xl font-extrabold font-mono tabular-nums">{progress}%</span>
        </div>
        <h1 className="text-lg sm:text-xl font-extrabold">
          {isFr ? "Vérification d'Identité & Conformité" : 'Identity Verification & Compliance'}
        </h1>
        <p className="text-xs text-white/85">
          {isFr
            ? "Complétez les 4 étapes légales pour lever les plafonds de retrait jusqu'à 5 000 000 FCFA/jour."
            : 'Complete all 4 legal steps to raise your daily payout limit up to 5,000,000 FCFA/day.'}
        </p>
        <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-[#34D399] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-[#13112B]">
            {isFr ? 'Plafond Actuel :' : 'Current Daily Limit:'}{' '}
            {submitted
              ? isFr
                ? '5 000 000 FCFA / jour'
                : '5,000,000 FCFA / day'
              : vendorMode === 'existing'
                ? isFr
                  ? '1 000 000 FCFA / jour'
                  : '1,000,000 FCFA / day'
                : isFr
                  ? '250 000 FCFA / jour'
                  : '250,000 FCFA / day'}
          </h2>
          <p className="text-xs text-[#4B4869] mt-0.5">
            {isFr
              ? 'La validation de votre Attestation IFU et RIB MoMo débloque les virements illimités.'
              : 'Verifying your IFU tax ID and MoMo account unlocks high-volume instant transfers.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div key={doc.title} className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#13112B]">{doc.title}</h3>
                <p className="text-xs text-[#7C7998] mt-0.5">{doc.sub}</p>
              </div>
              <span
                className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${
                  doc.pending ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#ECFDF5] text-[#059669]'
                }`}
              >
                {doc.pending ? doc.status : `✓ ${doc.status}`}
              </span>
            </div>
            <div className="rounded-xl bg-[#F8F7FC] px-3 py-2 text-xs font-medium text-[#4B4869] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5433FF]" />
              <span className="truncate">{doc.file}</span>
            </div>
          </div>
        ))}

        {/* Step 4 Interactive Upload */}
        <div className="rounded-3xl bg-white border border-[#5433FF]/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#13112B]">
                {isFr
                  ? 'Numéro IFU Bénin (13 chiffres) & RIB MoMo'
                  : 'Benin Tax IFU (13 digits) & MoMo Statement'}
              </h3>
              <p className="text-xs text-[#7C7998]">
                {isFr ? "Attestation d'immatriculation fiscale DGI" : 'DGI tax registration certificate'}
              </p>
            </div>
            <span
              className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${
                submitted ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'
              }`}
            >
              {submitted ? (isFr ? 'Soumis (24h)' : 'Submitted (24h)') : isFr ? 'Requis' : 'Required'}
            </span>
          </div>

          <input
            type="text"
            value={ifuNumber}
            onChange={(e) => setIfuNumber(e.target.value)}
            className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2.5 text-sm font-mono font-bold text-[#13112B]"
          />

          <label className="block rounded-2xl bg-[#F5F4FF] border border-dashed border-[#B7A9FB] p-4 text-center cursor-pointer hover:bg-[#ECE8FF] transition-colors">
            <Upload className="w-5 h-5 text-[#5433FF] mx-auto mb-1" />
            <p className="text-xs font-bold text-[#13112B]">
              {uploadedFile
                ? isFr
                  ? `Fichier prêt : ${uploadedFile}`
                  : `File ready: ${uploadedFile}`
                : isFr
                  ? "Téléverser l'attestation IFU / MoMo (PDF/JPG)"
                  : 'Upload IFU / MoMo document (PDF/JPG)'}
            </p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setUploadedFile(f.name);
              }}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setSubmitted(true);
              onShowToast(
                isFr
                  ? 'Dossier IFU/KYC soumis pour validation express sous 24h !'
                  : 'IFU/KYC file submitted for 24h express review!'
              );
            }}
            className="w-full rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3 text-xs font-bold min-h-[44px]"
          >
            {submitted
              ? isFr
                ? 'Dossier en cours de validation ✓'
                : 'Application under review ✓'
              : isFr
                ? 'Soumettre pour validation express (24h)'
                : 'Submit for 24h Express Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* 4. 24/7 SUPPORT */
export const SupportPage: React.FC<{ lang: Lang; onShowToast: (msg: string) => void }> = ({
  lang,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = (
    isFr
      ? [
          {
            q: 'Quand mes fonds sous séquestre sont-ils libérés ?',
            a: 'Dès que le livreur Gozem ou le client scanne le code QR de validation ou saisit le PIN dans l’application, le séquestre est déverrouillé en moins de 2h.',
          },
          {
            q: 'Comment contester un avis client abusif ?',
            a: 'Ouvrez Avis & Réputation, cliquez sur l’avis concerné et signalez-le à notre équipe de médiation Ganhi avec la preuve de livraison.',
          },
          {
            q: 'Quels sont les frais de retrait vers MTN ou Moov ?',
            a: '0% de frais réseau MINI-B pour tous les vendeurs vérifiés Tier 2 et Tier 3 au Bénin.',
          },
          {
            q: 'Comment générer la facture normalisée e-MECeF ?',
            a: 'Chaque commande payée génère automatiquement un bordereau compatible DGI/e-MECeF téléchargeable depuis la fiche Expédition.',
          },
        ]
      : [
          {
            q: 'When are my escrow funds released?',
            a: 'As soon as the Gozem rider or buyer scans the handover QR code or confirms the PIN in the app, escrow unlocks within 2 hours.',
          },
          {
            q: 'How can I dispute an unfair customer review?',
            a: 'Open Reviews & Reputation, select the review, and flag it to our Ganhi mediation desk along with your delivery proof.',
          },
          {
            q: 'What are the withdrawal fees to MTN MoMo or Moov?',
            a: '0% MINI-B network fee for all verified Tier 2 and Tier 3 merchants in Benin.',
          },
          {
            q: 'How do I generate a standardized e-MECeF invoice?',
            a: 'Every paid order automatically generates a DGI/e-MECeF compatible shipping slip downloadable from the Dispatch screen.',
          },
        ]
  ).filter((f) => !query.trim() || f.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-gradient-to-br from-[#5B3BFF] to-[#3715C9] text-white p-5 sm:p-6 space-y-4">
        <span className="inline-block rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-bold">
          {isFr ? '● ASSISTANCE VENDEUR 24/7 COTONOU' : '● 24/7 MERCHANT SUPPORT COTONOU'}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-balance">
          {isFr
            ? "Besoin d'aide pour vos ventes ou vos retraits ?"
            : 'Need help with your orders or payouts?'}
        </h1>
        <p className="text-xs text-white/85">
          {isFr
            ? 'Nos conseillers marchands basés à Ganhi vous accompagnent pour vos livraisons Gozem et fonds Mobile Money.'
            : 'Our Ganhi-based merchant specialists assist you with Gozem deliveries and Mobile Money settlements.'}
        </p>

        <div className="flex items-center gap-2 rounded-2xl bg-white text-[#13112B] px-3.5 py-2.5">
          <Search className="w-4 h-4 text-[#7C7998]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isFr
                ? 'Rechercher un problème (ex. Gozem, IFU, MoMo)...'
                : 'Search an issue (e.g. Gozem, IFU, MoMo)...'
            }
            className="w-full bg-transparent text-xs font-medium outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() =>
              onShowToast(
                isFr
                  ? 'Connexion au Conseiller Pro WhatsApp (~3 min)...'
                  : 'Connecting to Pro WhatsApp Advisor (~3 min)...'
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#34D399] hover:bg-[#10B981] text-[#064E3B] py-3 text-xs font-extrabold min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {isFr ? 'WhatsApp Conseiller Pro (~3 min)' : 'Pro WhatsApp Advisor (~3 min)'}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              onShowToast(
                isFr
                  ? 'Appel Ligne Marchands +229 21 00 XX XX...'
                  : 'Calling Merchant Hotline +229 21 00 XX XX...'
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white py-3 text-xs font-bold min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            <span>
              {isFr ? 'Ligne Marchands (+229 21 00 XX XX)' : 'Merchant Desk (+229 21 00 XX XX)'}
            </span>
          </button>
        </div>
      </section>

      {/* Dedicated Advisor */}
      <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <AvatarBadge initials="AM" tone="emerald" online size="md" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#13112B] truncate">
              {isFr ? "Amina de l'équipe MINI-B" : 'Amina from MINI-B Team'}{' '}
              <span className="text-xs font-semibold text-[#5433FF]">
                · {isFr ? 'En poste' : 'On duty'}
              </span>
            </p>
            <p className="text-xs text-[#7C7998] truncate">
              {isFr
                ? "« Je surveille vos expéditions Gozem aujourd'hui à Cotonou. »"
                : '"I am monitoring your Gozem dispatches in Cotonou today."'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            onShowToast(isFr ? 'Ticket envoyé directement à Amina' : 'Message sent directly to Amina')
          }
          className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-2 text-xs font-bold shrink-0"
        >
          {isFr ? 'Écrire' : 'Message'}
        </button>
      </div>

      {/* FAQ Accordion */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-2.5">
        <h2 className="text-sm font-extrabold text-[#13112B] mb-2">
          {isFr ? 'Questions fréquentes (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h2>
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={faq.q} className="rounded-2xl bg-[#F8F7FC] border border-[#ECEAF6] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left text-xs font-bold text-[#13112B]"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 text-xs text-[#4B4869] leading-relaxed">{faq.a}</div>
              )}
            </div>
          );
        })}
      </section>

      {/* Network Health + Physical Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#13112B]">
              {isFr ? 'Tous les systèmes opérationnels' : 'All Systems Operational'}
            </span>
            <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[11px] font-bold">
              99.98% uptime
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-xl bg-[#F8F7FC] p-2.5">
              <p className="font-bold text-[#059669]">● MTN MoMo</p>
              <p className="text-[#7C7998]">{isFr ? 'Instantané (<8s)' : 'Instant (<8s)'}</p>
            </div>
            <div className="rounded-xl bg-[#F8F7FC] p-2.5">
              <p className="font-bold text-[#059669]">● Moov Money</p>
              <p className="text-[#7C7998]">{isFr ? 'Normal (<12s)' : 'Normal (<12s)'}</p>
            </div>
            <div className="rounded-xl bg-[#F8F7FC] p-2.5">
              <p className="font-bold text-[#059669]">● API Gozem</p>
              <p className="text-[#7C7998]">{isFr ? 'Dispatch actif' : 'Dispatch active'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#ECEAF6] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Maison des Marchands MINI-B' : 'MINI-B Merchant Hub Office'}
              </p>
              <p className="text-[11px] text-[#7C7998]">
                {isFr ? 'Immeuble Ganhi, Av. Clozel, Cotonou' : 'Ganhi Building, Av. Clozel, Cotonou'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onShowToast(
                isFr ? 'Coordonnées Ganhi Cotonou ouvertes' : 'Ganhi Cotonou directions opened'
              )
            }
            className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-2 text-xs font-bold shrink-0"
          >
            {isFr ? 'Itinéraire' : 'Directions'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* 5. MENU & SETTINGS */
interface MenuSettingsPageProps {
  lang: Lang;
  vendorMode: 'existing' | 'new';
  hideBalance?: boolean;
  onToggleHideBalance?: () => void;
  onToggleLang: (lang: Lang) => void;
  settings: StoreSettings;
  onUpdateSettings: (next: StoreSettings) => void;
  onNavigate: (page: PageId) => void;
  onResetDemo?: () => void;
  onShowToast: (msg: string) => void;
}

export const MenuSettingsPage: React.FC<MenuSettingsPageProps> = ({
  lang,
  vendorMode,
  hideBalance = false,
  onToggleHideBalance,
  onToggleLang,
  settings,
  onUpdateSettings,
  onNavigate,
  onResetDemo,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const quickModules: { id: PageId; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'storefront', title: isFr ? 'Ma Boutique' : 'Storefront', icon: Store },
    { id: 'crm', title: isFr ? 'Clients & CRM' : 'Customers & CRM', icon: Users },
    { id: 'analytics', title: isFr ? 'Rapports & Ventes' : 'Sales Analytics', icon: BarChart3 },
    { id: 'marketing', title: isFr ? 'Marketing & Promos' : 'Marketing & Promos', icon: Megaphone },
    { id: 'reviews', title: isFr ? 'Avis & Réputation' : 'Reviews & Rating', icon: Star },
    { id: 'team', title: isFr ? "Gestion d'Équipe" : 'Team & Roles', icon: UserCheck },
    { id: 'kyc', title: isFr ? 'Identité & KYC' : 'KYC & Compliance', icon: ShieldCheck },
    { id: 'support', title: isFr ? 'Assistance 24/7' : '24/7 Support', icon: Headphones },
  ];

  return (
    <div className="space-y-4">
      {/* Merchant Profile Card */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-4">
        <div className="flex items-center gap-3.5">
          <AvatarBadge
            initials={getInitials(settings.managerName)}
            tone="purple"
            online={settings.isOpen}
            size="lg"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold text-[#13112B] truncate">
                {settings.shopName}
              </h1>
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            </div>
            <p className="text-xs text-[#4B4869]">
              {isFr ? 'Gérant:' : 'Manager:'} {settings.managerName}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <span className="rounded-md bg-[#F0EDFF] text-[#5433FF] px-2 py-0.5 text-[10px] font-bold font-mono">
                {vendorMode === 'existing' ? 'ID: #MB-COT-092' : 'ID: #MB-NEW-001'}
              </span>
              <span className="rounded-md bg-[#ECFDF5] text-[#059669] px-2 py-0.5 text-[10px] font-bold">
                {vendorMode === 'existing'
                  ? isFr
                    ? 'Tier 3 Marchand'
                    : 'Tier 3 Merchant'
                  : isFr
                    ? 'Tier 1 Nouveau Marchand'
                    : 'Tier 1 New Merchant'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#F8F7FC] p-3">
            <p className="text-[11px] text-[#7C7998]">{isFr ? 'Conformité' : 'Compliance'}</p>
            <p className="text-sm font-extrabold text-[#13112B]">
              {vendorMode === 'existing'
                ? isFr
                  ? '100% Vérifié'
                  : '100% Verified'
                : isFr
                  ? '35% · OTP OK'
                  : '35% · OTP OK'}
            </p>
          </div>
          <div className="rounded-2xl bg-[#F8F7FC] p-3">
            <p className="text-[11px] text-[#7C7998]">MoMo Payout</p>
            <p className="text-sm font-extrabold text-[#059669]">
              {isFr ? 'Instantané' : 'Instant'}
            </p>
          </div>
        </div>
      </section>

      {/* New Vendor Onboarding Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-[#5B3BFF] to-[#3715C9] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-md shadow-[#5433FF]/15">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold truncate">
              {isFr ? 'Nouveau Vendeur MINI-B ?' : 'New MINI-B Vendor?'}
            </h2>
            <p className="text-xs text-white/85 truncate">
              {isFr
                ? 'Créez un nouveau compte boutique vierge & configurez MoMo en 4 étapes'
                : 'Create a fresh store account & set up MoMo payouts in 4 steps'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(vendorMode === 'new' || settings.shopName !== 'Koffi Tech Hub Bénin') && onResetDemo && (
            <button
              type="button"
              onClick={onResetDemo}
              className="rounded-xl bg-white/15 hover:bg-white/25 text-white px-3 py-2 text-xs font-bold transition-colors"
            >
              {isFr ? 'Démo Koffi (existant)' : 'Koffi Demo (existing)'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="rounded-xl bg-white text-[#5433FF] hover:bg-[#F5F3FF] px-4 py-2 text-xs font-extrabold transition-colors min-h-[40px]"
          >
            {isFr ? 'Ouvrir une boutique' : 'Sign Up Store'}
          </button>
        </div>
      </section>

      {/* PWA Install Card */}
      <PWAInstallButton lang={lang} variant="banner" />

      {/* Mobile Hub Directory Grid */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C7998]">
          {isFr ? 'Tous les modules MINI-B' : 'All MINI-B Modules'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {quickModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="rounded-2xl bg-[#F8F7FC] hover:bg-[#F0EDFF] border border-[#ECEAF6] p-3 flex items-center gap-2.5 text-left transition-colors min-h-[48px]"
              >
                <Icon className="w-4 h-4 text-[#5433FF] shrink-0" />
                <span className="text-xs font-bold text-[#13112B] truncate">{mod.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Store & Sales */}
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <h2 className="text-sm font-extrabold text-[#13112B]">
            {isFr ? 'Boutique & Ventes' : 'Store & Sales'}
          </h2>

          <div className="rounded-2xl bg-[#F8F7FC] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#13112B]">
                {isFr ? "Langue de l'interface" : 'Interface Language'}
              </span>
              <span className="font-bold text-[#5433FF] uppercase">{lang}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleLang('fr')}
                className={`rounded-xl py-2 text-xs font-bold border ${
                  lang === 'fr'
                    ? 'bg-white border-[#5433FF] text-[#5433FF]'
                    : 'bg-transparent border-[#E5E2F5] text-[#4B4869]'
                }`}
              >
                🇧🇯 Français (UEMOA)
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`rounded-xl py-2 text-xs font-bold border ${
                  lang === 'en'
                    ? 'bg-white border-[#5433FF] text-[#5433FF]'
                    : 'bg-transparent border-[#E5E2F5] text-[#4B4869]'
                }`}
              >
                🌍 English (West Africa)
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-3 flex items-center justify-between text-xs">
            <span className="font-bold text-[#13112B]">
              {isFr ? "Devise d'affichage" : 'Display Currency'}
            </span>
            <span className="rounded-lg bg-[#F0EDFF] text-[#5433FF] px-2.5 py-1 font-bold">
              FCFA (XOF)
            </span>
          </div>

          <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Alertes Push & WhatsApp' : 'Push & WhatsApp Alerts'}
              </p>
              <p className="text-[11px] text-[#7C7998]">
                {isFr ? 'Commandes et crédits instantanés' : 'Instant orders & payout alerts'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.pushWhatsApp}
              onClick={() =>
                onUpdateSettings({ ...settings, pushWhatsApp: !settings.pushWhatsApp })
              }
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.pushWhatsApp ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.pushWhatsApp ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Boutique Ouverte' : 'Store Open'}
              </p>
              <p className="text-[11px] text-[#7C7998]">
                {isFr ? 'Vos clients peuvent passer commande' : 'Buyers can place orders now'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.isOpen}
              onClick={() => onUpdateSettings({ ...settings, isOpen: !settings.isOpen })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.isOpen ? 'bg-[#059669]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.isOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="rounded-3xl bg-white border border-[#ECEAF6] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#13112B]">
              {isFr ? 'Sécurité & Accès' : 'Security & Access'}
            </h2>
            <span className="text-xs font-bold text-[#059669]">
              {isFr ? 'MoMo Protégé' : 'MoMo Protected'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('otp')}
            className="w-full rounded-2xl bg-[#F8F7FC] hover:bg-[#F0EDFF] px-3.5 py-3 flex items-center justify-between text-left"
          >
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Code secret de retrait MoMo' : 'MoMo Withdrawal PIN'}
              </p>
              <p className="text-[11px] text-[#059669] font-semibold">
                {isFr ? 'Configuré · Modifié il y a 3j' : 'Configured · Updated 3d ago'}
              </p>
            </div>
            <span className="text-xs font-bold text-[#5433FF]">
              {isFr ? 'Vérifier OTP ›' : 'Verify OTP ›'}
            </span>
          </button>

          <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Biométrie (Face ID / Empreinte)' : 'Biometrics (Face ID / Fingerprint)'}
              </p>
              <p className="text-[11px] text-[#7C7998]">
                {isFr ? 'Déverrouillage rapide des encaissements' : 'Quick unlock for settlements'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.biometrics}
              onClick={() => onUpdateSettings({ ...settings, biometrics: !settings.biometrics })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.biometrics ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.biometrics ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {onToggleHideBalance && (
            <div className="rounded-2xl bg-[#F8F7FC] px-3.5 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#13112B]">
                  {isFr ? 'Masquer les soldes (Mode discret)' : 'Hide Balances (Privacy Mode)'}
                </p>
                <p className="text-[11px] text-[#7C7998]">
                  {isFr
                    ? 'Cache vos montants sur le Hub et le Portefeuille'
                    : 'Masks financial figures on Hub and Wallet'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hideBalance}
                onClick={onToggleHideBalance}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  hideBalance ? 'bg-[#5433FF]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hideBalance ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate('kyc')}
            className="w-full rounded-2xl bg-[#F8F7FC] hover:bg-[#F0EDFF] px-3.5 py-3 flex items-center justify-between text-left"
          >
            <div>
              <p className="text-xs font-bold text-[#13112B]">
                {isFr ? 'Statut Fiscal & RCCM' : 'Tax Status & RCCM'}
              </p>
              <p className="text-[11px] text-[#7C7998]">
                {vendorMode === 'existing'
                  ? isFr
                    ? 'IFU: 3201910488219 · APDP & DGI Bénin'
                    : 'IFU: 3201910488219 · APDP & DGI Benin'
                  : settings.ifuNumber
                    ? `IFU: ${settings.ifuNumber}`
                    : isFr
                      ? 'IFU à compléter · APDP & DGI Bénin'
                      : 'IFU pending · APDP & DGI Benin'}
              </p>
            </div>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                vendorMode === 'existing' || settings.ifuNumber
                  ? 'bg-[#ECFDF5] text-[#059669]'
                  : 'bg-[#FEF3C7] text-[#B45309]'
              }`}
            >
              {vendorMode === 'existing' || settings.ifuNumber
                ? isFr
                  ? 'VALIDE'
                  : 'VALID'
                : isFr
                  ? 'À COMPLÉTER'
                  : 'PENDING'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onShowToast(
                isFr
                  ? 'Session déconnectée · Choisissez une boutique'
                  : 'Signed out · Choose a store mode'
              );
              onNavigate('welcome');
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] py-3 text-xs font-bold min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span>{isFr ? 'Se déconnecter du Hub' : 'Sign out of Hub'}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
