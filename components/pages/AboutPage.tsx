import React, { useState, useEffect } from 'react';
import PageLayout from '../shared/PageLayout';

interface AboutPageData {
  title: string;
  subtitle: string;
  introduction: any; // blocks 编辑器返回对象或字符串
  stat_years: number;
  stat_projects: number;
  stat_quality: number;
  core_values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  certifications: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const AboutPage: React.FC = () => {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const breadcrumbs = [
    { label: 'ABOUT US 關於威宇' }
  ];

  // 從後台獲取 About Page 資料
  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await fetch('/api/about-page?populate=*');
        if (!response.ok) throw new Error('Failed to fetch about page');
        const result = await response.json();
        
        console.log('About Page API Response:', result);
        
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
                .join('\n\n');
            }
          }
          
          setPageData({
            title: result.data.title || 'ABOUT US 關於威宇',
            subtitle: result.data.subtitle || 'Precision Engineering Excellence Since 2006',
            introduction: introductionText,
            stat_years: result.data.stat_years || 30,
            stat_projects: result.data.stat_projects || 500,
            stat_quality: result.data.stat_quality || 100,
            core_values: result.data.core_values || [],
            certifications: result.data.certifications || []
          });
          console.log('✅ About Page 資料已從後台載入');
        }
      } catch (error) {
        console.error('❌ About Page API 錯誤:', error);
        // 使用預設資料
        setPageData({
          title: 'ABOUT US 關於威宇',
          subtitle: 'Precision Engineering Excellence Since 2006',
          introduction: '威宇整合成立於2006年，專注於高品質銘板設計與精密CNC製造。',
          stat_years: 30,
          stat_projects: 500,
          stat_quality: 100,
          core_values: [],
          certifications: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) {
    return (
      <PageLayout title="" subtitle="" breadcrumbs={breadcrumbs}>
        <div className="text-center py-20">
          <div className="text-accent">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!pageData) return null;

  return (
    <PageLayout 
      title={pageData.title} 
      subtitle={pageData.subtitle}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16">
        {/* Company Introduction */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-accent">公司簡介</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {pageData.introduction || '威宇整合成立於2006年，專注於高品質銘板設計與精密CNC製造。'}
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop" 
                alt="威宇整合工廠"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Company Statistics */}
        <section className="bg-secondary dark:bg-slate-900 rounded-3xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent mb-2">{pageData.stat_years}+</div>
              <div className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-sm">
                Years Experience
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent mb-2">{pageData.stat_projects}+</div>
              <div className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-sm">
                Projects & Clients
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent mb-2">{pageData.stat_quality}%</div>
              <div className="text-slate-600 dark:text-slate-400 uppercase tracking-wider text-sm">
                Quality Assurance
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        {pageData.core_values && pageData.core_values.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-accent text-center">核心價值</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pageData.core_values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons text-accent text-3xl">{value.icon || 'verified'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-accent">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {pageData.certifications && pageData.certifications.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-accent text-center">認證與資質</h2>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="grid md:grid-cols-2 gap-6 text-slate-600 dark:text-slate-400">
                {pageData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="material-icons text-accent text-2xl mt-1">{cert.icon || 'check_circle'}</span>
                    <div>
                      <h4 className="font-bold text-accent mb-2">{cert.title}</h4>
                      <p>{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export default AboutPage;
