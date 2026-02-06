import React from 'react';
import Breadcrumb from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, breadcrumbs, children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;