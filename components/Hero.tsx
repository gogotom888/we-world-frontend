
import React, { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: {
    url: string;
  };
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  image_effect?: string;
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // 從後台獲取 Banner 資料
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?populate=*&sort=sort_order:asc&filters[is_active][$eq]=true');
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        
        console.log('Banner API Response:', data);
        
        if (data.data && data.data.length > 0) {
          const formattedBanners = data.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            subtitle: item.subtitle || '',
            description: item.description || '',
            image_url: item.image?.url || item.image_url || '',
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
            image_effect: item.image_effect || 'none'
          })).sort((a, b) => a.sort_order - b.sort_order);
          
          setBanners(formattedBanners);
          console.log('✅ Banner 資料已從後台載入:', formattedBanners.length, '筆');
          console.log('Banner 順序:', formattedBanners.map(b => `${b.title} (${b.sort_order})`).join(', '));
        } else {
          console.warn('⚠️ 後台 Banner 資料為空，請到後台 Content Manager 添加 Banner');
          console.warn('👉 訪問: http://localhost:3001/admin/content-manager/collection-types/api::banner.banner');
          setBanners([]);
        }
      } catch (error) {
        console.error('❌ Banner API 錯誤:', error);
        console.error('請檢查:');
        console.error('1. Strapi 後台是否正在運行');
        console.error('2. Settings > Roles > Public > BANNER > find, findOne 權限是否已勾選');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 預設 Banner 資料 (備用)
  const defaultBanners: Banner[] = [
    {
      id: 1,
      image_url: "https://cdn.pixabay.com/photo/2020/11/23/16/51/cnc-5770326_1280.jpg",
      title: "/meet",
      subtitle: "your totally satisfaction.",
      description: "We are a team of professionals",
      sort_order: 0,
      is_active: true,
      image_effect: 'mirror'
    },
    {
      id: 2,
      image_url: "/banner2-laser-cutting.png",
      title: "/precision",
      subtitle: "in every detail.",
      description: "Advanced laser cutting technology",
      sort_order: 1,
      is_active: true,
      image_effect: 'none'
    },
    {
      id: 3,
      image_url: "/banner3-laser-craft.jpg",
      title: "/innovation",
      subtitle: "through craftsmanship.",
      description: "Where tradition meets technology",
      sort_order: 2,
      is_active: true,
      image_effect: 'grayscale'
    }
  ];

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-accent border-b-4 border-secondary">
        <div className="text-white text-xl">Loading Banner...</div>
      </section>
    );
  }

  // 如果沒有 Banner 資料，顯示提示訊息
  if (banners.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 border-b-4 border-secondary">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🎨</div>
          <h2 className="text-3xl font-bold text-white mb-4">Banner 資料尚未設置</h2>
          <p className="text-slate-300 text-lg mb-6">
            請到後台 Content Manager 添加 Banner 資料
          </p>
          <div className="bg-slate-800 rounded-lg p-6 text-left">
            <p className="text-slate-400 text-sm mb-3">📝 設置步驟:</p>
            <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
              <li>訪問 <a href="http://localhost:3001/admin" className="text-blue-400 hover:underline" target="_blank">Strapi 後台</a></li>
              <li>進入 Content Manager → Banner (首頁輪播)</li>
              <li>點擊 "Create new entry" 創建 Banner</li>
              <li>填寫 title, subtitle, description, image_url</li>
              <li>設置 sort_order, is_active, image_effect</li>
              <li>點擊 "Publish" 發布</li>
              <li>刷新前台頁面</li>
            </ol>
            <p className="text-yellow-400 text-sm mt-4">⚠️ 記得開啟 Public 角色的 Banner 讀取權限!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-accent border-b-4 border-secondary">
      {/* Background Layer with Slides */}
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* 移除遮罩层 */}
            <img 
              alt={`Banner ${index + 1}`}
              className={`w-full h-full object-cover object-center ${
                banner.image_effect === 'mirror' ? 'scale-x-[-1]' : ''
              } ${
                banner.image_effect === 'grayscale' ? 'grayscale' : ''
              }`} 
              src={banner.image_url}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000";
              }}
            />
          </div>
        ))}
      </div>

      {/* Content Layer with Dynamic Text */}
      <div className="relative z-20 h-full flex flex-col justify-between max-w-7xl mx-auto px-6 md:px-12 w-full py-12 pb-16">
        
        {/* Banner Slogan - 居中显示 */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <div className="text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-light leading-[0.95] mb-6">
              <span className="text-primary font-display font-bold block mb-3 text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                {banners[currentSlide].title}
              </span>
              <span className="text-base font-light block text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                {banners[currentSlide].subtitle}
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-16 h-[2px] bg-text-gray"></div>
              <p className="text-text-gray text-lg md:text-xl font-light tracking-wide">
                {banners[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Cards - 桌面端显示 / 手机端显示圆点 */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {banners.map((banner, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`text-left p-6 rounded-lg transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-base/20 backdrop-blur-md border-2 border-base/50'
                  : 'bg-accent/30 backdrop-blur-sm border-2 border-transparent hover:bg-base/10 hover:border-base/30'
              }`}
            >
              <h3 className="text-base text-lg md:text-xl font-medium mb-2">
                {banner.title.replace('/', '')} {banner.subtitle}
              </h3>
              <p className="text-base/70 text-sm">
                {banner.description}
              </p>
            </button>
          ))}
        </div>

        {/* 手机端圆点指示器 */}
        <div className="md:hidden flex items-center justify-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-base'
                  : 'w-3 h-3 bg-base/50 hover:bg-base/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>


    </section>
  );
};

export default Hero;
