"use client";

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import { UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import './CreateWithPhotoSection.css';

export default function CreateWithPhotoSection() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const validateAndUpload = (file: File) => {
    if (!file.type.match('image/jpeg|image/png')) {
      setUploadState('error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploadState('success');
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <section className="photo-studio-section dark-section">
      <div className="container px-xl">
        <div className="section-header text-center photo-studio-header">
          <h2>{t('sec_photo_studio')}</h2>
          <p>{t('sec_photo_studio_desc')}</p>
        </div>

        <div className="photo-upload-container card glass-dark">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/jpeg, image/png" 
            className="hidden-input" 
            aria-label="Upload Photo Input"
          />
          <div 
            className={`upload-box ${dragActive ? 'drag-active' : ''} state-${uploadState}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload Photo Area"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          >
            {uploadState === 'idle' && (
              <>
                <UploadCloud size={48} className="upload-icon" aria-hidden="true" />
                <h3>Drag & Drop your photo here</h3>
                <p className="text-muted mb-md">{t('upload_hint') || 'Accepted: JPG, PNG • Max 5MB'}</p>
                <button className="btn btn-secondary">{t('btn_upload_photo')}</button>
              </>
            )}

            {uploadState === 'uploading' && (
              <>
                <Loader2 size={48} className="upload-icon spinning" aria-hidden="true" />
                <h3>{t('upload_progress')?.replace('{progress}', progress.toString()) || `Uploading... ${progress}%`}</h3>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </>
            )}

            {uploadState === 'success' && (
              <>
                <CheckCircle size={48} className="upload-icon success" aria-hidden="true" />
                <h3>{t('upload_success') || 'Photo uploaded successfully!'}</h3>
                <button className="btn btn-primary mt-md" onClick={(e) => { e.stopPropagation(); setUploadState('idle'); }}>Upload Another</button>
              </>
            )}

            {uploadState === 'error' && (
              <>
                <XCircle size={48} className="upload-icon error" aria-hidden="true" />
                <h3>{t('upload_error') || 'Upload failed. Please try again.'}</h3>
                <p className="text-muted mb-md">Ensure file is JPG/PNG and under 5MB.</p>
                <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); setUploadState('idle'); }}>Try Again</button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
