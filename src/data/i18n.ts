import {
  ChatMessage,
  Customer,
  Lang,
  NotificationItem,
  Order,
  OrderStatus,
  Product,
  PromoCode,
  Review,
  TeamMember,
  Transaction,
} from '../types/app';

export function trOrderStatus(status: OrderStatus, lang: Lang): string {
  if (lang === 'fr') return status;
  switch (status) {
    case 'Nouveau':
      return 'New';
    case 'En cours':
      return 'In Progress';
    case 'Expédié':
      return 'Shipped';
    case 'Livré':
      return 'Delivered';
  }
}

export function trOrderUrgency(urgency: Order['urgency'], lang: Lang): string {
  if (lang === 'fr') return urgency;
  if (urgency === 'Expédié') return 'Shipped';
  return urgency;
}

const FR_EN_MAP: Record<string, string> = {
  // Orders
  'Particulier VIP': 'VIP Customer',
  'Client Vérifié': 'Verified Buyer',
  'Il y a 12 min': '12m ago',
  'Il y a 34 min': '34m ago',
  'Il y a 50 min': '50m ago',
  'En transit': 'In transit',
  "Aujourd'hui, 14:22": 'Today, 14:22',
  'Arrivée 13:45': 'ETA 13:45',
  'Dans 8 min': 'In 8 min',
  'Livraison 14:20': 'Delivery 14:20',
  'Qté: 1 · Intel i7 · 16GB / 512GB': 'Qty: 1 · Intel i7 · 16GB / 512GB',
  'Qté: 2 · Noir Mat Silent Click': 'Qty: 2 · Matte Black Silent Click',
  'Qté: 1 · Ryzen 5 · 8GB / 512GB': 'Qty: 1 · Ryzen 5 · 8GB / 512GB',
  'Qté: 1 · Imperméable 30L': 'Qty: 1 · Waterproof 30L',
  'Qté: 1 · Scellé usine + Facture e-MECeF': 'Qty: 1 · Factory sealed + e-MECeF Invoice',
  'Souris Sans Fil Ergonomique Pro': 'Ergonomic Wireless Mouse Pro',
  'Sac à Dos Antivol Pro 15.6"': 'Anti-Theft Pro Backpack 15.6"',

  // Products
  'Sac Laptop Imperméable': 'Waterproof Laptop Backpack',
  'Souris Sans Fil Ergonomique': 'Ergonomic Wireless Mouse',
  'Écran 4K UltraSharp 27"': 'UltraSharp 27" 4K Monitor',
  'Anti-choc · Port USB intégré · Noir': 'Shockproof · Built-in USB Port · Black',
  'Bluetooth 5.2 + 2.4Ghz · Silencieuse': 'Bluetooth 5.2 + 2.4GHz · Silent',
  'IPS USB-C 90W · Calibré usine': 'IPS USB-C 90W · Factory Calibrated',
  'Accessoires Tech': 'Tech Accessories',
  'Périphériques': 'Peripherals',
  'Moniteurs': 'Monitors',

  // Transactions
  'Vente #MB-8819': 'Sale #MB-8819',
  'Retrait MTN MoMo': 'MTN MoMo Withdrawal',
  'Vers +229 97 XX XX 12': 'To +229 97 XX XX 12',
  'Hier, 18:45': 'Yesterday, 18:45',
  'Vente #MB-8802': 'Sale #MB-8802',
  'Sac à dos Laptop · Eric G.': 'Laptop Backpack · Eric G.',
  'Hier, 11:10': 'Yesterday, 11:10',
  'DÉBLOQUÉ': 'RELEASED',
  'SUCCÈS': 'SUCCESS',
  'EN SÉQUESTRE': 'IN ESCROW',
  "À l'instant": 'Just now',

  // Notifications
  'Nouvelle Commande #MB-9043': 'New Order #MB-9043',
  'Retrait Mobile Money confirmé': 'Mobile Money Payout Confirmed',
  'Virement de 200 000 FCFA vers MTN MoMo (+229 97 •••• 12) exécuté avec succès.':
    'Transfer of 200,000 FCFA to MTN MoMo (+229 97 •••• 12) completed successfully.',
  'Réf: TX-88291 · Validé': 'Ref: TX-88291 · Verified',
  'Nouvel avis 5 étoiles !': 'New 5-star review!',
  'par Eric G.': 'by Eric G.',
  '« PC super propre, scellé comme promis. Livraison express reçue en 2h à Ganhi ! »':
    '"Super clean laptop, factory-sealed as promised. Express delivery in 2h at Ganhi!"',
  'Alerte Stock Faible': 'Low Stock Alert',
  'HP Pavilion 15 Silver — Il ne reste que 2 unités dans votre catalogue.':
    'HP Pavilion 15 Silver — Only 2 units left in your catalog.',
  'Seuil critique: 3 unités': 'Critical threshold: 3 units',
  'Sécurité du Compte': 'Account Security',
  'Connexion détectée depuis un nouvel appareil (Android · IP Cotonou). Était-ce vous ?':
    'New login detected from an unrecognized device (Android · Cotonou IP). Was this you?',

  // Customers
  'VIP OR': 'GOLD VIP',
  'CLIENT ACTIF': 'ACTIVE BUYER',
  'Souris Sans Fil Logitech': 'Logitech Wireless Mouse',
  "Aujourd'hui": 'Today',
  "En cours d'expédition": 'In transit',
  'Il y a 3 jours': '3 days ago',

  // Reviews
  'Acheteur vérifié · Calavi Arconville': 'Verified buyer · Calavi Arconville',
  'Acheteur vérifié · Cotonou Cadjehoun': 'Verified buyer · Cotonou Cadjehoun',
  'Sac à dos antivol imperméable': 'Waterproof Anti-Theft Backpack',
  '« Très bonne qualité de tissu, résiste bien à la pluie en moto zem. Vendeur très réactif sur WhatsApp. »':
    '"Great fabric quality, handles rain well on a Zem bike. Very responsive seller on WhatsApp."',
  '« PC super propre, scellé comme promis. Livraison par Gozem en moins d’une heure à Cadjehoun. Franchement le meilleur vendeur tech du Bénin ! »':
    '"Super clean laptop, sealed as promised. Gozem delivery in under an hour to Cadjehoun. Easily the best tech seller in Benin!"',
  "Merci beaucoup M. Eric ! N'hésitez pas si vous avez besoin d'accessoires. La garantie 1 an est active sur votre facture MINI-B.":
    'Thank you very much Mr. Eric! Feel free to reach out if you need accessories. Your 1-year warranty is active on your MINI-B invoice.',
  'Hier à 16:45': 'Yesterday at 16:45',
  'Il y a 2 jours': '2 days ago',

  // Promos
  'Applicable sur tous les Laptops dès 150 000 FCFA': 'Valid on all laptops from 150,000 FCFA',
  'Tous les acheteurs': 'All shoppers',
  'Expire dans 3j': 'Expires in 3d',
  '-10% sur tout le catalogue pour clients fidèles': '10% off the entire catalog for loyal buyers',
  'Clients VIP Cotonou': 'Cotonou VIP Customers',
  'Gratuit': 'Free',
  'Livraison Gozem offerte dès 50 000 FCFA (Akpakpa & Ganhi)':
    'Free Gozem delivery from 50,000 FCFA (Akpakpa & Ganhi)',
  'Nouveaux acheteurs': 'New shoppers',
  'Expire dans 48h': 'Expires in 48h',
  'Tous les clients Cotonou': 'All Cotonou customers',

  // Team
  'Propriétaire & Signataire financier': 'Owner & Financial Signatory',
  'PROPRIÉTAIRE': 'OWNER',
  'Retraits MoMo illimités': 'Unlimited MoMo payouts',
  'Audit & Comptabilité': 'Audit & Accounting',
  'Gestionnaire des Stocks & Commandes': 'Inventory & Orders Manager',
  'ACTIF': 'ACTIVE',
  'Édition Catalogue': 'Catalog Editing',
  'Marquer Préparée': 'Mark Ready',
  'Livreur Interne & Dispatch': 'In-house Rider & Dispatch',
  'Remise aux clients': 'Customer Handover',
  'Synchronisation Gozem': 'Gozem Sync',
  'Caissier & Support Client': 'Cashier & Customer Support',
  'ACCÈS LIMITÉ': 'LIMITED ACCESS',
  'Discussion Clientèle': 'Customer Chat',
  'Impression Tickets': 'Receipt Printing',

  // Chat
  'Bonjour Koffi ! Est-ce que le chargeur original 65W Type-C et la facture e-MECeF normalisée sont bien inclus dans le carton avant l’envoi par Gozem ?':
    'Hello Koffi! Are the original 65W Type-C charger and standardized e-MECeF invoice included in the box before Gozem pickup?',
  'Bonjour Mme Mireille ! Oui absolument, carton scellé d’usine avec chargeur d’origine et facture e-MECeF certifiée sous garantie 1 an.':
    'Hello Ms. Mireille! Yes, factory-sealed box with original charger and certified e-MECeF invoice with a 1-year warranty.',
  'Photo d’emballage envoyée': 'Packaging photo sent',
  'Colis préparé & scellé · #MB-9042': 'Parcel packed & sealed · #MB-9042',
  '« Parfait Koffi, merci pour le sérieux ! »': '"Perfect Koffi, thank you for the great service!"',
};

export function trSeed(text: string, lang: Lang): string {
  if (lang === 'fr') return text;
  if (FR_EN_MAP[text]) return FR_EN_MAP[text];
  if (text.startsWith('Retrait ')) return text.replace('Retrait ', 'Withdrawal ');
  if (text.startsWith('Vers ')) return text.replace('Vers ', 'To ');
  return text;
}

export function trOrder(o: Order, lang: Lang): Order {
  if (lang === 'fr') return o;
  return {
    ...o,
    customerTag: trSeed(o.customerTag, lang),
    productName: trSeed(o.productName, lang),
    productSpecs: trSeed(o.productSpecs, lang),
    timeAgo: trSeed(o.timeAgo, lang),
    riderArrival: o.riderArrival ? trSeed(o.riderArrival, lang) : undefined,
  };
}

export function trProduct(p: Product, lang: Lang): Product {
  if (lang === 'fr') return p;
  return {
    ...p,
    name: trSeed(p.name, lang),
    specs: trSeed(p.specs, lang),
    category: trSeed(p.category, lang),
  };
}

export function trTransaction(t: Transaction, lang: Lang): Transaction {
  if (lang === 'fr') return t;
  return {
    ...t,
    title: trSeed(t.title, lang),
    subtitle: trSeed(t.subtitle, lang),
    date: trSeed(t.date, lang),
  };
}

export function trNotification(n: NotificationItem, lang: Lang): NotificationItem {
  if (lang === 'fr') return n;
  return {
    ...n,
    title: trSeed(n.title, lang),
    body: trSeed(n.body, lang),
    meta: n.meta ? trSeed(n.meta, lang) : undefined,
    quote: n.quote ? trSeed(n.quote, lang) : undefined,
  };
}

export function trCustomer(c: Customer, lang: Lang): Customer {
  if (lang === 'fr') return c;
  return {
    ...c,
    lastProduct: trSeed(c.lastProduct, lang),
    lastOrderTime: trSeed(c.lastOrderTime, lang),
  };
}

export function trReview(r: Review, lang: Lang): Review {
  if (lang === 'fr') return r;
  return {
    ...r,
    verifiedLocation: trSeed(r.verifiedLocation, lang),
    productName: trSeed(r.productName, lang),
    comment: trSeed(r.comment, lang),
    timeAgo: trSeed(r.timeAgo, lang),
    reply: r.reply
      ? {
          text: trSeed(r.reply.text, lang),
          timeAgo: trSeed(r.reply.timeAgo, lang),
        }
      : undefined,
  };
}

export function trPromo(p: PromoCode, lang: Lang): PromoCode {
  if (lang === 'fr') return p;
  return {
    ...p,
    discountLabel: trSeed(p.discountLabel, lang),
    description: trSeed(p.description, lang),
    target: trSeed(p.target, lang),
    expiresIn: trSeed(p.expiresIn, lang),
  };
}

export function trTeamMember(m: TeamMember, lang: Lang): TeamMember {
  if (lang === 'fr') return m;
  return {
    ...m,
    roleTitle: trSeed(m.roleTitle, lang),
    permissions: m.permissions.map((perm) => trSeed(perm, lang)),
  };
}

export function trChat(m: ChatMessage, lang: Lang): ChatMessage {
  if (lang === 'fr') return m;
  return {
    ...m,
    text: trSeed(m.text, lang),
    attachmentTitle: m.attachmentTitle ? trSeed(m.attachmentTitle, lang) : undefined,
    voiceTranscript: m.voiceTranscript ? trSeed(m.voiceTranscript, lang) : undefined,
  };
}
