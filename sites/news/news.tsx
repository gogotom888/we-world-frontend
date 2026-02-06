import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from '../../components/Navbar';
import News from '../../components/News';
import Footer from '../../components/Footer';

const NewsApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main>
        <News />
      </main>
      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NewsApp />
  </React.StrictMode>,
);
