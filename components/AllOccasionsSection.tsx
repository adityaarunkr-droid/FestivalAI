"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import { CalendarHeart } from 'lucide-react';
import './AllOccasionsSection.css';

const occasionsList = [
  "Diwali", "Eid al-Fitr", "Christmas", "Pongal", "Holi", 
  "Hanukkah", "New Year", "Navratri", "Onam", "Dussehra", 
  "Baisakhi", "Ugadi"
];

export default function AllOccasionsSection() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  return (
    <section className="all-occasions-section dark-section" id="explore">
      <div className="container">
        <div className="section-header text-center">
          <h2>{t('sec_all_occasions')}</h2>
          <p>{t('sec_all_occasions_desc')}</p>
        </div>
        
        <div className="occasions-grid">
          {occasionsList.map((occ, idx) => (
            <div key={idx} className="occasion-card glass-dark">
              <CalendarHeart size={24} className="occasion-icon" />
              <h3>{occ}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
