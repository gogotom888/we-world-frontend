import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="py-4 px-6 max-w-7xl mx-auto">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors"
            onClick={() => window.scrollTo(0, 0)}
          >
            首頁
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-slate-400 dark:text-slate-600">/</li>
            <li>
              {item.path && index < items.length - 1 ? (
                <Link 
                  to={item.path}
                  className="text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-accent font-medium">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
