import React from 'react';
import { Product } from '../types/app';

export const MiniBLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const boxClass =
    size === 'sm'
      ? 'h-8 w-[88px]'
      : size === 'lg'
        ? 'h-11 w-[132px]'
        : 'h-9 w-[104px]';
  const imgClass =
    size === 'sm'
      ? 'w-[88px] h-auto max-w-none'
      : size === 'lg'
        ? 'w-[132px] h-auto max-w-none'
        : 'w-[104px] h-auto max-w-none';

  return (
    <div className={`overflow-hidden flex items-center justify-center shrink-0 ${boxClass}`}>
      <img
        src="/assets/aistudio/image-removebg-preview_5a6d89d0.svg"
        alt="Mini-B Logo"
        className={`${imgClass} select-none`}
      />
    </div>
  );
};

export const PRODUCT_PHOTO_MAP: Record<Product['visualType'], string> = {
  'laptop-dell': '/src/assets/images/product_dell_xps_1795436849487.jpg',
  'laptop-hp': '/src/assets/images/product_hp_pavilion_1795436851020.jpg',
  backpack: '/src/assets/images/product_laptop_backpack_1795436850484.jpg',
  mouse: '/src/assets/images/product_wireless_mouse_1795436851864.jpg',
  monitor: '/src/assets/images/product_4k_monitor_1795436850967.jpg',
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MB';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const ProductVisual: React.FC<{
  type: Product['visualType'];
  imageUrl?: string;
  alt?: string;
  badge?: string;
  outOfStock?: boolean;
  className?: string;
}> = ({ type, imageUrl, alt, badge, outOfStock = false, className = 'w-16 h-16' }) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const photoSrc = imageUrl || PRODUCT_PHOTO_MAP[type];

  React.useEffect(() => {
    setImgFailed(false);
  }, [photoSrc]);

  return (
    <div
      className={`relative rounded-xl bg-[#F2F1FA] border border-[#E7E4F6] flex items-center justify-center overflow-hidden shrink-0 ${className}`}
    >
      {photoSrc && !imgFailed ? (
        <img
          src={photoSrc}
          alt={alt || type}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${outOfStock ? 'opacity-45 grayscale' : ''}`}
        />
      ) : (
        <>
          {type === 'laptop-dell' && (
            <svg viewBox="0 0 64 52" className="w-12 h-10" fill="none">
              <rect x="10" y="7" width="44" height="29" rx="3" fill="#1E1B4B" stroke="#4B4869" strokeWidth="1.5" />
              <rect x="13" y="10" width="38" height="23" rx="1.5" fill="url(#screenDell)" />
              <defs>
                <linearGradient id="screenDell" x1="13" y1="10" x2="51" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6D4AFF" />
                  <stop offset="0.6" stopColor="#38BDF8" />
                  <stop offset="1" stopColor="#EEF2FF" />
                </linearGradient>
              </defs>
              <path d="M4 37H60L56 43H8L4 37Z" fill="#D4D2E8" stroke="#A6A3C2" strokeWidth="1" />
              <rect x="26" y="38.5" width="12" height="2" rx="1" fill="#8C89AD" />
            </svg>
          )}
          {type === 'laptop-hp' && (
            <svg viewBox="0 0 64 52" className="w-12 h-10" fill="none">
              <rect x="10" y="7" width="44" height="29" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="13" y="10" width="38" height="23" rx="1.5" fill="url(#screenHp)" />
              <defs>
                <linearGradient id="screenHp" x1="13" y1="10" x2="51" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F472B6" />
                  <stop offset="0.5" stopColor="#FBBF24" />
                  <stop offset="1" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              <path d="M5 37H59L55 43H9L5 37Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          )}
          {type === 'backpack' && (
            <svg viewBox="0 0 56 56" className="w-11 h-11" fill="none">
              <path d="M22 10C22 7.5 24 6 28 6C32 6 34 7.5 34 10" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="14" y="11" width="28" height="36" rx="9" fill="#1F2433" />
              <rect x="18" y="25" width="20" height="16" rx="4" fill="#2D3347" stroke="#475569" strokeWidth="1" />
              <path d="M20 20H36" stroke="#5433FF" strokeWidth="2" strokeLinecap="round" />
              <rect x="33" y="31" width="3" height="6" rx="1" fill="#34D399" />
            </svg>
          )}
          {type === 'mouse' && (
            <svg viewBox="0 0 56 56" className="w-11 h-11" fill="none">
              <rect x="17" y="9" width="22" height="38" rx="11" fill="#2C3042" stroke="#475569" strokeWidth="1.5" />
              <path d="M28 9V23" stroke="#64748B" strokeWidth="1.2" />
              <rect x="26" y="14" width="4" height="7" rx="2" fill="#94A3B8" />
            </svg>
          )}
          {type === 'monitor' && (
            <svg viewBox="0 0 64 52" className="w-12 h-10" fill="none">
              <rect x="8" y="6" width="48" height="30" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
              <rect x="11" y="9" width="42" height="24" rx="1.5" fill="#4338CA" />
              <rect x="29" y="36" width="6" height="6" fill="#94A3B8" />
              <rect x="20" y="42" width="24" height="3" rx="1.5" fill="#CBD5E1" />
            </svg>
          )}
        </>
      )}
      {outOfStock && (
        <div className="absolute inset-0 bg-white/55 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-[#EF4444] bg-white/90 flex items-center justify-center shadow-2xs">
            <div className="w-4 h-0.5 bg-[#EF4444] -rotate-45" />
          </div>
        </div>
      )}
      {badge && (
        <span className="absolute bottom-1 left-1 rounded-md bg-white/95 backdrop-blur-xs border border-[#ECEAF6] px-1.5 py-0.5 text-[10px] font-bold text-[#13112B] shadow-2xs">
          {badge}
        </span>
      )}
    </div>
  );
};

export const AvatarBadge: React.FC<{
  initials: string;
  tone?: 'purple' | 'emerald' | 'amber' | 'slate';
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ initials, tone = 'purple', online = false, size = 'md' }) => {
  const palette = {
    purple: 'bg-[#EDE9FE] text-[#5433FF] border-[#D8D0FE]',
    emerald: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    amber: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    slate: 'bg-[#EEF0F6] text-[#334155] border-[#CBD5E1]',
  }[tone];

  const dims = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  return (
    <div className={`relative rounded-full border font-bold flex items-center justify-center shrink-0 ${palette} ${dims}`}>
      <span>{initials}</span>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
      )}
    </div>
  );
};

export const CotonouMapPreview: React.FC<{ lang?: 'fr' | 'en' }> = ({ lang = 'fr' }) => (
  <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-[#DCE8F2] bg-[#E8F2F8]">
    <svg viewBox="0 0 360 130" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
      <rect width="360" height="130" fill="#E8F1F7" />
      <path d="M0 95 Q110 82 220 98 T360 90 L360 130 L0 130 Z" fill="#C7E0F4" />
      <path d="M0 32 L180 42 L360 22" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      <path d="M40 70 L210 52 L340 65" stroke="#FCD34D" strokeWidth="4" fill="none" />
      <path d="M125 0 L145 130" stroke="#FFFFFF" strokeWidth="5" fill="none" />
      <path d="M245 0 L225 130" stroke="#FFFFFF" strokeWidth="4" fill="none" />
      <circle cx="140" cy="56" r="14" fill="#5433FF" fillOpacity="0.18" />
      <circle cx="140" cy="56" r="7" fill="#5433FF" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="242" cy="64" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
      <text x="64" y="24" fontSize="9" fill="#64748B" fontWeight="600">Stade de l&apos;Amitié</text>
      <text x="152" y="47" fontSize="9" fill="#475569" fontWeight="700">Haie Vive</text>
      <text x="242" y="42" fontSize="10" fill="#1E293B" fontWeight="700">Cotonou</text>
    </svg>
    <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-[#13112B]/90 text-white px-2.5 py-1 text-[11px] font-semibold">
      {lang === 'fr' ? 'À 4 min de la boutique' : '4 min from store'}
    </div>
    <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-white/95 border border-[#ECEAF6] text-[#13112B] px-2.5 py-1 text-[11px] font-semibold shadow-xs flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
      {lang === 'fr' ? 'Boutique Haie Vive' : 'Haie Vive Store'}
    </div>
  </div>
);

export const HandoverQR: React.FC<{ code: string }> = ({ code }) => {
  const seed = code.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cells: boolean[] = [];
  for (let i = 0; i < 49; i++) {
    const r = Math.floor(i / 7);
    const c = i % 7;
    const isCorner =
      (r < 2 && c < 2) ||
      (r < 2 && c > 4) ||
      (r > 4 && c < 2);
    cells.push(isCorner || ((i * 17 + seed) % 3 === 0));
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-white border border-[#E5E2F5] p-2 grid grid-cols-7 gap-0.5 shrink-0">
      {cells.map((filled, idx) => (
        <span
          key={idx}
          className={`rounded-[1px] ${filled ? 'bg-[#13112B]' : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
};
