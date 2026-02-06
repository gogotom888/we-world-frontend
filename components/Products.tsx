
import React, { useState, useRef, useEffect } from 'react';
import { ProductItem } from '../types';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 從後台獲取產品分類
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/product-categories?sort=sort_order:asc');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const result = await response.json();
        
        if (result.data) {
          console.log('🔍 後台返回的原始分類資料:', result.data);
          const formattedCategories = result.data.map((item: any) => ({
            id: item.id,
            name: item.name || '',
            slug: item.slug || ''
          }));
          setCategories(formattedCategories);
          console.log('✅ Categories 資料已從後台載入:', formattedCategories.length, '筆');
          console.log('📋 格式化後的分類:', formattedCategories);
        }
      } catch (error) {
        console.error('❌ Categories API 錯誤:', error);
      }
    };

    fetchCategories();
  }, []);

  // 從後台獲取產品資料
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = activeCategory === 'all' 
          ? '/api/products?populate=*&sort=id:asc'
          : `/api/products?populate=*&filters[category][slug][$eq]=${activeCategory}&sort=id:asc`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const result = await response.json();
        
        if (result.data) {
          const formattedProducts = result.data.map((item: any) => {
            // 处理图片 URL
            const getImageUrl = (img: any) => {
              if (!img) return '';
              const url = img.url || '';
              // 如果是相对路径，添加 Strapi 基础 URL
              if (url.startsWith('/uploads')) {
                return `http://localhost:1337${url}`;
              }
              return url;
            };
            
            const firstImage = item.images?.[0];
            const imageUrl = firstImage ? getImageUrl(firstImage) : (item.image_url || `https://placehold.co/400x300/E3F0FA/1e3a8a?text=${encodeURIComponent(item.name?.split(' ')[0] || 'Product')}`);
            const allImages = item.images?.map((img: any) => getImageUrl(img)).filter(url => url) || [imageUrl];
            
            console.log('Product:', item.name);
            console.log('  - Raw images:', item.images);
            console.log('  - First image:', firstImage);
            console.log('  - Image URL:', imageUrl);
            
            return {
              id: item.id,
              name: item.name || '',
              category: item.category?.slug || 'nameplate',
              image: imageUrl,
              images: allImages,
              moq: item.moq || '',
              material: item.material || '',
              size: item.size || '',
              process: item.process || '',
              content: item.content || ''
            };
          });
          setProducts(formattedProducts);
          console.log('✅ Products 資料已從後台載入:', formattedProducts.length, '筆');
          console.log('Products 資料:', formattedProducts);
        }
      } catch (error) {
        console.error('❌ Products API 錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  // 監聽URL參數變化來切換分類
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const category = params.get('category');
      
      if (category) {
        setActiveCategory(category);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const openProductModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const navigateProduct = (direction: 'prev' | 'next') => {
    if (!selectedProduct) return;
    
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredProducts.length - 1;
    } else {
      newIndex = currentIndex < filteredProducts.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedProduct(filteredProducts[newIndex]);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedProduct?.images) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedProduct.images!.length - 1);
    } else {
      setCurrentImageIndex(prev => prev < selectedProduct.images!.length - 1 ? prev + 1 : 0);
    }
  };

  const filteredProducts = products;

  if (loading) {
    return (
      <section id="products" className="min-h-screen bg-secondary flex items-center justify-center border-b-4 border-primary">
        <div className="text-accent">Loading...</div>
      </section>
    );
  }

  // 動態建立分類 Tabs - 強制去重複
  const uniqueCategories = categories.reduce((acc: typeof categories, cat) => {
    // 檢查是否已存在相同 slug 或 name 的分類
    const exists = acc.some(c => c.slug === cat.slug || c.name === cat.name);
    if (!exists) {
      acc.push(cat);
    }
    return acc;
  }, []);
  
  const categoryTabs = [
    { id: 'all', name: 'ALL' },
    ...uniqueCategories.map(cat => ({ id: cat.slug, name: cat.name }))
  ];
  
  console.log('原始分類數量:', categories.length);
  console.log('去重後分類數量:', uniqueCategories.length);
  console.log('分類 Tabs:', categoryTabs);

  return (
    <section id="products" className="min-h-screen bg-secondary flex items-center border-b-4 border-primary overflow-hidden py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center py-8 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4 md:gap-6">
          <div>
            <span className="text-accent font-medium uppercase tracking-[0.3em] text-xs mb-4 block">Craftsmanship</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal italic text-accent tracking-tight">Our Products</h2>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-black tracking-widest uppercase transition-all duration-250 border-2 ${
                  activeCategory === cat.id
                  ? 'bg-primary border-primary text-accent shadow-lg'
                  : 'bg-transparent border-accent/30 text-text-gray hover:border-primary hover:bg-secondary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid with Navigation Arrows */}
        <div className="relative">
          {/* Left Arrow - 所有设备显示 */}
          <button 
            onClick={() => scroll('left')}
            className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-hover-blue text-accent rounded-full shadow-xl items-center justify-center transition-all duration-250 hover:scale-110 active:scale-95 group"
            aria-label="Scroll left"
          >
            <span className="material-icons text-xl md:text-2xl group-hover:text-white transition-colors">chevron_left</span>
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => openProductModal(product)}
                  className="flex-none w-48 md:w-64 relative group bg-base border border-text-gray/20 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer animate-fade-in-up"
                >
                  {/* Image Container with 3:2 Aspect Ratio */}
                  <div className="aspect-[3/2] w-full bg-base overflow-hidden p-4">
                    <img 
                      alt={product.name} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                      src={product.image}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300/E3F0FA/000000?text=${encodeURIComponent(product.name.split(' ')[0])}`;
                      }}
                    />
                  </div>
                  
                  {/* Bottom Label - Navy Blue Industrial Style */}
                  <div className="w-full bg-primary py-2 px-3 transition-all group-hover:bg-hover-blue">
                    <p className="text-[10px] md:text-[11px] font-bold text-accent group-hover:text-white text-center leading-tight uppercase tracking-wide line-clamp-1 transition-colors">
                      {product.name}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary rounded-xl pointer-events-none transition-colors duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - 所有设备显示 */}
          <button 
            onClick={() => scroll('right')}
            className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-hover-blue text-accent rounded-full shadow-xl items-center justify-center transition-all duration-250 hover:scale-110 active:scale-95 group"
            aria-label="Scroll right"
          >
            <span className="material-icons text-xl md:text-2xl group-hover:text-white transition-colors">chevron_right</span>
          </button>
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-gray font-medium tracking-widest uppercase text-sm">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
          onClick={closeProductModal}
        >
          <div 
            className="relative bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - 按钮中心对齐底框顶部边界，位于外围 */}
            <button
              onClick={closeProductModal}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-primary hover:bg-hover-blue text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ top: '0' }}
            >
              <span className="material-icons text-2xl">close</span>
            </button>

            {/* Product Navigation Arrows - 按钮中心对齐底框左右边界，位于外围 */}
            <button
              onClick={() => navigateProduct('prev')}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 bg-primary hover:bg-hover-blue text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ left: '0' }}
            >
              <span className="material-icons text-3xl">chevron_left</span>
            </button>
            <button
              onClick={() => navigateProduct('next')}
              className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 bg-primary hover:bg-hover-blue text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ right: '0' }}
            >
              <span className="material-icons text-3xl">chevron_right</span>
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[85vh] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Left: Image Gallery */}
              <div className="relative flex flex-col">
                {/* Main Image - 限制高度 */}
                <div className="relative bg-white rounded-lg p-4 mb-4 max-h-[600px] flex items-center justify-center">
                  <img
                    src={selectedProduct.images?.[currentImageIndex] || selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-h-[550px] w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 bg-white rounded-lg p-1 border-2 transition-all ${
                          idx === currentImageIndex ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Details */}
              <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-medium text-slate-100">
                  {selectedProduct.name}
                </h2>
                
                <div className="space-y-4">
                  {/* MOQ */}
                  {selectedProduct.moq && (
                    <div>
                      <h3 className="text-base font-semibold text-slate-300 mb-1">Minimum Order Quantity(MOQ)</h3>
                      <p className="text-slate-400 text-sm">{selectedProduct.moq}</p>
                    </div>
                  )}

                  {/* Material */}
                  {selectedProduct.material && (
                    <div>
                      <h3 className="text-base font-semibold text-slate-300 mb-1">Material</h3>
                      <p className="text-slate-400 text-sm">{selectedProduct.material}</p>
                    </div>
                  )}

                  {/* Size */}
                  {selectedProduct.size && (
                    <div>
                      <h3 className="text-base font-semibold text-slate-300 mb-1">Size</h3>
                      <p className="text-slate-400 text-sm">{selectedProduct.size}</p>
                    </div>
                  )}

                  {/* Process */}
                  {selectedProduct.process && (
                    <div>
                      <h3 className="text-base font-semibold text-slate-300 mb-1">Process</h3>
                      <p className="text-slate-400 text-sm">{selectedProduct.process}</p>
                    </div>
                  )}

                  {/* Content */}
                  {selectedProduct.content && (
                    <div className="border-t border-slate-700 pt-4">
                      <h3 className="text-base font-semibold text-slate-300 mb-2">Content</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{selectedProduct.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
