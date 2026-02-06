
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
  return (
    <section id="services" className="min-h-screen bg-base flex items-center border-b-4 border-secondary overflow-hidden py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center">
        <span className="text-accent font-medium uppercase tracking-[0.3em] text-xs mb-4 block">What we offer</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal italic mb-12 md:mb-16 text-accent">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            service.is_large ? (
              // Large Item - 第一筆預設 is_large=true
              <div key={service.id} className="md:col-span-2 bg-primary p-6 md:p-10 rounded-3xl border border-text-gray/20 shadow-lg transition-all duration-250 group">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <span className="material-icons text-5xl md:text-6xl text-accent scale-110 transition-transform duration-250">{service.icon}</span>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-accent">{service.title}</h3>
                </div>
                <p className="text-text-dark text-base md:text-lg leading-relaxed">
                  {service.description}
                </p>
                <button className="mt-6 md:mt-8 text-accent font-bold flex items-center gap-2 hover:translate-x-1 transition-transform duration-250">
                  Learn More <span className="material-icons text-sm">east</span>
                </button>
              </div>
            ) : (
              // Regular Item
              <div key={service.id} className="bg-secondary p-6 md:p-10 rounded-3xl border border-text-gray/20 flex flex-col items-center justify-center text-center hover:bg-base transition-all duration-250 hover:shadow-lg group">
                <div className="w-16 h-16 rounded-full bg-base flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-icons text-4xl text-accent">{service.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-accent">{service.title}</h3>
                <p className="mt-4 text-text-gray text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                  {service.description}
                </p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
