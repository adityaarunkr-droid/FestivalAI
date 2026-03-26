"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '@/utils/translations';
import './LanguageDropdown.css';

export default function LanguageDropdown() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    closeDropdown();
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      
      const items = listboxRef.current?.querySelectorAll('[role="option"]');
      if (!items || items.length === 0) return;
      
      const activeElement = document.activeElement;
      const index = Array.from(items).indexOf(activeElement as HTMLElement);
      
      let nextIndex = 0;
      if (e.key === 'ArrowDown') {
        nextIndex = index < items.length - 1 ? index + 1 : 0;
      } else {
        nextIndex = index > 0 ? index - 1 : items.length - 1;
      }
      
      (items[nextIndex] as HTMLElement).focus();
    }
  };

  return (
    <div className="custom-language-dropdown" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button 
        className="dropdown-trigger" 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe size={18} className="globe-icon" aria-hidden="true" />
        <span className="selected-lang">{availableLanguages[language] || 'Language'}</span>
        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'open' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul 
          className="dropdown-menu dark-premium-menu" 
          role="listbox" 
          ref={listboxRef}
          tabIndex={-1}
        >
          {Object.entries(availableLanguages).map(([code, name]) => (
            <li 
              key={code}
              role="option"
              aria-selected={language === code}
              tabIndex={0}
              className={`dropdown-option ${language === code ? 'selected' : ''}`}
              onClick={() => handleSelect(code as Language)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(code as Language);
                }
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
