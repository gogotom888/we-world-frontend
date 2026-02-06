import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from '../../components/Navbar';
import About from '../../components/About';
import Footer from '../../components/Footer';

const AboutApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main>
        <About />
      </main>
      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AboutApp />
  </React.StrictMode>,
);
