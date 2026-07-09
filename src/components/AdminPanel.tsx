import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle, 
  TrendingUp, 
  Box, 
  AlertCircle, 
  X, 
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  Info,
  UserCheck
} from 'lucide-react';
import { Product, Review, NewsPost, PromoBanner } from '../types';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onClose: () => void;
  logoUrl: string;
  onUpdateLogoUrl: (url: string) => void;
  logoText: string;
  onUpdateLogoText: (text: string) => void;
  news: NewsPost[];
  onUpdateNews: (posts: NewsPost[]) => void;
  promoBanner: PromoBanner;
  onUpdatePromoBanner: (banner: PromoBanner) => void;
  adminUsername: string;
  adminPassword: string;
  onUpdateCredentials: (username: string, password: string) => void;
}

export default function AdminPanel({ 
  products, 
  onUpdateProducts, 
  onClose,
  logoUrl,
  onUpdateLogoUrl,
  logoText,
  onUpdateLogoText,
  news,
  onUpdateNews,
  promoBanner,
  onUpdatePromoBanner,
  adminUsername,
  adminPassword,
  onUpdateCredentials
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add-product' | 'logo' | 'news' | 'advertisements' | 'credentials'>('inventory');
  
  // Custom logo form state
  const [logoTextInput, setLogoTextInput] = useState(logoText);
  const [logoUrlInput, setLogoUrlInput] = useState(logoUrl);

  // Admin Credentials form state
  const [newAdminUsernameInput, setNewAdminUsernameInput] = useState(adminUsername);
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState(adminPassword);
  const [confirmAdminPasswordInput, setConfirmAdminPasswordInput] = useState(adminPassword);
  const [credError, setCredError] = useState('');

  // News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Arrivals');
  const [newsContent, setNewsContent] = useState('');

  // Promo Banner form state
  const [promoTitle, setPromoTitle] = useState(promoBanner.title);
  const [promoSubtitle, setPromoSubtitle] = useState(promoBanner.subtitle);
  const [promoImageUrl, setPromoImageUrl] = useState(promoBanner.imageUrl);
  const [promoProductId, setPromoProductId] = useState(promoBanner.productId);
  const [promoIsActive, setPromoIsActive] = useState(promoBanner.isActive);

  // New product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Tech Accessories' | 'Fashion Imports' | 'Home Goods'>('Tech Accessories');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newDescription, setNewDescription] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newSpecs, setNewSpecs] = useState<Record<string, string>>({});
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Editing state for inventory items
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [editingStock, setEditingStock] = useState<string>('');
  const [editingImages, setEditingImages] = useState<string[]>([]);

  // Drag and drop / file feedback
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalItems = products.length;
  const outOfStock = products.filter(p => p.stock <= 0).length;
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / (totalItems || 1);

  // Save changes
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCopyLink = (productId: string, action?: 'cart' | 'checkout') => {
    const base = window.location.origin + window.location.pathname;
    let url = `${base}?productId=${productId}`;
    if (action) {
      url += `&action=${action}`;
    }
    navigator.clipboard.writeText(url).then(() => {
      triggerSuccess(`Copied shareable link to clipboard: ${url}`);
    }).catch((e) => {
      console.error(e);
      alert(`Here is your shareable link: ${url}`);
    });
  };

  // Convert uploaded file to base64
  const handleFileChangeHelper = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      callback(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isEditMode: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileChangeHelper(file, (base64) => {
          if (isEditMode) {
            setEditingImages(prev => [...prev, base64]);
          } else {
            setNewImages(prev => [...prev, base64]);
          }
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleFileChangeHelper(file, (base64) => {
          if (isEditMode) {
            setEditingImages(prev => [...prev, base64]);
          } else {
            setNewImages(prev => [...prev, base64]);
          }
        });
      }
    }
  };

  // Handle Specs Addition
  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setNewSpecs(prev => ({
      ...prev,
      [newSpecKey.trim()]: newSpecVal.trim()
    }));
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    setNewSpecs(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Submit New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) {
      alert('Please fill out Name and Price fields.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const stockNum = parseInt(newStock) || 0;

    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please provide a valid price.');
      return;
    }

    // Default placeholder image if none uploaded
    const finalImages = newImages.length > 0 
      ? newImages 
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'];

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      category: newCategory,
      price: priceNum,
      rating: 5.0,
      reviewsCount: 0,
      images: finalImages,
      description: newDescription || 'Premium imported accessory curated by Deeplowmark.',
      specs: newSpecs,
      featured: isFeatured,
      bestSeller: isBestSeller,
      reviews: [],
      stock: stockNum,
    };

    onUpdateProducts([newProduct, ...products]);
    triggerSuccess(`Successfully registered "${newName}" in the marketplace!`);

    // Reset fields
    setNewName('');
    setNewPrice('');
    setNewStock('10');
    setNewDescription('');
    setNewImages([]);
    setNewSpecs({});
    setIsFeatured(false);
    setIsBestSeller(false);
    setActiveTab('inventory');
  };

  // Quick edit trigger
  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditingPrice(p.price.toString());
    setEditingStock(p.stock.toString());
    setEditingImages([...p.images]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingImages([]);
  };

  // Save quick edits
  const handleSaveEdits = (productId: string) => {
    const priceNum = parseFloat(editingPrice);
    const stockNum = parseInt(editingStock);

    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please provide a valid price.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('Please provide a valid stock count.');
      return;
    }

    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: priceNum,
          stock: stockNum,
          images: editingImages.length > 0 ? editingImages : p.images
        };
      }
      return p;
    });

    onUpdateProducts(updated);
    setEditingId(null);
    triggerSuccess('Product coordinates updated successfully!');
  };

  // Delete product
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you absolutely sure you want to retire "${productName}" from the marketplace?`)) {
      const filtered = products.filter(p => p.id !== productId);
      onUpdateProducts(filtered);
      triggerSuccess(`"${productName}" was removed from active catalog.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="merchant-admin-view">
      
      {/* Title Header with Close button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-slate-900 text-white rounded-lg p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">Merchant Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Operations Dashboard</h1>
          <p className="text-slate-300 text-xs max-w-lg">
            Control pricing models, upload shipment visuals, and oversee catalog availability in Ghana Cedis (GH₵).
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-700 hover:border-white rounded text-slate-300 hover:text-white text-xs font-bold transition-all relative z-10 cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>

      {/* Operation Feedback Toast */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-100 animate-fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Interactive Metric Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block font-sans">Active Shipments</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{totalItems} Products</span>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-800">
            <Box className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block font-sans">Avg Import Price</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">GH₵{avgPrice.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-800">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block font-sans">Stock Alerts</span>
            <span className="text-2xl font-black mt-0.5 block font-mono text-amber-600">
              {outOfStock > 0 ? `${outOfStock} Depleted` : '0 Depleted'}
            </span>
          </div>
          <div className="p-3 rounded-full bg-slate-50 text-slate-800">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap border-b border-slate-200 mb-8 gap-x-5 gap-y-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Inventory ({totalItems})
        </button>
        <button
          onClick={() => setActiveTab('add-product')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'add-product'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          Import New Shipment
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'logo'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Change Website Logo
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'news'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Post News
        </button>
        <button
          onClick={() => setActiveTab('advertisements')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'advertisements'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Advertise Products
        </button>
        <button
          onClick={() => setActiveTab('credentials')}
          className={`pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'credentials'
              ? 'border-amber-500 text-slate-900 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Admin Credentials
        </button>
      </div>

      {/* TAB 1: ACTIVE INVENTORY MANAGEMENT TABLE */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Upload item images and adjust marketplace pricing below
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Base64 Local Storage Persistence Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Product Visual</th>
                  <th className="px-6 py-3.5">Title & Category</th>
                  <th className="px-6 py-3.5">Market Price</th>
                  <th className="px-6 py-3.5">Stock Count</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => {
                  const isEditing = editingId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Product Visual */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={isEditing && editingImages.length > 0 ? editingImages[0] : product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded border border-slate-200 bg-white"
                            referrerPolicy="no-referrer"
                          />
                          {isEditing && (
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => editFileInputRef.current?.click()}
                                className="px-2 py-1 bg-amber-500 text-slate-950 rounded text-[9px] font-black uppercase tracking-wider hover:bg-amber-600 transition-all cursor-pointer"
                              >
                                Upload
                              </button>
                              <input 
                                type="file"
                                ref={editFileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, true)}
                              />
                              {editingImages.length > 1 && (
                                <span className="text-[8px] font-bold text-slate-400 font-mono">
                                  {editingImages.length} Visuals
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title and Category */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm leading-tight">{product.name}</p>
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans mt-1 inline-block">
                              {product.category}
                            </span>
                          </div>
                          
                          {/* Shareable Links Actions */}
                          <div className="flex flex-wrap gap-1.5 pt-1" id={`share-actions-${product.id}`}>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block w-full">
                              Share Links:
                            </span>
                            <button
                              onClick={() => handleCopyLink(product.id)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-[9px] font-bold rounded transition-colors cursor-pointer"
                              title="Direct link to open details popup"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleCopyLink(product.id, 'cart')}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-[9px] font-bold rounded transition-colors cursor-pointer"
                              title="Adds product to cart and opens drawer"
                            >
                              + Cart
                            </button>
                            <button
                              onClick={() => handleCopyLink(product.id, 'checkout')}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-[9px] font-bold rounded transition-colors cursor-pointer"
                              title="Adds product to cart and initiates immediate checkout flow"
                            >
                              ⚡ Checkout
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Price (Editable) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-1 max-w-[120px]">
                            <span className="font-bold text-slate-500 text-xs">GH₵</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(e.target.value)}
                              className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                              placeholder="0.00"
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            GH₵{product.price.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock Count (Editable) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingStock}
                            onChange={(e) => setEditingStock(e.target.value)}
                            className="w-20 p-1.5 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            placeholder="Stock"
                          />
                        ) : (
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            product.stock <= 0 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-slate-50 text-slate-700'
                          }`}>
                            {product.stock} Units
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdits(product.id)}
                                className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                                title="Save Coordinates"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(product)}
                                className="px-2.5 py-1.5 border border-slate-200 text-slate-700 rounded hover:bg-slate-100 hover:text-slate-900 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                              >
                                Edit Item
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-1.5 border border-slate-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                                title="Remove Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: IMPORT NEW PRODUCT FORM */}
      {activeTab === 'add-product' && (
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Main product info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Core Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 font-sans tracking-wider">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Vintage Leather Suede Wallet"
                    className="p-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  />
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 font-sans tracking-wider">
                    Category Range *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="p-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Tech Accessories">Tech Accessories</option>
                    <option value="Fashion Imports">Fashion Imports</option>
                    <option value="Home Goods">Home Goods</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Price in GH₵ */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 font-sans tracking-wider">
                    Market Value (GHS GH₵) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-xs font-bold text-slate-400 font-mono">GH₵</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 150.00"
                      className="w-full pl-12 pr-3 py-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Stock availability */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 font-sans tracking-wider">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="e.g. 10"
                    className="p-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-500 font-sans tracking-wider">
                  Description Snippet
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the styling details, premium import quality aspects, and functional specifics..."
                  className="p-3 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-medium resize-none"
                />
              </div>
            </div>

            {/* Dynamic Product Specs Configuration */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Product Technical Specs
                </h3>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">Optional</span>
              </div>

              {/* Active temporary Specs Pill display */}
              {Object.keys(newSpecs).length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded border border-slate-100">
                  {Object.entries(newSpecs).map(([key, val]) => (
                    <div key={key} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 shadow-2xs">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-800">{val}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSpec(key)}
                        className="text-rose-400 hover:text-rose-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-500 font-sans tracking-widest">Spec Label</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Material"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="p-2.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-500 font-sans tracking-widest">Spec Value</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Genuine Calf Leather"
                    value={newSpecVal}
                    onChange={(e) => setNewSpecVal(e.target.value)}
                    className="p-2.5 border border-slate-200 rounded text-xs bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="p-2.5 border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs rounded transition-all cursor-pointer h-[38px] flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Parameter
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Image Drag & Drop Uploader & Badges */}
          <div className="space-y-6">
            {/* Visual Assets Drag Drop Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Product Visuals *
              </h3>

              {/* Drag and Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-amber-500 bg-amber-500/5' 
                    : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*"
                  className="hidden" 
                  onChange={(e) => handleFileSelect(e, false)} 
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-bold text-slate-700">Drag images here or click to browse</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports JPEG, PNG, WEBP. Converted instantly to offline storage strings.</p>
              </div>

              {/* Uploaded visual list view */}
              {newImages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-sans block">
                    Uploaded visual assets ({newImages.length})
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {newImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded border border-slate-200 overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Badges / Visibility Controls */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Visibility Controls
              </h3>

              <div className="space-y-3.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500 focus:outline-none"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Feature on Homepage
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Places this shipment in the main sliding highlights section.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4.5 h-4.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500 focus:outline-none"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      Mark as Best Seller
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Displays a prominent ribbon badge indicating heavy client acquisition.</p>
                  </div>
                </label>
              </div>

              {/* Submission Button */}
              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md mt-6 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Save to active marketplace
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: CUSTOMIZE WEBSITE BRANDING LOGO */}
      {activeTab === 'logo' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Customize Website Branding
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Change the logo image/icon and custom brand title displayed across the store.
            </p>
          </div>

          <div className="space-y-4">
            {/* Logo Text */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Brand Text Name
              </label>
              <input
                type="text"
                value={logoTextInput}
                onChange={(e) => setLogoTextInput(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="e.g. DEEPLOWMARK"
              />
            </div>

            {/* Logo Image URL / Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Logo Image Source
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                  className="flex-grow p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                  placeholder="Paste direct image URL or upload below"
                />
              </div>

              {/* Upload Drop Area for Logo */}
              <div
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                  dragActive ? 'border-amber-500 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                      handleFileChangeHelper(file, (base64) => {
                        setLogoUrlInput(base64);
                      });
                    }
                  }
                }}
                onClick={() => {
                  const logoInput = document.createElement('input');
                  logoInput.type = 'file';
                  logoInput.accept = 'image/*';
                  logoInput.onchange = (e: any) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChangeHelper(e.target.files[0], (base64) => {
                        setLogoUrlInput(base64);
                      });
                    }
                  };
                  logoInput.click();
                }}
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-slate-700">Click or drag logo image file here</p>
                <p className="text-[9px] text-slate-400 font-mono">Recommended square ratio (PNG/WEBP)</p>
              </div>
            </div>

            {/* Live Preview Area */}
            <div className="bg-slate-900 text-white p-4 rounded-lg flex items-center gap-3 border border-slate-800">
              <div className="text-[9px] font-black uppercase text-amber-500 tracking-widest font-mono shrink-0 border-r border-slate-800 pr-3">
                Live Header Preview
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={logoUrlInput || '/logo.png'}
                  alt="Logo Preview"
                  className="w-7 h-7 object-cover rounded bg-slate-955 border border-slate-800"
                  onError={(e) => {
                    (e.target as any).src = '/logo.png';
                  }}
                  referrerPolicy="no-referrer"
                />
                <span className="font-extrabold text-sm tracking-tighter text-white uppercase font-display leading-none">
                  {logoTextInput.toUpperCase() === 'DEEPLOWMARK' ? (
                    <>
                      <span className="text-amber-500">DEEP</span>LOWMARK
                    </>
                  ) : (
                    logoTextInput
                  )}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                onUpdateLogoText(logoTextInput);
                onUpdateLogoUrl(logoUrlInput);
                triggerSuccess('Store branding updated successfully!');
              }}
              className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-955 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md mt-4 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Apply Branding Changes
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PUBLISH BRAND NEWS */}
      {activeTab === 'news' && (
        <div className="space-y-8 animate-fade-in">
          {/* Create News Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-w-3xl mx-auto space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Plus className="w-4 h-4 text-amber-500" />
                Publish Brand News & Announcement
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Post notifications, same-day delivery updates, or sale events directly on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                  placeholder="e.g. Same-Day Dispatch Active in Greater Accra"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                  Category Tag
                </label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                >
                  <option value="Arrivals">Arrivals & Inventory</option>
                  <option value="Logistics">Logistics & Dispatch</option>
                  <option value="Announcements">General Announcement</option>
                  <option value="Clearance">Clearance & Sale</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Announcement Content
              </label>
              <textarea
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="Compose announcement message details..."
                required
              />
            </div>

            <button
              onClick={() => {
                if (!newsTitle.trim() || !newsContent.trim()) {
                  alert('Please provide a title and content for the announcement.');
                  return;
                }
                const newPost: NewsPost = {
                  id: `news-${Date.now()}`,
                  title: newsTitle.trim(),
                  category: newsCategory,
                  content: newsContent.trim(),
                  date: new Date().toISOString().split('T')[0]
                };
                onUpdateNews([newPost, ...news]);
                setNewsTitle('');
                setNewsContent('');
                triggerSuccess('Published new brand announcement successfully!');
              }}
              className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-955 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Publish Announcement to Homepage
            </button>
          </div>

          {/* Manage Active Announcements */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs max-w-4xl mx-auto">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                Active Brand Announcements ({news.length})
              </h3>
            </div>

            {news.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs">
                No announcements published yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {news.map((item) => (
                  <div key={item.id} className="p-4 flex justify-between items-start gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold font-mono uppercase text-[9px] rounded-full border border-amber-200">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{item.date}</span>
                      </div>
                      <h4 className="text-slate-900 font-extrabold text-xs">{item.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">{item.content}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to remove this news post?')) {
                          onUpdateNews(news.filter(n => n.id !== item.id));
                          triggerSuccess('Announcement deleted.');
                        }
                      }}
                      className="p-1.5 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded bg-white hover:bg-rose-50 transition-colors shadow-xs"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ADVERTISE PRODUCTS (PROMO BANNER) */}
      {activeTab === 'advertisements' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              Configure Homepage Promo Advertisement
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Set up a high-impact promotional banner on the Homepage promoting a specific curated item.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
              <input
                type="checkbox"
                id="promoActive"
                checked={promoIsActive}
                onChange={(e) => setPromoIsActive(e.target.checked)}
                className="w-4.5 h-4.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <label htmlFor="promoActive" className="text-xs font-bold text-slate-900 cursor-pointer">
                Enable Promo Banner Advertisement on Homepage
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                  Promo Headline
                </label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                  placeholder="e.g. Limited Edition Workspace Series"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                  Linked Product Selection
                </label>
                <select
                  value={promoProductId}
                  onChange={(e) => setPromoProductId(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                >
                  <option value="">-- Do Not Link Any Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.name} - GH₵{p.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Promo Subtitle / Pitch
              </label>
              <textarea
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                rows={2}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="Briefly state discount margins or unique value pitch..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Promo Image Source
              </label>
              <input
                type="text"
                value={promoImageUrl}
                onChange={(e) => setPromoImageUrl(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="Paste direct image URL or upload below"
              />

              {/* Upload Drop Area for Promo Image */}
              <div
                className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                  dragActive ? 'border-amber-500 bg-amber-50/10' : 'border-slate-200 hover:border-slate-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                      handleFileChangeHelper(file, (base64) => {
                        setPromoImageUrl(base64);
                      });
                    }
                  }
                }}
                onClick={() => {
                  const promoInput = document.createElement('input');
                  promoInput.type = 'file';
                  promoInput.accept = 'image/*';
                  promoInput.onchange = (e: any) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChangeHelper(e.target.files[0], (base64) => {
                        setPromoImageUrl(base64);
                      });
                    }
                  };
                  promoInput.click();
                }}
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-slate-700">Click or drag banner visual file here</p>
                <p className="text-[9px] text-slate-400 font-mono">High definition landscape ratio recommended (WEBP/JPEG)</p>
              </div>
            </div>

            <button
              onClick={() => {
                onUpdatePromoBanner({
                  title: promoTitle,
                  subtitle: promoSubtitle,
                  imageUrl: promoImageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
                  productId: promoProductId,
                  isActive: promoIsActive
                });
                triggerSuccess('Promo banner advertisement coordinates successfully updated!');
              }}
              className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-955 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Apply Banner Advertisement Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: ADMIN SECURITY CREDENTIALS */}
      {activeTab === 'credentials' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-w-xl mx-auto space-y-6 animate-fade-in" id="credentials-tab-view">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <UserCheck className="w-4 h-4 text-amber-500" />
              Change Admin Credentials
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Update your administrative username and secure password used for accessing the Merchant Gate.
            </p>
          </div>

          {credError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold text-center" id="credentials-error-msg">
              ⚠️ {credError}
            </div>
          )}

          <div className="space-y-4">
            {/* New Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                New Administrative Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                value={newAdminUsernameInput}
                onChange={(e) => {
                  setNewAdminUsernameInput(e.target.value);
                  setCredError('');
                }}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="e.g. eagleup7"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                New Security Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={newAdminPasswordInput}
                onChange={(e) => {
                  setNewAdminPasswordInput(e.target.value);
                  setCredError('');
                }}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="••••••••••••"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-sans">
                Confirm New Password
              </label>
              <input
                id="admin-confirm-password-input"
                type="password"
                value={confirmAdminPasswordInput}
                onChange={(e) => {
                  setConfirmAdminPasswordInput(e.target.value);
                  setCredError('');
                }}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50"
                placeholder="••••••••••••"
              />
            </div>

            {/* Save Button */}
            <button
              id="admin-save-credentials-btn"
              onClick={() => {
                if (!newAdminUsernameInput.trim()) {
                  setCredError('Administrative username cannot be left blank.');
                  return;
                }
                if (!newAdminPasswordInput) {
                  setCredError('Security password cannot be empty.');
                  return;
                }
                if (newAdminPasswordInput !== confirmAdminPasswordInput) {
                  setCredError('Passwords do not match. Please verify your typing.');
                  return;
                }
                onUpdateCredentials(newAdminUsernameInput.trim(), newAdminPasswordInput);
                triggerSuccess('Merchant credentials updated successfully!');
              }}
              className="w-full bg-slate-950 hover:bg-amber-500 hover:text-slate-955 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md mt-4 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Apply Credential Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
