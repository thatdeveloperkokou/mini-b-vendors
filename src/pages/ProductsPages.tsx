import React, { useRef, useState } from 'react';
import {
  Barcode,
  Camera,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Layers,
  Lightbulb,
  Minus,
  Plus,
  Rocket,
  Save,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react';
import { Lang, PageId, Product } from '../types/app';
import { formatFCFA } from '../data/mockStore';
import { trProduct } from '../data/i18n';
import { PRODUCT_PHOTO_MAP, ProductVisual } from '../components/VisualAssets';

interface ProductsPageProps {
  lang: Lang;
  products: Product[];
  onUpdateStock: (productId: string, delta: number) => void;
  onToggleVisibility: (productId: string) => void;
  onNavigate: (page: PageId, contextId?: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  lang,
  products,
  onUpdateStock,
  onToggleVisibility,
  onNavigate,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Tous' | 'En stock' | 'Stock faible' | 'Rupture'>('Tous');

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const inStockCount = products.filter((p) => p.stock > 3).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const outStockCount = products.filter((p) => p.stock === 0).length;

  const localizedProducts = products.map((p) => trProduct(p, lang));
  const filtered = localizedProducts.filter((p) => {
    const matchText =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.specs.toLowerCase().includes(search.toLowerCase());
    if (!matchText) return false;
    if (filter === 'En stock') return p.stock > 3;
    if (filter === 'Stock faible') return p.stock > 0 && p.stock <= 3;
    if (filter === 'Rupture') return p.stock === 0;
    return true;
  });

  const filterChips = [
    { key: 'Tous' as const, label: isFr ? 'Tous' : 'All', count: products.length },
    { key: 'En stock' as const, label: isFr ? 'En stock' : 'In Stock', count: inStockCount },
    { key: 'Stock faible' as const, label: isFr ? 'Stock faible' : 'Low Stock', count: lowStockCount },
    { key: 'Rupture' as const, label: isFr ? 'Rupture' : 'Out of Stock', count: outStockCount },
  ];

  return (
    <div className="space-y-4">
      {/* Search + Barcode Scan Row */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center gap-2.5 rounded-2xl bg-white border border-[#ECEAF6] px-4 py-2.5 min-h-[46px]">
          <Search className="w-4 h-4 text-[#7C7998] shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isFr ? 'Rechercher référence, nom, SKU...' : 'Search item, name, SKU...'
            }
            className="w-full bg-transparent text-sm text-[#13112B] placeholder:text-[#7C7998] outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            onShowToast(
              isFr ? 'Lecteur code-barres prêt pour scan SKU' : 'Barcode scanner ready for SKU scan'
            )
          }
          className="w-12 h-12 rounded-2xl bg-[#F0EDFF] hover:bg-[#E4DEFF] text-[#5433FF] flex items-center justify-center shrink-0 transition-colors"
          aria-label={isFr ? 'Scanner code-barres' : 'Scan barcode'}
        >
          <Barcode className="w-5 h-5" />
        </button>
      </div>

      {/* 2-Column KPI Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C7998]">
              {isFr ? 'Valeur Stock' : 'Stock Value'}
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-extrabold text-[#13112B] tabular-nums">
              {totalValue.toLocaleString('fr-FR')}
            </p>
            <p className="text-xs font-bold text-[#5433FF]">FCFA</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#ECEAF6] p-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7C7998]">
              {isFr ? 'Total Articles' : 'Total SKUs'}
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-extrabold text-[#13112B] tabular-nums">
              {products.length}{' '}
              <span className="text-xs font-semibold text-[#7C7998]">
                {isFr ? 'réfs' : 'items'}
              </span>
            </p>
            <p className="text-xs font-medium text-[#059669]">
              {isFr ? 'Catalogue actif' : 'Active catalog'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterChips.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                active
                  ? 'bg-[#5433FF] text-white shadow-xs'
                  : 'bg-white border border-[#ECEAF6] text-[#4B4869] hover:text-[#13112B]'
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

      {/* Create New Product Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#5B3BFF] to-[#4423E8] text-white p-4 sm:p-5 flex items-center justify-between gap-3 shadow-md shadow-[#5433FF]/15">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold truncate">
              {isFr ? 'Nouveau Produit' : 'New Product'}
            </h2>
            <p className="text-xs text-white/85 truncate">
              {isFr ? 'Ajouter photo, prix FCFA & stock' : 'Add photo, FCFA price & stock'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('add-product')}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white text-[#5433FF] hover:bg-[#F5F3FF] px-4 py-2.5 text-xs font-extrabold transition-colors whitespace-nowrap min-h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span>{isFr ? 'Créer' : 'Create'}</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 rounded-3xl bg-white border border-[#ECEAF6] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#13112B]">
                {products.length === 0
                  ? isFr
                    ? 'Votre catalogue est encore vide'
                    : 'Your catalog is still empty'
                  : isFr
                    ? 'Aucun produit dans cette catégorie'
                    : 'No products in this filter'}
              </p>
              <p className="text-xs text-[#7C7998] mt-1 max-w-md mx-auto">
                {products.length === 0
                  ? isFr
                    ? 'Ajoutez votre premier article avec photo réelle, prix FCFA et stock disponible pour ouvrir vos ventes.'
                    : 'Add your first product with real photos, FCFA price, and available stock to start selling.'
                  : isFr
                    ? 'Modifiez votre recherche ou réinitialisez les filtres pour afficher vos articles.'
                    : 'Adjust your search or reset filters to see your items.'}
              </p>
            </div>
            {products.length === 0 ? (
              <button
                type="button"
                onClick={() => onNavigate('add-product')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5433FF] hover:bg-[#4423E8] text-white px-5 py-2.5 text-xs font-bold min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>{isFr ? 'Ajouter mon 1er produit' : 'Add my 1st product'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilter('Tous');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F0EDFF] text-[#5433FF] px-4 py-2 text-xs font-bold"
              >
                {isFr ? 'Voir tous les produits' : 'Show all products'}
              </button>
            )}
          </div>
        ) : (
          filtered.map((product) => {
          const isOut = product.stock === 0;
          const isLow = product.stock > 0 && product.stock <= 3;

          return (
            <article
              key={product.id}
              className="rounded-3xl bg-white border border-[#ECEAF6] p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <ProductVisual
                  type={product.visualType}
                  imageUrl={product.imageUrl}
                  alt={product.name}
                  badge={product.badgeLabel}
                  outOfStock={isOut}
                  className="w-20 h-20"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isOut
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : isLow
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#ECFDF5] text-[#059669]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOut ? 'bg-[#EF4444]' : isLow ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                        }`}
                      />
                      {isOut
                        ? isFr
                          ? 'Rupture de stock'
                          : 'Out of Stock'
                        : isLow
                          ? isFr
                            ? 'Stock Faible'
                            : 'Low Stock'
                          : isFr
                            ? 'En ligne'
                            : 'In Stock'}
                    </span>

                    <span className="text-xs font-bold text-[#13112B] flex items-center gap-1 shrink-0 tabular-nums">
                      <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
                      {product.rating}{' '}
                      <span className="text-[#7C7998] font-medium">({product.reviewCount})</span>
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-extrabold text-[#13112B] truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#7C7998] truncate">{product.specs}</p>

                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span
                      className={`text-base font-extrabold tabular-nums ${
                        isOut ? 'line-through text-[#7C7998]' : 'text-[#5433FF]'
                      }`}
                    >
                      {formatFCFA(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-xs text-[#7C7998] line-through tabular-nums">
                        {formatFCFA(product.oldPrice, 'F')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stock Stepper + Controls */}
              <div
                className={`rounded-2xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 ${
                  isOut
                    ? 'bg-[#FEF2F2] border border-[#FECACA]'
                    : isLow
                      ? 'bg-[#FFFBEB] border border-[#FDE68A]'
                      : 'bg-[#F8F7FC] border border-[#ECEAF6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-bold ${
                      isOut ? 'text-[#DC2626]' : isLow ? 'text-[#B45309]' : 'text-[#4B4869]'
                    }`}
                  >
                    {isOut
                      ? isFr
                        ? 'Stock épuisé:'
                        : 'Out of stock:'
                      : isLow
                        ? isFr
                          ? 'Stock critique:'
                          : 'Critical stock:'
                        : 'Stock:'}
                  </span>

                  <div className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#E5E2F5] p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateStock(product.id, -1)}
                      className="w-8 h-8 rounded-lg hover:bg-[#F5F5FA] flex items-center justify-center text-[#13112B]"
                      aria-label={isFr ? 'Diminuer le stock' : 'Decrease stock'}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className={`w-7 text-center text-xs font-extrabold tabular-nums ${
                        isOut ? 'text-[#DC2626]' : 'text-[#13112B]'
                      }`}
                    >
                      {product.stock}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateStock(product.id, 1)}
                      className="w-8 h-8 rounded-lg hover:bg-[#F5F5FA] flex items-center justify-center text-[#13112B]"
                      aria-label={isFr ? 'Augmenter le stock' : 'Increase stock'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!isOut && (
                    <span
                      className={`text-xs font-semibold ${
                        isLow ? 'text-[#B45309]' : 'text-[#059669]'
                      }`}
                    >
                      {isLow ? (isFr ? 'restantes' : 'left') : isFr ? 'unités' : 'units'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isOut ? (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStock(product.id, 5);
                        onShowToast(
                          isFr
                            ? `${product.name} réapprovisionné (+5 unités)`
                            : `${product.name} restocked (+5 units)`
                        );
                      }}
                      className="rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1.5 text-xs font-bold min-h-[36px]"
                    >
                      {isFr ? 'Réapprovisionner' : 'Restock'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onShowToast(
                          isFr
                            ? `Lien WhatsApp de ${product.name} copié !`
                            : `WhatsApp link for ${product.name} copied!`
                        )
                      }
                      className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center"
                      aria-label={isFr ? 'Partager sur WhatsApp' : 'Share on WhatsApp'}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onNavigate('add-product', product.id)}
                    className="w-9 h-9 rounded-xl bg-white border border-[#E5E2F5] text-[#13112B] flex items-center justify-center"
                    aria-label={isFr ? 'Modifier produit' : 'Edit product'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleVisibility(product.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      product.visible
                        ? 'bg-[#F0EDFF] text-[#5433FF]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                    aria-label={isFr ? 'Basculer visibilité' : 'Toggle visibility'}
                  >
                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </article>
          );
        })
        )}
      </div>

      {/* WhatsApp Catalog Sync Card */}
      <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#13112B]">
            {isFr ? 'Synchronisation WhatsApp Active' : 'WhatsApp Catalog Sync Active'}
          </h3>
          <p className="text-xs text-[#7C7998] truncate">
            {isFr
              ? 'Chaque mise à jour de stock est propagée à votre vitrine MINI-B & WhatsApp Business.'
              : 'Every stock update automatically syncs with your MINI-B storefront & WhatsApp Business.'}
          </p>
        </div>
      </section>
    </div>
  );
};

interface AddProductPageProps {
  lang: Lang;
  editingProduct?: Product;
  onSaveProduct: (product: Product, isDraft: boolean) => void;
  onCancel: () => void;
  onShowToast: (msg: string) => void;
}

export const AddProductPage: React.FC<AddProductPageProps> = ({
  lang,
  editingProduct,
  onSaveProduct,
  onCancel,
  onShowToast,
}) => {
  const isFr = lang === 'fr';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultVisualType: Product['visualType'] = editingProduct?.visualType || 'laptop-dell';
  const [visualType, setVisualType] = useState<Product['visualType']>(defaultVisualType);
  const [photos, setPhotos] = useState<string[]>(() => {
    if (editingProduct?.photos && editingProduct.photos.length > 0) return editingProduct.photos;
    if (editingProduct?.imageUrl) return [editingProduct.imageUrl];
    return [PRODUCT_PHOTO_MAP[defaultVisualType]];
  });
  const [name, setName] = useState(
    editingProduct?.name || 'Dell XPS 13 Intel Core i7 16GB SSD'
  );
  const [category, setCategory] = useState(editingProduct?.category || 'Laptops & PC');
  const [brand, setBrand] = useState(editingProduct?.brand || 'Dell');
  const [description, setDescription] = useState(
    editingProduct?.description ||
      (isFr
        ? '• Écran : 13.4" FHD+ InfinityEdge antireflet\n• Processeur : Intel Core i7 13ème Génération\n• RAM : 16GB LPDDR5 | Stockage : 512GB SSD\n• État : Quasi-neuf importé, batterie 100%'
        : '• Display: 13.4" FHD+ Anti-Glare InfinityEdge\n• Processor: 13th Gen Intel Core i7\n• RAM: 16GB LPDDR5 | Storage: 512GB SSD\n• Condition: Like-new imported, 100% battery health')
  );
  const [price, setPrice] = useState(editingProduct?.price || 650000);
  const [oldPrice, setOldPrice] = useState(editingProduct?.oldPrice || 720000);
  const [stock, setStock] = useState(editingProduct?.stock ?? 10);
  const [sku, setSku] = useState(editingProduct?.sku || 'DL-XPS13-01');
  const [gozemExpress, setGozemExpress] = useState(editingProduct?.gozemExpress ?? true);
  const [weightKg, setWeightKg] = useState(editingProduct?.weightKg || 1.5);

  const discountPct =
    oldPrice > price && oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handlePhotoFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = Math.max(0, 5 - photos.length);
    if (remaining === 0) {
      onShowToast(isFr ? 'Maximum 5 photos atteint' : 'Maximum 5 photos reached');
      return;
    }
    const slice = Array.from(files).slice(0, remaining);
    slice.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => (prev.length < 5 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
    onShowToast(
      isFr ? 'Photo(s) produit ajoutée(s) avec succès' : 'Product photo(s) added successfully'
    );
  };

  const selectStudioPreset = (presetType: Product['visualType']) => {
    setVisualType(presetType);
    const presetUrl = PRODUCT_PHOTO_MAP[presetType];
    setPhotos((prev) => [presetUrl, ...prev.filter((u) => u !== presetUrl)].slice(0, 5));
  };

  const buildProduct = (visible: boolean): Product => ({
    id: editingProduct?.id || `prod-${Date.now()}`,
    name: name.trim() || (isFr ? 'Nouveau Produit' : 'New Product'),
    specs: `${brand} · ${category}`,
    category,
    brand,
    price: Number(price) || 0,
    oldPrice: oldPrice > price ? Number(oldPrice) : undefined,
    stock: Math.max(0, Number(stock) || 0),
    sku: sku.trim() || 'SKU-MINIB',
    badgeLabel: category === 'Laptops & PC' ? '13.4"' : 'Pro',
    rating: editingProduct?.rating || 5.0,
    reviewCount: editingProduct?.reviewCount || 1,
    visible,
    visualType,
    imageUrl: photos[0] || PRODUCT_PHOTO_MAP[visualType],
    photos: photos.length > 0 ? photos : [PRODUCT_PHOTO_MAP[visualType]],
    gozemExpress,
    weightKg: Number(weightKg) || 1.0,
    description,
  });

  const studioChoices: { type: Product['visualType']; label: string }[] = [
    { type: 'laptop-dell', label: 'Dell XPS' },
    { type: 'laptop-hp', label: 'HP Silver' },
    { type: 'backpack', label: isFr ? 'Sac 30L' : 'Backpack' },
    { type: 'mouse', label: isFr ? 'Souris' : 'Mouse' },
    { type: 'monitor', label: isFr ? 'Écran 4K' : '4K Monitor' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-[#13112B]">
            {editingProduct
              ? isFr
                ? 'Modifier le Produit'
                : 'Edit Product'
              : isFr
                ? 'Ajouter un Produit'
                : 'Add New Product'}
          </h1>
          <p className="text-xs text-[#059669] font-semibold">
            {isFr ? '● Catalogue Cotonou Marché' : '● Cotonou Marketplace Catalog'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onSaveProduct(buildProduct(false), true);
            onShowToast(isFr ? 'Produit enregistré en brouillon' : 'Product saved as draft');
          }}
          className="rounded-xl bg-[#F0EDFF] text-[#5433FF] px-3 py-1.5 text-xs font-bold"
        >
          {isFr ? 'Brouillon' : 'Draft'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Photos & General Info */}
        <div className="space-y-4">
          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Photos du Produit' : 'Product Photos'}
              </h2>
              <span className="text-xs text-[#7C7998] font-medium tabular-nums">
                {photos.length}/5 photos
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handlePhotoFiles(e.target.files)}
              className="hidden"
            />

            <div className="grid grid-cols-3 gap-2.5">
              {photos.map((photoSrc, idx) => (
                <div
                  key={`${photoSrc.slice(0, 32)}-${idx}`}
                  className="group relative rounded-2xl bg-[#F2F1FA] border border-[#D8D0FE] overflow-hidden h-24"
                >
                  <img
                    src={photoSrc}
                    alt={`${name} ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 ? (
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-[#5433FF] text-white px-1.5 py-0.5 text-[9px] font-bold shadow-2xs">
                      {isFr ? 'PRINCIPAL' : 'MAIN'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setPhotos((prev) => [photoSrc, ...prev.filter((_, i) => i !== idx)])
                      }
                      className="absolute top-1.5 left-1.5 rounded-md bg-white/95 text-[#5433FF] px-1.5 py-0.5 text-[9px] font-bold shadow-2xs"
                    >
                      {isFr ? 'Définir 1er' : 'Set main'}
                    </button>
                  )}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 text-[#DC2626] flex items-center justify-center shadow-2xs"
                      aria-label={isFr ? 'Supprimer la photo' : 'Remove photo'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl bg-[#F8F7FC] border border-dashed border-[#D1CBEB] hover:border-[#5433FF] h-24 flex flex-col items-center justify-center gap-1 text-xs font-semibold text-[#4B4869] transition-colors"
                >
                  <Camera className="w-5 h-5 text-[#5433FF]" />
                  <span>{isFr ? 'Importer photo' : 'Upload photo'}</span>
                </button>
              )}

              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl bg-[#F8F7FC] border border-dashed border-[#D1CBEB] hover:border-[#5433FF] h-24 flex flex-col items-center justify-center gap-1 text-xs font-semibold text-[#4B4869] transition-colors"
                >
                  <ImagePlus className="w-5 h-5 text-[#5433FF]" />
                  <span>{isFr ? 'Galerie' : 'Gallery'}</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-[#7C7998]">
                {isFr ? 'Photos studio disponibles :' : 'Available studio photos:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {studioChoices.map((choice) => (
                  <button
                    key={choice.type}
                    type="button"
                    onClick={() => selectStudioPreset(choice.type)}
                    className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold border transition-colors ${
                      visualType === choice.type
                        ? 'bg-[#F0EDFF] border-[#5433FF] text-[#5433FF]'
                        : 'bg-[#F8F7FC] border-[#ECEAF6] text-[#4B4869] hover:text-[#13112B]'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#F5F4FF] px-3.5 py-2.5 text-xs text-[#4B4869] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#5433FF] shrink-0" />
              <span>
                {isFr ? (
                  <>
                    Conseil : Les photos sur fond clair augmentent les ventes de{' '}
                    <strong className="text-[#059669]">+34%</strong> à Cotonou.
                  </>
                ) : (
                  <>
                    Tip: Clean light-background photos increase sales by{' '}
                    <strong className="text-[#059669]">+34%</strong> in Cotonou.
                  </>
                )}
              </span>
            </div>
          </section>

          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Informations Générales' : 'General Information'}
            </h2>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#4B4869] mb-1">
                <label htmlFor="prod-title">
                  {isFr ? "Titre de l'article *" : 'Product Title *'}
                </label>
                <span className="text-[#7C7998] tabular-nums">{name.length}/80</span>
              </div>
              <input
                id="prod-title"
                type="text"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3.5 py-2.5 text-sm font-semibold text-[#13112B] outline-none focus:border-[#5433FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Catégorie *' : 'Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5 text-sm font-semibold text-[#13112B] outline-none focus:border-[#5433FF]"
                >
                  <option value="Laptops & PC">Laptops & PC</option>
                  <option value="Accessoires Tech">
                    {isFr ? 'Accessoires Tech' : 'Tech Accessories'}
                  </option>
                  <option value="Périphériques">{isFr ? 'Périphériques' : 'Peripherals'}</option>
                  <option value="Moniteurs">{isFr ? 'Moniteurs' : 'Monitors'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Marque' : 'Brand'}
                </label>
                <div className="flex items-center rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#13112B] outline-none"
                  />
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                {isFr ? 'Description & Fiche technique' : 'Description & Tech Specs'}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] p-3 text-xs text-[#13112B] leading-relaxed outline-none focus:border-[#5433FF]"
              />
            </div>
          </section>
        </div>

        {/* Pricing, Stock & Delivery */}
        <div className="space-y-4">
          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#13112B]">
                {isFr ? 'Prix & Stocks' : 'Pricing & Stock'}
              </h2>
              <span className="rounded-lg bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 text-[11px] font-bold">
                {isFr ? 'Zone XOF / FCFA' : 'XOF / FCFA Zone'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Prix de vente net *' : 'Net Selling Price *'}
                </label>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-base font-extrabold text-[#13112B] outline-none tabular-nums"
                  />
                  <span className="text-xs font-bold text-[#5433FF] ml-2">FCFA</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#4B4869] mb-1">
                  <label>{isFr ? 'Prix barré' : 'Compare-at Price'}</label>
                  {discountPct > 0 && (
                    <span className="text-[#DC2626] font-bold">-{discountPct}%</span>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2.5">
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-base font-bold text-[#4B4869] outline-none tabular-nums"
                  />
                  <span className="text-xs font-semibold text-[#7C7998] ml-2">FCFA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Stock disponible' : 'Available Stock'}
                </label>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setStock((s) => Math.max(0, s - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-[#E5E2F5] flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-extrabold text-[#13112B] tabular-nums">
                    {stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStock((s) => s + 1)}
                    className="w-9 h-9 rounded-lg bg-[#F0EDFF] text-[#5433FF] flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B4869] mb-1">
                  {isFr ? 'Code SKU / Barre' : 'SKU / Barcode'}
                </label>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F5FA] border border-[#E5E2F5] px-3 py-2">
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#13112B] outline-none"
                  />
                  <Barcode className="w-4 h-4 text-[#5433FF] shrink-0" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white border border-[#ECEAF6] p-4 sm:p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#13112B]">
              {isFr ? 'Livraison & Sécurité Marchand' : 'Delivery & Merchant Protection'}
            </h2>

            <div className="rounded-2xl bg-[#F8F7FC] p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#13112B]">Gozem / Zem Express</p>
                  <p className="text-[11px] text-[#7C7998]">
                    {isFr ? 'Courses urbaines Grand Cotonou (1–3h)' : 'Greater Cotonou courier (1–3h)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={gozemExpress}
                onClick={() => setGozemExpress((v) => !v)}
                className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                  gozemExpress ? 'bg-[#059669]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    gozemExpress ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="rounded-2xl bg-[#F8F7FC] p-3.5 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#4B4869]">
                {isFr ? 'Poids estimé du colis' : 'Estimated parcel weight'}
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E5E2F5] px-3 py-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-12 text-right text-xs font-extrabold text-[#5433FF] outline-none tabular-nums"
                />
                <span className="text-xs font-semibold text-[#7C7998]">kg</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#ECFDF5] border border-[#BBF7D0] p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#065F46]">
                  {isFr ? 'Séquestre MINI-B Garanti ✓' : 'MINI-B Escrow Guaranteed ✓'}
                </p>
                <p className="text-[11px] text-[#047857] mt-0.5 leading-relaxed">
                  {isFr
                    ? 'Les fonds de l’acheteur (MoMo, Moov, Celtiis) sont sécurisés et reversés automatiquement sur votre solde dès confirmation de réception.'
                    : 'Buyer funds (MoMo, Moov, Celtiis) are held safely and released automatically to your balance upon delivery confirmation.'}
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onSaveProduct(buildProduct(true), false);
                onShowToast(
                  isFr
                    ? 'Produit publié sur le marché MINI-B !'
                    : 'Product published to MINI-B Marketplace!'
                );
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5433FF] hover:bg-[#4423E8] text-white py-3.5 text-sm font-extrabold transition-colors min-h-[48px]"
            >
              <Rocket className="w-4 h-4" />
              <span>{isFr ? 'Publier sur le Marché' : 'Publish to Marketplace'}</span>
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onSaveProduct(buildProduct(false), true);
                  onShowToast(isFr ? 'Enregistré en brouillon' : 'Saved as draft');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#E5E2F5] hover:bg-[#F5F5FA] text-[#5433FF] py-3 text-xs font-bold min-h-[44px]"
              >
                <Save className="w-4 h-4" />
                <span>{isFr ? 'Enregistrer en brouillon' : 'Save as Draft'}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl bg-[#F5F5FA] hover:bg-[#EAE8F5] text-[#4B4869] py-3 text-xs font-bold min-h-[44px]"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
