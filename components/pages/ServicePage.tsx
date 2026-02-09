import React, { useState, useEffect } from 'react';
import PageLayout from '../shared/PageLayout';

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface ServicePageData {
  title: string;
  subtitle: string;
  introduction: string;
}

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pageData, setPageData] = useState<ServicePageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const breadcrumbs = [
    { label: 'SERVICE 服務' }
  ];

  // 從後台獲取 Service Page 資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 獲取服務列表
        const servicesRes = await fetch('/api/services?populate=*&sort=sort_order:asc');
        if (servicesRes.ok) {
          const servicesResult = await servicesRes.json();
          if (servicesResult.data && servicesResult.data.length > 0) {
            const formattedServices = servicesResult.data.map((item: any) => ({
              id: item.id,
              title: item.title || '',
              description: item.description || '',
              icon: item.icon || 'precision_manufacturing',
              features: item.features || []
            }));
            setServices(formattedServices);
          }
        }

        // 獲取服務頁面內容
        const pageRes = await fetch('/api/service-page?populate=*');
        if (pageRes.ok) {
          const pageResult = await pageRes.json();
          if (pageResult.data) {
            let introductionHTML = '';
            if (pageResult.data.introduction) {
              if (typeof pageResult.data.introduction === 'string') {
                introductionHTML = pageResult.data.introduction;
              } else if (Array.isArray(pageResult.data.introduction)) {
                const introductionText = pageResult.data.introduction
                  .map((block: any) => {
                    if (block.type === 'paragraph' && block.children) {
                      return block.children.map((child: any) => child.text || '').join('');
                    }
                    return '';
                  })
                  .filter((text: string) => text)
                  .join('\n\n');
                introductionHTML = introductionText;
              }
            }
            setPageData({
              title: pageResult.data.title || 'SERVICE 服務',
              subtitle: pageResult.data.subtitle || '專業製造服務，滿足您的各種需求',
              introduction: introductionHTML
            });
          }
        }
      } catch (error) {
        console.error('❌ API 錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout title="SERVICE 服務" subtitle="專業製造服務，滿足您的各種需求" breadcrumbs={breadcrumbs}>
        <div className="text-center py-20">
          <div className="text-accent">Loading...</div>
        </div>
      </PageLayout>
    );
  }
  
  if (!pageData) return null;

  return (
    <PageLayout 
      title={pageData?.title || "SERVICE 服務"}
      subtitle={pageData?.subtitle || "專業製造服務，滿足您的各種需求"}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16">
        {/* Introduction */}
        {pageData?.introduction && (
          <section className="text-center max-w-3xl mx-auto">
            <div 
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.introduction }}
            />
          </section>
        )}

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
