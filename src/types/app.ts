export type Lang = 'fr' | 'en';

export type PageId =
  | 'welcome'
  | 'hub'
  | 'products'
  | 'add-product'
  | 'orders'
  | 'dispatch'
  | 'wallet'
  | 'notifications'
  | 'chat'
  | 'analytics'
  | 'crm'
  | 'reviews'
  | 'marketing'
  | 'team'
  | 'storefront'
  | 'kyc'
  | 'support'
  | 'menu'
  | 'login'
  | 'register'
  | 'otp';

export type OrderStatus = 'Nouveau' | 'En cours' | 'Expédié' | 'Livré';

export interface Product {
  id: string;
  name: string;
  specs: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  badgeLabel: string;
  rating: number;
  reviewCount: number;
  visible: boolean;
  visualType: 'laptop-dell' | 'laptop-hp' | 'backpack' | 'mouse' | 'monitor';
  imageUrl?: string;
  photos?: string[];
  gozemExpress: boolean;
  weightKg: number;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerInitials: string;
  customerLocation: string;
  customerTag: string;
  productName: string;
  productSpecs: string;
  qty: number;
  amount: number;
  paymentMethod: 'MTN MoMo' | 'Moov Money' | 'Celtiis Cash';
  status: OrderStatus;
  urgency: 'Urgent' | 'Standard' | 'Expédié';
  timeAgo: string;
  riderId?: string;
  riderName?: string;
  riderArrival?: string;
  handoverPin: string;
  visualType: Product['visualType'];
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
  type: 'sale' | 'withdrawal';
  status: 'DÉBLOQUÉ' | 'SUCCÈS' | 'EN SÉQUESTRE';
  visualType?: Product['visualType'];
  provider?: 'mtn' | 'moov' | 'celtiis';
}

export interface NotificationItem {
  id: string;
  group: 'today' | 'yesterday';
  category: 'Commandes' | 'Finances' | 'Avis' | 'Stock' | 'Sécurité';
  title: string;
  body: string;
  time: string;
  unread: boolean;
  badge?: string;
  meta?: string;
  quote?: string;
  targetPage?: PageId;
  securityResolved?: 'trusted' | 'blocked' | null;
}

export interface Customer {
  id: string;
  name: string;
  initials: string;
  location: string;
  tier: 'VIP OR' | 'CLIENT ACTIF' | 'VIP';
  ordersCount: number;
  totalSpent: number;
  lastProduct: string;
  lastOrderTime: string;
  phone: string;
  segment: 'VIP Cotonou' | 'Nouveaux' | 'Réguliers';
}

export interface Review {
  id: string;
  customerName: string;
  initials: string;
  verifiedLocation: string;
  rating: number;
  productName: string;
  productPrice: number;
  comment: string;
  timeAgo: string;
  hasPhoto: boolean;
  reply?: {
    text: string;
    timeAgo: string;
  };
  helpfulCount: number;
  thanked?: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountLabel: string;
  description: string;
  target: string;
  expiresIn: string;
  used: number;
  maxUses: number;
  active: boolean;
  type: 'discount' | 'shipping';
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  roleTitle: string;
  phone: string;
  status: 'PROPRIÉTAIRE' | 'ACTIF' | 'ACCÈS LIMITÉ';
  permissions: string[];
  noWithdrawal: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'merchant' | 'system';
  text: string;
  time: string;
  attachmentTitle?: string;
  voiceDuration?: string;
  voiceTranscript?: string;
}

export interface StoreSettings {
  shopName: string;
  managerName: string;
  slogan: string;
  address: string;
  whatsapp: string;
  isOpen: boolean;
  weekdayHours: string;
  sundayHours: string;
  warranty: string;
  returnPolicy: string;
  accentColor: string;
  pushWhatsApp: boolean;
  biometrics: boolean;
  twoFactor: boolean;
  category?: string;
  payoutProvider?: 'MTN MoMo' | 'Moov Money' | 'Celtiis Cash';
  ifuNumber?: string;
}

export interface VendorOnboardingPayload {
  managerName: string;
  shopName: string;
  category: string;
  city: string;
  streetAddress: string;
  slogan: string;
  payoutProvider: 'MTN MoMo' | 'Moov Money' | 'Celtiis Cash';
  phone: string;
  ifuNumber?: string;
  weekdayHours: string;
  sundayHours: string;
  gozemExpress: boolean;
  warranty: string;
  starterProduct?: {
    name: string;
    price: number;
    stock: number;
    imageUrl?: string;
  };
}
