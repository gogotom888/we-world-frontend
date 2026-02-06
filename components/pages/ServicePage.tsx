import React, { useState, useEffect } from 'react';
import PageLayout from '../shared/PageLayout';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const breadcrumbs = [
    { label: 'SERVICE 服務' }
  ];

  // 從後台獲取 Services 資料
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services?populate=*&sort=sort_order:asc');
        if (!response.ok) throw new Error('Failed to fetch services');
        const result = await response.json();
        
        console.log('Services API Response:', result);
        
        if (result.data && result.data.length > 0) {
          const formattedServices = result.data.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            description: item.description || '',
            icon: item.icon || 'precision_manufacturing',
            features: item.features || []
          }));
          setServices(formattedServices);
          console.log('✅ Services 資料已從後台載入:', formattedServices.length, '筆');
        } else {
          // 使用預設資料
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('❌ Services API 錯誤:', error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const defaultServices = [
    {
      icon: 'precision_manufacturing',
      title: 'CNC 精密加工',
      description: '採用最先進的CNC加工設備，提供高精度、高效率的零件加工服務。',
      features: [
        '3軸、4軸、5軸CNC加工',
        '精度可達±0.005mm',
        '支援多種材質加工',
        '小批量到大批量生產'
      ]
    },
    {
      icon: 'image',
      title: '銘板製作',
      description: '專業的銘板設計與製造服務，包含蝕刻、印刷、沖壓等多種工藝。',
      features: [
        '金屬蝕刻銘板',
        '絲印/移印銘板',
        '陽極氧化處理',
        '客製化設計服務'
      ]
    },
    {
      icon: 'category',
      title: '陽極處理',
      description: '提供專業的鋁材陽極氧化處理服務，增強產品耐用性與美觀性。',
      features: [
        '多種顏色選擇',
        '硬質陽極處理',
        '環保無污染工藝',
        '耐腐蝕、耐磨損'
      ]
    },
    {
      icon: 'construction',
      title: '模具設計與製造',
      description: '從設計到製造一站式模具服務，確保產品品質與生產效率。',
      features: [
        '3D模具設計',
        '快速打樣',
        '精密模具製造',
        '模具維修保養'
      ]
    },
    {
      icon: 'build_circle',
      title: '組裝服務',
      description: '提供專業的組裝服務，從零件到成品一條龍解決方案。',
      features: [
        '產品組裝',
        '功能測試',
        '品質檢驗',
        '包裝出貨'
      ]
    },
    {
      icon: 'design_services',
      title: '客製化設計',
      description: '專業的工程團隊提供客製化設計服務，滿足特殊需求。',
      features: [
        '產品設計諮詢',
        '工程圖面繪製',
        '材料選擇建議',
        '製程優化方案'
      ]
    }
  ];

  if (loading) {
    return (
      <PageLayout title="SERVICE 服務" subtitle="專業製造服務，滿足您的各種需求" breadcrumbs={breadcrumbs}>
        <div className="text-center py-20">
          <div className="text-accent">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="SERVICE 服務" 
      subtitle="專業製造服務，滿足您的各種需求"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16">
        {/* Introduction */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            威宇整合提供全方位的精密製造服務，從設計、加工到表面處理，我們擁有完整的生產鏈和專業團隊。
            無論是單件客製化還是大批量生產，我們都能提供最優質的解決方案。
          </p>
        </section>

        {/* Services Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons text-accent text-4xl">{service.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-accent">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-icons text-accent text-sm mt-1">check_circle</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Why Choose Us */}
        <section className="bg-secondary dark:bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-accent text-center">為什麼選擇我們</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">workspace_premium</span>
              </div>
              <h4 className="font-bold text-accent mb-2">專業團隊</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                擁有30年以上經驗的技術專家
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">high_quality</span>
              </div>
              <h4 className="font-bold text-accent mb-2">品質保證</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ISO認證品質管理系統
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">local_shipping</span>
              </div>
              <h4 className="font-bold text-accent mb-2">準時交貨</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                嚴格控管生產進度
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">support_agent</span>
              </div>
              <h4 className="font-bold text-accent mb-2">客戶服務</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                24小時專業技術支援
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-accent/5 dark:bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-accent">需要我們的服務？</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            歡迎聯繫我們，我們的專業團隊將為您提供最適合的解決方案和報價。
          </p>
          <a 
            href="#enquiry"
            className="inline-flex items-center gap-3 bg-accent hover:bg-hover-blue text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            立即諮詢
            <span className="material-icons">arrow_forward</span>
          </a>
        </section>
      </div>
    </PageLayout>
  );
};

export default ServicePage;
