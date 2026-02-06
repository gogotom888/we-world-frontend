
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Services from './components/Services';
import Products from './components/Products';
import Enquiry from './components/Enquiry';
import Footer from './components/Footer';
import AboutPage from './components/pages/AboutPage';
import ServicePage from './components/pages/ServicePage';
import ProcessPage from './components/pages/ProcessPage';
import AllProductsPage from './components/pages/AllProductsPage';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <News />
      <Services />
      <Products />
      <Enquiry />
    </>
  );
};

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/products" element={<AllProductsPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Dark Mode Toggle */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={toggleDarkMode}
            className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all group"
            title="Toggle Dark Mode"
          >
            <span className="material-icons text-2xl group-hover:rotate-12 transition-transform">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Global styles for smooth scrolling */}
        <style>{`
          html {
            scroll-behavior: smooth;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
