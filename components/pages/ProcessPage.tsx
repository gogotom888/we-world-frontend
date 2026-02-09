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
          // 提取 blocks 编辑器的纯文本
          let introductionText = '';
          if (result.data.introduction) {
            if (typeof result.data.introduction === 'string') {
              introductionText = result.data.introduction;
            } else if (Array.isArray(result.data.introduction)) {
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
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {pageData.introduction}
            </p>
          </section>
        )}

        {/* Process Steps */}
        {pageData.process_steps.length > 0 && (
          <section>
          <h2 className="text-3xl font-bold mb-12 text-accent text-center">生產流程</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processes.map((process, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl font-bold text-accent/20">{process.step}</span>
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-accent text-2xl">{process.icon}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{process.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                  {process.description}
                </p>
                <ul className="space-y-2">
                  {process.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-xs">
                      <span className="material-icons text-accent text-xs mt-0.5">arrow_right</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Manufacturing Capabilities */}
        {pageData.manufacturing_capabilities.length > 0 && (
        <section className="bg-secondary dark:bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-accent text-center">製造能力</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-accent text-4xl">{capability.icon}</span>
                </div>
                <h4 className="font-bold text-accent mb-4 text-lg">{capability.title}</h4>
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
          <h2 className="text-3xl font-bold mb-8 text-accent text-center">品質管控</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons text-accent text-4xl">rule</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">來料檢驗</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                所有原物料進廠前都必須經過嚴格的檢驗，確保材料符合規格要求，從源頭控管品質。
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons text-accent text-4xl">search</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">製程檢驗</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                生產過程中進行多次製程檢驗，及時發現並解決問題，確保每個環節都符合標準。
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons text-accent text-4xl">task_alt</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-accent">出貨檢驗</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                產品出貨前進行100%全檢，包含尺寸、外觀、功能等多方面檢驗，確保品質無虞。
              </p>
            </div>
          </div>
        </section>

        {/* Equipment */}
        <section className="bg-accent/5 dark:bg-slate-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-accent text-center">生產設備</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="material-icons text-accent text-3xl mt-1">check_circle</span>
              <div>
                <h4 className="font-bold text-accent mb-2">CNC加工中心</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  配備多台3軸、4軸、5軸CNC加工中心，能夠處理複雜的零件加工需求。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-icons text-accent text-3xl mt-1">check_circle</span>
              <div>
                <h4 className="font-bold text-accent mb-2">精密測量儀器</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  三次元量測儀、投影機等精密測量設備，確保產品精度。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-icons text-accent text-3xl mt-1">check_circle</span>
              <div>
                <h4 className="font-bold text-accent mb-2">表面處理設備</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  完整的陽極處理、電鍍、噴塗等表面處理生產線。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-icons text-accent text-3xl mt-1">check_circle</span>
              <div>
                <h4 className="font-bold text-accent mb-2">自動化設備</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  導入自動化設備，提高生產效率，降低人為誤差。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-accent">想了解更多製程細節？</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            歡迎聯繫我們，我們將為您提供更詳細的製程說明與技術資料。
          </p>
          <a 
            href="#enquiry"
            className="inline-flex items-center gap-3 bg-accent hover:bg-hover-blue text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            聯繫我們
            <span className="material-icons">arrow_forward</span>
          </a>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProcessPage;
