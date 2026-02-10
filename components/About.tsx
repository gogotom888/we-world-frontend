
import React, { useState, useEffect } from 'react';

interface AboutData {
  title: string;
  description: string;
  years_experience: number;
  years_label: string;
  projects_count: number;
  projects_label: string;
  read_more_url: string;
  image_top_right_url: string;
  image_bottom_url: string;
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // 從後台獲取 About Section 資料
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about-section?populate=*');
        if (!response.ok) throw new Error('Failed to fetch about data');
        const result = await response.json();
        
        if (result.data) {
          setAboutData({
            title: result.data.title || 'Precision Engineering Excellence Since 2006',
            description: result.data.description || '',
            years_experience: result.data.years_experience || 30,
            years_label: result.data.years_label || 'Years Experience',
            projects_count: result.data.projects_count || 500,
            projects_label: result.data.projects_label || 'Projects & Clients',
            read_more_url: result.data.read_more_url || '/about',
            image_top_right_url: result.data.image_top_right_url || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
            image_bottom_url: result.data.image_bottom_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=600&fit=crop'
          });
        }
      } catch (error) {
        console.error('❌ About API 錯誤:', error);
        // 使用預設資料
        setAboutData({
          title: 'Precision Engineering Excellence Since 2006',
          description: 'We-World Integration specializes in high-quality nameplate design and precision CNC manufacturing. Our commitment to excellence is backed by ISO-certified quality management systems and environmental standards, ensuring every product meets the highest industry specifications.',
          years_experience: 30,
          years_label: 'Years Experience',
          projects_count: 500,
          projects_label: 'Projects & Clients',
          read_more_url: '/about',
          image_top_right_url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=600&fit=crop',
          image_bottom_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=600&fit=crop'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading || !aboutData) {
    return (
      <section id="about" className="min-h-screen bg-base flex items-center justify-center border-b-4 border-secondary">
        <div className="text-accent">Loading...</div>
      </section>
    );
  }
  return (
    <section id="about" className="min-h-screen bg-base flex items-center border-b-4 border-secondary overflow-hidden py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* ABOUT US Box */}
            <div className="bg-primary rounded-3xl flex items-center justify-center p-8 aspect-square">
              <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                ABOUT<br />US
              </h3>
            </div>
            
            {/* Top Right Image - Precision Manufacturing */}
            <div className="rounded-3xl overflow-hidden aspect-square">
              <img 
                src={aboutData.image_top_right_url} 
                alt="Precision manufacturing"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Bottom Large Image - CNC Machinery */}
            <div className="col-span-2 rounded-3xl overflow-hidden aspect-[2/1]">
              <img 
                src={aboutData.image_bottom_url} 
                alt="CNC machinery and manufacturing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal italic mb-6 text-accent leading-tight">
              {aboutData.title}
            </h2>
            <p className="text-text-gray leading-relaxed text-base md:text-lg mb-8 font-light">
              {aboutData.description}
            </p>
            
            <a href="/about" className="flex items-center gap-4 text-primary hover:text-hover-blue transition-colors group">
              <span className="text-lg md:text-xl lg:text-2xl font-light tracking-wide">Read more</span>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary group-hover:bg-hover-blue rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                <span className="material-icons text-white text-2xl md:text-3xl">arrow_forward</span>
              </div>
            </a>
            
            <div className="mt-12 pt-8 border-t border-text-gray/20">
              <div className="flex flex-row gap-8 sm:gap-12 lg:gap-20">
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">{aboutData.years_experience}+</span>
                  <span className="text-xs text-text-gray uppercase font-medium tracking-[0.3em]">{aboutData.years_label}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-serif font-light text-accent mb-2">{aboutData.projects_count}+</span>
                  <span className="text-xs text-text-gray uppercase font-medium tracking-[0.3em]">{aboutData.projects_label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
