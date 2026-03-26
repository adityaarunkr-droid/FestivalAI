"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import { Download, Wand2, Loader2, Play, Video } from 'lucide-react';
import './PersonalizedStudioSection.css';

const occasions = ["Birthday", "Anniversary", "Wedding", "Thank You", "Farewell", "Congratulations"];

export default function PersonalizedStudioSection() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const [activeOccasion, setActiveOccasion] = useState(occasions[0]);
  const [name, setName] = useState("");
  
  // High Performance Gen State
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [imageUrl, setImageUrl] = useState(`https://picsum.photos/seed/${activeOccasion}/600/600`);
  
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'processing' | 'ready'>('idle');

  const handleGenerateImage = async () => {
    if (!name.trim()) return;
    
    setIsGeneratingImg(true);
    setVideoStatus('idle'); // Reset video capability
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion: activeOccasion, language, theme: 'premium' })
      });
      const data = await res.json();
      if (data.success) {
        // Cache bust using dynamic variables natively mimicking a generated returned URL
        setImageUrl(`https://picsum.photos/seed/${encodeURIComponent(name + activeOccasion + Date.now())}/600/600`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVid(true);
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        setVideoStatus('processing');
        // Simulated Async Video Polling (e.g. Luma/Runway delay)
        setTimeout(() => {
          setVideoStatus('ready');
          setIsGeneratingVid(false);
        }, 5000);
      }
    } catch (e) {
      console.error(e);
      setIsGeneratingVid(false);
    }
  };

  return (
    <section className="personalized-studio container" id="personal">
      <div className="studio-layout">
        <div className="studio-left">
          <h2>{t('sec_personal_studio')}</h2>
          <p>{t('sec_personal_studio_desc')}</p>
          
          <div className="studio-form">
            <input 
              type="text" 
              placeholder={t('placeholder_name')} 
              className="input-field" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div className="chips-container">
              {occasions.map(occ => (
                <button 
                  key={occ} 
                  className={`chip ${activeOccasion === occ ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveOccasion(occ); 
                    if (!name) setImageUrl(`https://picsum.photos/seed/${occ}/600/600`); 
                  }}
                >
                  {occ}
                </button>
              ))}
            </div>

            <button 
              className="btn btn-primary btn-lg studio-generate-btn"
              onClick={handleGenerateImage}
              disabled={isGeneratingImg || !name.trim()}
            >
              {isGeneratingImg ? <Loader2 size={20} className="spinning" /> : <Wand2 size={20} />}
              {isGeneratingImg ? "Generating AI Masterpiece..." : t('btn_generate')}
            </button>
          </div>
        </div>
        
        <div className="studio-right">
          <div className="preview-card">
            {isGeneratingImg ? (
              <div className="loading-skeleton">
                 <Loader2 size={48} className="spinning text-primary" />
              </div>
            ) : (
              <>
                <img src={imageUrl} alt="Preview" className="preview-image" />
                
                {videoStatus === 'ready' && (
                  <div className="video-overlay-play">
                     <Play size={40} fill="white" />
                  </div>
                )}

                <div className="preview-overlay">
                  <p className="preview-message text-center">
                    {name ? `Happy ${activeOccasion}, ${name}!` : t('placeholder_message')}
                  </p>
                  
                  <div className="action-row">
                    <button className="btn btn-primary">
                      <Download size={18} />
                      {t('btn_download_card')}
                    </button>

                    {name && videoStatus === 'idle' && (
                       <button className="btn btn-secondary glass" onClick={handleGenerateVideo} disabled={isGeneratingVid}>
                         {isGeneratingVid ? <Loader2 size={18} className="spinning" /> : <Video size={18} />}
                         Animate Variant
                       </button>
                    )}
                    {videoStatus === 'processing' && (
                       <button className="btn btn-secondary glass" disabled>
                         <Loader2 size={18} className="spinning" />
                         Rendering 4K Video...
                       </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
