"use client";

import React, { useState } from 'react';
import { Maximize2, Download, Play, Image as ImageIcon, Video as VideoIcon, X, PhoneForwarded } from 'lucide-react';
import { ContentItem } from '@/utils/festivalCalendar';
import './FeedSection.css';

interface Props {
  items: ContentItem[];
}

export default function FeedSection({ items }: Props) {
  const [activeTab, setActiveTab] = useState('Most Downloaded');
  const [fullscreenItem, setFullscreenItem] = useState<any>(null);

  const handleDownload = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    alert(`Downloading Asset!`);
  };

  return (
    <section className="container mt-3xl" id="content-grid" style={{ marginTop: 'var(--spacing-3xl)' }}>
      <div className="grid-header-row">
        <div className="grid-header-text">
          <h2>Quick Previews & Downloads</h2>
          <p>Curated AI perfects for today's special occasion.</p>
        </div>
        <div className="content-tabs-pills">
          {['Images Only', 'Videos', 'Most Downloaded'].map(tab => (
            <button
              key={tab}
              className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Most Downloaded' && <span className="fire-icon">🔥</span>} {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="advanced-grid">
        {items.map(item => (
          <div className="feed-card-item" key={item.id}>
            <div
              className="feed-media-box"
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) video.play();
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector('video');
                if (video) { video.pause(); video.currentTime = 0; }
              }}
            >
              <div className="tag-badges-top">
                <span className="media-type-tag">
                  {item.mediaType === 'image' ? <ImageIcon size={12} /> : <VideoIcon size={12} />} ↓ {item.mediaType === 'image' ? 'Image' : 'Video'}
                </span>
              </div>

              {item.mediaType === 'video' ? (
                <video src={item.previewUrl} muted loop playsInline className="media-asset" />
              ) : (
                <img src={item.previewUrl} alt={item.title} className="media-asset" />
              )}

              {item.mediaType === 'video' && <div className="play-center-btn overlay-play"><Play fill="white" size={20} strokeWidth={3} /></div>}

              <div className="bottom-media-badge">
                {item.mediaType === 'video' ? 'Animated' : '4K Visual'}
              </div>
            </div>

            <div className="feed-info-box">
              <h4 className="card-item-title">{item.title}</h4>
              <div className="card-item-actions">
                <button className="icon-action-btn" onClick={() => setFullscreenItem(item)}>
                  <Maximize2 size={16} />
                </button>
                <button className="primary-action-btn glowing-download" onClick={(e) => handleDownload(e, item)}>
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fullscreenItem && (
        <div className="fullscreen-overlay-modal" onClick={() => setFullscreenItem(null)}>
          <div className="cinema-modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setFullscreenItem(null)}>
              <X size={16} /> Close
            </button>

            <div className="cinema-media-container">
              {fullscreenItem.mediaType === 'video' ? (
                <video src={fullscreenItem.previewUrl} autoPlay muted loop controls className="cinema-media" />
              ) : (
                <img src={fullscreenItem.previewUrl} alt="Fullscreen" className="cinema-media" />
              )}
              {fullscreenItem.mediaType === 'video' && <div className="play-center-btn massive"><Play fill="white" size={40} /></div>}
            </div>

            <div className="cinema-bottom-bar">
              <h3>{fullscreenItem.title}</h3>
              <div className="cinema-actions">
                <button className="btn btn-secondary glass-btn">
                  <PhoneForwarded size={16} /> Share to WhatsApp
                </button>
                <button className="btn btn-primary glowing-download">
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
