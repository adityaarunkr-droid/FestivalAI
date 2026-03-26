"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import LanguageDropdown from './LanguageDropdown';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();

  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Accounting for navbar height
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'glass' : ''}`}>
      <div className="container nav-content">
        <Logo />
        
        <nav className="desktop-nav">
          <a href="#today" onClick={(e) => scrollToSection(e, 'today')} className="nav-link">{t('nav_today')}</a>
          <a href="#festivals" onClick={(e) => scrollToSection(e, 'festivals')} className="nav-link">{t('nav_festivals')}</a>
          <a href="#personal" onClick={(e) => scrollToSection(e, 'personal')} className="nav-link">{t('nav_personal')}</a>
          <a href="#explore" onClick={(e) => scrollToSection(e, 'explore')} className="nav-link">{t('nav_explore')}</a>
        </nav>

        <div className="nav-actions">
          <LanguageDropdown />
          
          <div className="search-container">
            {showSearch && (
              <input type="text" className="search-input" placeholder="Search occasions..." autoFocus onBlur={() => setShowSearch(false)} />
            )}
            <button className="icon-btn" aria-label="Search" onClick={() => setShowSearch(!showSearch)}>
              <Search size={20} />
            </button>
          </div>
          
          <button className="icon-btn mobile-menu" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>

    </header>
  );
}
