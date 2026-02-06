
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [clickedSubmenu, setClickedSubmenu] = useState(false);
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout | null>(null); // 添加定时器管理

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (closeTimer) clearTimeout(closeTimer); // 清理定时器
    };
  }, [closeTimer]);

  const navLinks = [
    { name: 'ABOUT US 關於威宇', href: '/about' },
    { name: 'SERVICE 服務', href: '/service' },
    { name: 'PROCESS 製程', href: '/process' },
    { name: 'PRODUCTS', href: '/products', hasSubmenu: true },
    { name: 'ENQUIRY', href: '#enquiry' },
  ];

  const productSubMenu = [
    { name: 'ALL', href: '/products' },
    { name: 'Nameplate 銘板', href: '/products?category=nameplate' },
    { name: 'Aluminum CNC & anodizing 車床及陽極鑒材', href: '/products?category=cnc' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-250 ${
      isScrolled 
      ? 'bg-base/95 backdrop-blur-md shadow-sm h-20 border-b border-secondary' 
      : 'bg-base/80 backdrop-blur-sm h-24'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Logo />
        
        {/* Desktop Links - Adjusted tracking to widest */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[12px] font-bold tracking-[0.15em] uppercase">
          {navLinks.map((link, index) => (
            <div 
              key={link.name}
              className="relative group"
              onMouseEnter={() => {
                if (link.hasSubmenu) {
                  // 清除任何延迟关闭定时器
                  if (closeTimer) {
                    clearTimeout(closeTimer);
                    setCloseTimer(null);
                  }
                  setShowProductsSubmenu(true);
                  setClickedSubmenu(false);
                }
              }}
              onMouseLeave={() => {
                if (link.hasSubmenu) {
                  // 设置延迟关闭
                  const timer = setTimeout(() => {
                    setShowProductsSubmenu(false);
                  }, 200);
                  setCloseTimer(timer);
                }
              }}
            >
              {link.name === 'ENQUIRY' ? (
                <a 
                  href={link.href} 
                  className={`transition-colors duration-250 whitespace-nowrap hover:text-hover-blue ${
                    index === 0 
                      ? 'text-accent' 
                      : 'text-text-dark'
                  }`}
                >
                  {link.name}
                </a>
              ) : link.hasSubmenu ? (
                <Link 
                  to={link.href}
                  onClick={() => {
                    setClickedSubmenu(true);
                    setShowProductsSubmenu(false);
                    setTimeout(() => setClickedSubmenu(false), 100);
                  }}
                  className={`transition-colors duration-250 whitespace-nowrap hover:text-hover-blue flex items-center gap-1 ${
                    index === 0 
                      ? 'text-accent' 
                      : 'text-text-dark'
                  }`}
                >
                  {link.name}
                  <span className="material-icons text-xs opacity-50">arrow_drop_down</span>
                </Link>
              ) : (
                <Link 
                  to={link.href} 
                  className={`transition-colors duration-250 whitespace-nowrap hover:text-hover-blue ${
                    index === 0 
                      ? 'text-accent' 
                      : 'text-text-dark'
                  }`}
                >
                  {link.name}
                </Link>
              )}
              
              {/* Products Submenu - 流畅的 hover 体验 */}
              {link.hasSubmenu && showProductsSubmenu && (
                <div 
                  className="absolute top-full left-0 pt-1 z-50"
                  onMouseEnter={() => {
                    // 清除关闭定时器
                    if (closeTimer) {
                      clearTimeout(closeTimer);
                      setCloseTimer(null);
                    }
                    setShowProductsSubmenu(true);
                    setClickedSubmenu(false);
                  }}
                  onMouseLeave={() => {
                    setShowProductsSubmenu(false);
                  }}
                >
                  <div className="bg-base border border-secondary shadow-xl rounded-lg py-2 min-w-[280px] animate-fade-in-up">
                    {productSubMenu.map((subItem, subIndex) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={`block px-4 py-3 transition-all duration-200 text-[11px] font-bold tracking-wide ${
                          subIndex === 0
                            ? 'text-accent hover:text-white hover:bg-primary'
                            : 'text-text-dark hover:text-accent hover:bg-secondary'
                        }`}
                        onClick={() => {
                          setShowProductsSubmenu(false);
                          setClickedSubmenu(false);
                          if (closeTimer) clearTimeout(closeTimer);
                        }}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base border-b border-secondary p-6 flex flex-col space-y-4 shadow-xl">
          {navLinks.map((link, index) => (
            <div key={link.name}>
              {link.name === 'ENQUIRY' ? (
                <a 
                  href={link.href} 
                  className={`text-lg font-bold tracking-widest transition-colors hover:text-hover-blue ${
                    index === 0
                      ? 'text-accent'
                      : 'text-text-dark'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : link.hasSubmenu ? (
                <div>
                  <button
                    className={`text-lg font-bold tracking-widest flex items-center gap-2 w-full justify-between transition-colors hover:text-hover-blue ${
                      index === 0
                        ? 'text-accent'
                        : 'text-text-dark'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProductsSubmenu(!showProductsSubmenu);
                    }}
                  >
                    <span>{link.name}</span>
                    <span className="material-icons text-sm">
                      {showProductsSubmenu ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  
                  {/* 移动端 PRODUCTS 主项可点击跳转 */}
                  <Link
                    to={link.href}
                    className="block mt-2 ml-4 text-sm font-medium text-accent hover:text-hover-blue"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowProductsSubmenu(false);
                    }}
                  >
                    → 查看所有產品
                  </Link>
                </div>
              ) : (
                <Link 
                  to={link.href} 
                  className={`text-lg font-bold tracking-widest transition-colors hover:text-hover-blue ${
                    index === 0
                      ? 'text-accent'
                      : 'text-text-dark'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
              
              {/* Mobile Products Submenu - hover 高亮，click 跳转 */}
              {link.hasSubmenu && showProductsSubmenu && (
                <div className="ml-4 mt-2 space-y-2 pl-4 border-l-2 border-accent/30">
                  {productSubMenu.map((subItem, subIndex) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={`block text-sm font-medium py-1 transition-colors ${
                        subIndex === 0
                          ? 'text-accent hover:text-hover-blue font-bold'
                          : 'text-text-gray hover:text-accent'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowProductsSubmenu(false);
                      }}
                    >
                      {subIndex === 0 ? '• ' : ''}{subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
