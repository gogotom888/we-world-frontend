
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary py-8 border-t border-accent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3">
          <p className="text-accent text-sm leading-relaxed">
            ADD: 2F., No.51, Ln. 83, Huacheng Rd., Xinzhuang Dist., New Taipei City 24253, Taiwan / TEL: 886-2-89918085 / FAX: 886-2-89918095
          </p>
          <p className="text-text-dark text-xs uppercase tracking-[0.2em] font-semibold">
            COPYRIGHT © 2014 WE WORLD . ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
