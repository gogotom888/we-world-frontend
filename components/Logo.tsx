
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center cursor-pointer select-none group">
      {/* 藍色底色四邊圓角的容器 */}
      <div className="bg-[#2b547e] px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-105">
        <img 
          src="https://www.we-world.com.tw/theme/tw/images/header/item_logo.png" 
          alt="We-World Logo" 
          className="h-8 md:h-10 w-auto object-contain" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            // 如果圖片載入失敗的備用方案
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = document.createElement('span');
            fallback.innerText = 'WE WORLD';
            fallback.className = 'text-white font-black text-xl tracking-tighter';
            (e.target as HTMLElement).parentElement?.appendChild(fallback);
          }}
        />
      </div>
    </Link>
  );
};

export default Logo;
