"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Video, Layers } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import './FilterSection.css';

interface Props {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export default function FilterSection({ activeFilter, onFilterChange }: Props) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const filters = [
    { id: 'both', label: t('filter_all'), icon: <Layers size={18} /> },
    { id: 'image', label: t('filter_image'), icon: <ImageIcon size={18} /> },
    { id: 'video', label: t('filter_video'), icon: <Video size={18} /> },
  ];

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h2>{t('filter_explore')}</h2>
        <p>{t('filter_explore_desc')}</p>
      </div>
      
      <div className="filter-controls">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
