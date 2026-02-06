
import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  icon?: string;
  image?: string;
  content?: any; // blocks 编辑器返回对象
  is_featured: boolean;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 從後台獲取 News 資料
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news-items?populate=*&sort=createdAt:desc');
        if (!response.ok) throw new Error('Failed to fetch news');
        const result = await response.json();
        
        console.log('News API Response:', result);
        
        if (result.data && result.data.length > 0) {
          const formattedNews = result.data.slice(0, 3).map((item: any) => {
            // 提取 blocks 编辑器的纯文本
            let contentText = '';
            if (item.content && Array.isArray(item.content)) {
              contentText = item.content
                .map((block: any) => {
                  if (block.type === 'paragraph' && block.children) {
                    return block.children.map((child: any) => child.text || '').join('');
                  }
                  return '';
                })
                .filter((text: string) => text)
                .join(' ');
            }
            
            return {
              id: item.id,
              title: item.title || '',
              date: item.date || '',
              icon: item.icon || 'article',
              image: item.image?.url || '',
              content: contentText,
              is_featured: item.is_featured || false
            };
          });
          setNews(formattedNews);
          console.log('✅ News 資料已從後台載入:', formattedNews.length, '筆');
          console.log('News 資料:', formattedNews);
        } else {
          console.warn('⚠️ News API 返回空資料');
        }
      } catch (error) {
        console.error('❌ News API 錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section id="news" className="min-h-screen bg-secondary flex items-center justify-center border-b-4 border-primary">
        <div className="text-accent">Loading...</div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section id="news" className="min-h-screen bg-secondary flex items-center justify-center border-b-4 border-primary">
        <div className="text-center">
          <p className="text-text-gray">尚無新聞資料</p>
        </div>
      </section>
    );
  }
  return (
    <section id="news" className="min-h-screen bg-secondary flex items-center border-b-4 border-primary overflow-hidden py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal italic text-accent">Latest News</h2>
          <a href="#" className="text-accent font-semibold hover:underline flex items-center gap-1 text-sm md:text-base hover:text-hover-blue transition-colors duration-250">
            View All News <span className="material-icons text-sm">arrow_forward</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {news.map((item, index) => (
            <div key={item.id} className={`p-5 md:p-6 rounded-2xl border transition-all duration-250 group cursor-pointer ${
              item.is_featured || index === 0
                ? 'bg-base shadow-xl -translate-y-1 border-text-gray/20'
                : 'bg-base shadow-sm border-text-gray/20 hover:shadow-xl hover:-translate-y-1'
            }`}>
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <span className="text-text-gray text-sm font-semibold tracking-wide">{item.date}</span>
                {item.image ? (
                  <img 
                    alt={item.title} 
                    className={`w-16 h-16 rounded-lg object-cover transition-all shadow-sm ${
                      item.is_featured || index === 0 ? '' : 'grayscale group-hover:grayscale-0'
                    }`}
                    src={item.image} 
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <span className={`material-icons text-2xl ${item.icon === 'verified' ? 'text-blue-500' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                  </div>
                )}
              </div>
              <h3 className={`text-lg md:text-xl font-display font-bold leading-snug transition-colors duration-250 ${
                item.is_featured || index === 0 ? 'text-accent' : 'group-hover:text-accent'
              }`}>
                {item.title}
              </h3>
              <p className="mt-4 text-text-dark text-sm line-clamp-2">
                {item.content || 'Discover our latest updates and milestones as we continue to push the boundaries of engineering excellence.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
