
import React, { useState, useEffect } from 'react';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  is_large: boolean;
  sort_order: number;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 從後台獲取 Services 資料
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services?populate=*&sort=sort_order:asc');
        if (!response.ok) throw new Error('Failed to fetch services');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          const formattedServices = result.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            icon: item.icon || 'precision_manufacturing',
            is_large: item.is_large || false,
            sort_order: item.sort_order || 0
          }));
          setServices(formattedServices);
          console.log('✅ Services 資料已從後台載入:', formattedServices.length, '筆');
        }
      } catch (error) {
        console.error('❌ Services API 錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="min-h-screen bg-base flex items-center justify-center border-b-4 border-secondary">
        <div className="text-accent">Loading...</div>
      </section>
    );
  }

  // 如果沒有資料，顯示空狀態
  if (services.length === 0) {
    return (
      <section id="services" className="min-h-screen bg-base flex items-center justify-center border-b-4 border-secondary">
        <div className="text-center">
          <p className="text-text-gray">尚無服務項目資料</p>
        </div>
      </section>
    );
  }
  // 分離大卡片和小卡片
  const largeService = services.find(s => s.is_large);
  const smallServices = services.filter(s => !s.is_large);
  
  console.log('📊 Services 資料分析:');
  console.log('  - 總筆數:', services.length);
  console.log('  - 大卡片 (is_large=true):', largeService ? 1 : 0, largeService);
  console.log('  - 小卡片 (is_large=false):', smallServices.length, smallServices);

  return (
    <section id="services" className="min-h-screen bg-base flex items-center border-b-4 border-secondary overflow-hidden py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center">
        <span className="text-accent font-medium uppercase tracking-[0.3em] text-xs mb-4 block">What we offer</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal italic mb-12 md:mb-16 text-accent">Our Services</h2>
        
        {/* 使用新的排版：左側大卡片，右側小卡片網格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* 左側大卡片 */}
          {largeService && (
            <div className="bg-primary/20 p-8 md:p-10 lg:p-12 rounded-3xl border border-text-gray/20 shadow-lg transition-all duration-250 hover:shadow-xl group flex flex-col">
              <div className="w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons text-accent" style={{ fontSize: '40px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>{largeService.icon}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-accent mb-4">{largeService.title}</h3>
              <p className="text-sm md:text-base leading-relaxed flex-grow mb-6" style={{ color: '#000000' }}>
                {largeService.description}
              </p>
              <a href="#about" className="text-accent font-bold flex items-center gap-2 hover:translate-x-1 transition-transform duration-250 self-start">
                Learn More <span className="material-icons">arrow_forward</span>
              </a>
            </div>
          )}

          {/* 右側小卡片網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {smallServices.map((service) => (
              <div key={service.id} className="bg-primary/10 p-6 md:p-8 rounded-3xl border border-text-gray/20 shadow-lg transition-all duration-250 hover:shadow-xl group flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-icons text-accent" style={{ fontSize: '40px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{service.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-accent mb-3">{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
