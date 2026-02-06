import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from '../../components/Navbar';
import Products from '../../components/Products';
import Footer from '../../components/Footer';

const ProductsApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main>
        <Products />
      </main>
      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductsApp />
  </React.StrictMode>,
);
