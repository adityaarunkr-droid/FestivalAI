"use client";

import React from 'react';
import { Play, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Occasion, ContentItem } from '@/utils/festivalCalendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import './HeroSection.css';

interface Props {
  occasion: Occasion;
  allOccasions: Occasion[];
  activeContent?: ContentItem;
  allContent: ContentItem[];
  activeIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  onSelectItem: (idx: number) => void;
}

export default function HeroSection({
  occasion, allOccasions, activeContent, allContent,
  activeIndex, totalItems,
  onNext, onPrev, hasNext, hasPrev,
  activeFilter, onFilterChange, onSelectItem
}: Props) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  const occasionName = occasion.name[language] || occasion.name.en;
  const occasionMessage = occasion.message[language] || occasion.message.en;
  const otherOccasions = allOccasions.filter(o => o.id !== occasion.id);

  const filters = ['All', 'Images', 'Videos'];

  return (
    <section className="hero-section container" id="today">

      {/* ── LEFT COLUMN ──────────────────────────────────── */}
      <div className="hero-left">

        {/* Title */}
        <h1 className="hero-title">
          Today is<br />
          <span className="text-gradient">{occasionName}</span>
        </h1>

        {/* Description */}
        <p className="hero-message">
          {occasionMessage} AI-crafted greeting cards, short motion reels, and premium share-ready downloads.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-row">
          <button className="btn btn-primary download-btn glowing-download">
            Download Design
          </button>
          <button className="btn btn-secondary hero-preview-btn">
            Preview Video
          </button>
        </div>

        {/* Stat chips */}
        <div className="hero-chips">
          <span className="hero-chip">{totalItems} designs ready</span>
          <span className="hero-chip">Image + Video</span>
          <span className="hero-chip">Instant download</span>
        </div>

        {/* Also Happening Today */}
        {otherOccasions.length > 0 && (
          <div className="also-today-box">
            <p className="also-today-label">ALSO HAPPENING TODAY</p>
            <div className="also-today-chips">
              {otherOccasions.map(o => (
                <span key={o.id} className="also-today-chip">
                  {o.name[language] || o.name.en}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ─────────────────────────────────── */}
      <div className="hero-right">

        {/* Featured card */}
        <div className="featured-card">
          {/* Media type pill */}
          <div className="featured-media-badge">
            {activeContent?.mediaType === 'video' ? 'Video' : 'Image'}
          </div>

          {/* Media */}
          {activeContent?.mediaType === 'video' ? (
            <video
              key={activeContent.id}
              className="featured-media"
              src={activeContent.previewUrl}
              autoPlay muted loop playsInline
            />
          ) : (
            <img
              key={activeContent?.id}
              className="featured-media"
              src={activeContent?.previewUrl}
              alt={activeContent?.title}
            />
          )}

          {/* Bottom overlay with title */}
          <div className="featured-overlay">
            <p className="featured-label">FEATURED DESIGN</p>
            <h2 className="featured-title">{activeContent?.title || occasionName}</h2>
            <p className="featured-desc">Vibrant premium artwork for festive sharing, instant preview, and elegant downloads.</p>
          </div>
        </div>

        {/* Nav controls + filter tabs row */}
        <div className="hero-controls-row">
          <div className="hero-nav-btns">
            <button
              className="hero-nav-btn"
              onClick={onPrev}
              disabled={!hasPrev}
              style={{ opacity: hasPrev ? 1 : 0.35 }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="hero-nav-btn"
              onClick={onNext}
              disabled={!hasNext}
              style={{ opacity: hasNext ? 1 : 0.35 }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hero-filter-tabs">
            {filters.map(f => {
              const val = f === 'All' ? 'both' : f === 'Images' ? 'image' : 'video';
              return (
                <button
                  key={f}
                  className={`hero-filter-tab ${activeFilter === val ? 'active' : ''}`}
                  onClick={() => onFilterChange(val)}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="hero-thumb-strip">
          {allContent.map((item, idx) => (
            <div
              key={item.id}
              className={`hero-thumb ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => onSelectItem(idx)}
            >
              {item.mediaType === 'video' ? (
                <video src={item.previewUrl} className="hero-thumb-media" muted playsInline />
              ) : (
                <img src={item.previewUrl} alt={item.title} className="hero-thumb-media" />
              )}
              <span className="hero-thumb-type-badge">
                {item.mediaType === 'image' ? 'Image' : 'Video'}
              </span>
              <div className="hero-thumb-caption">{item.title.split(' ').slice(0, 2).join(' ')}...</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
