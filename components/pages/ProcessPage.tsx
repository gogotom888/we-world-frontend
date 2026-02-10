import React, { useState, useEffect } from 'react';
import PageLayout from '../shared/PageLayout';

interface ProcessPageData {
  title: string;
  subtitle: string;
  introduction: any; // blocks 编辑器返回对象或字符串
  process_steps: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
    details: string[];
  }>;
  manufacturing_capabilities: Array<{
    icon: string;
    title: string;
    items: string[];
  }>;
}

const ProcessPage: React.FC = () => {
  const [pageData, setPageData] = useState<ProcessPageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const breadcrumbs = [
    { label: 'PROCESS 製程' }
  ];

  // 從後台獲取 Process Page 資料
  useEffect(() => {
    const fetchProcessPage = async () => {
      try {
        const response = await fetch('/api/process-page?populate=*');
        if (!response.ok) throw new Error('Failed to fetch process page');
        const result = await response.json();
        
        console.log('Process Page API Response:', result);
        
        if (result.data) {
          // 提取 CKEditor HTML 内容并替换图片 URL
          let introductionText = '';
          if (result.data.introduction) {
            if (typeof result.data.introduction === 'string') {
              // CKEditor HTML 字符串，替换图片 URL
              introductionText = result.data.introduction.replace(
                /src="\/uploads\//g,
                'src="http://localhost:1337/uploads/'
              );
            } else if (Array.isArray(result.data.introduction)) {
              // blocks 编辑器格式
              introductionText = result.data.introduction
                .map((block: any) => {
                  if (block.type === 'paragraph' && block.children) {
                    return block.children.map((child: any) => child.text || '').join('');
                  }
                  return '';
                })
                .filter((text: string) => text)
                .join(' ');
            }
          }
          
          setPageData({
            title: result.data.title || '',
            subtitle: result.data.subtitle || '',
            introduction: introductionText,
            process_steps: result.data.process_steps || [],
            manufacturing_capabilities: result.data.manufacturing_capabilities || []
          });
          console.log('✅ Process Page 資料已從後台載入');
        }
      } catch (error) {
        console.error('❌ Process Page API 錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessPage();
  }, []);
  
  if (loading) {
    return (
      <PageLayout title="PROCESS 製程" subtitle="完善的生產流程，確保產品品質" breadcrumbs={breadcrumbs}>
        <div className="text-center py-20">
          <div className="text-accent">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!pageData) return null;

  const processes = pageData.process_steps;
  const capabilities = pageData.manufacturing_capabilities;

  return (
    <PageLayout 
      title={pageData.title} 
      subtitle={pageData.subtitle}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16">
        {/* Introduction */}
        {pageData.introduction && (
          <section className="text-center max-w-3xl mx-auto">
            <div 
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.introduction }}
            />
          </section>
        )}

        {/* Process Steps */}
        {processes && processes.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-accent text-center">生產流程</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processes.map((process, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="material-icons text-accent text-3xl">{process.icon}</span>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-accent font-bold text-lg">STEP {process.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-accent text-center">{process.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 text-center leading-relaxed">
                    {process.description}
                  </p>
                  {process.details && process.details.length > 0 && (
                    <ul className="space-y-2">
                      {process.details.map((detail, dIndex) => (
                        <li key={dIndex} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                          <span className="material-icons text-accent text-xs mt-1">check_circle</span>
                          <span className="text-xs">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Manufacturing Capabilities */}
        {capabilities && capabilities.length > 0 && (
          <section className="bg-secondary dark:bg-slate-900 rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-8 text-accent text-center">製造能力</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-accent text-4xl">{capability.icon}</span>
                  </div>
                  <h4 className="font-bold text-accent mb-3 text-lg">{capability.title}</h4>
                  <ul className="space-y-2">
                    {capability.items.map((item, iIndex) => (
                      <li key={iIndex} className="text-sm text-slate-600 dark:text-slate-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quality Control */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-accent text-center">品質控管</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">verified</span>
              </div>
              <h4 className="font-bold text-accent mb-2">ISO認證</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                符合國際品質管理標準
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">science</span>
              </div>
              <h4 className="font-bold text-accent mb-2">材料檢驗</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                嚴格的原材料品質把關
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">precision_manufacturing</span>
              </div>
              <h4 className="font-bold text-accent mb-2">製程監控</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                全程品質監控與記錄
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-accent text-4xl">fact_check</span>
              </div>
              <h4 className="font-bold text-accent mb-2">出貨檢驗</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                完整的成品檢測報告
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-accent/5 dark:bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-accent">了解更多製程細節？</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            歡迎聯繫我們，我們將詳細為您介紹我們的生產流程與品質控管機制。
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

export default ProcessPage;
