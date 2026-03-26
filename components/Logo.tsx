"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import './Logo.css';

export default function Logo() {
  const { language } = useLanguage();
  const rawTransl = getTranslation(language, 'logo');
  
  // Extract "Festival" and "AI" parts for localization if possible
  let part1 = "Festival";
  let part2 = "AI";
  
  if (rawTransl.toUpperCase().endsWith("AI")) {
    part1 = rawTransl.slice(0, -2);
    part2 = rawTransl.slice(-2);
  } else if (rawTransl.endsWith("एआई")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "एआई";
  } else if (rawTransl.endsWith("ஏஐ")) {
    part1 = rawTransl.slice(0, -2);
    part2 = "ஏஐ";
  } else if (rawTransl.endsWith("ఏఐ")) {
    part1 = rawTransl.slice(0, -2);
    part2 = "ఏఐ";
  } else if (rawTransl.endsWith("ಎಐ")) {
    part1 = rawTransl.slice(0, -2);
    part2 = "ಎಐ";
  } else if (rawTransl.endsWith("ਏਆਈ")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "ਏਆਈ";
  } else if (rawTransl.endsWith("എഐ")) {
    part1 = rawTransl.slice(0, -2);
    part2 = "എഐ";
  } else if (rawTransl.endsWith("এআই")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "এআই";
  } else if (rawTransl.endsWith("एआय")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "एआय";
  } else if (rawTransl.endsWith("એઆઈ")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "એઆઈ";
  } else if (rawTransl.endsWith("اے آئی")) {
    part1 = rawTransl.slice(0, -6);
    part2 = "اے آئی";
  } else if (rawTransl.endsWith("ଏଆଇ")) {
    part1 = rawTransl.slice(0, -3);
    part2 = "ଏଆଇ";
  } else {
    // Fallback if untranslatable pattern
    part1 = rawTransl;
    part2 = "";
  }

  return (
    <div className="brand-logo-container vertical-lockup">
      <div className="brand-logo-icon">
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="petalGrad1" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fca048" /> {/* Saffron */}
              <stop offset="100%" stopColor="#a855f7" /> {/* Amethyst */}
            </linearGradient>
            <linearGradient id="petalGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fca048" /> {/* Saffron */}
              <stop offset="100%" stopColor="#f43f5e" /> {/* Coral */}
            </linearGradient>
            
            <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g filter="url(#glow-effect)" className="geometric-burst-group">
            {/* 8 Outer Petals */}
            {[...Array(8)].map((_, i) => (
              <path 
                key={`outer-${i}`} 
                d="M 50 5 Q 65 25 50 50 Q 35 25 50 5 Z" 
                fill="url(#petalGrad1)" 
                opacity="0.6" 
                transform={`rotate(${i * 45} 50 50)`} 
                style={{ mixBlendMode: 'screen' }}
                stroke="rgba(255,255,255,0.7)" 
                strokeWidth="1" 
              />
            ))}
            
            {/* 8 Inner Petals */}
            {[...Array(8)].map((_, i) => (
              <path 
                key={`inner-${i}`} 
                d="M 50 18 Q 58 34 50 50 Q 42 34 50 18 Z" 
                fill="url(#petalGrad2)" 
                opacity="0.9" 
                transform={`rotate(${i * 45 + 22.5} 50 50)`} 
                style={{ mixBlendMode: 'color-dodge' }}
                stroke="rgba(255,255,255,0.9)" 
                strokeWidth="1.2" 
              />
            ))}
            
            <circle cx="50" cy="50" r="4.5" fill="#ffffff" opacity="0.95" />
          </g>
        </svg>
      </div>
      <div className="brand-logo-text-group text-center">
        <div className="brand-wordmark">
          <span className="wordmark-festival">{part1}</span>
          <span className="wordmark-ai">{part2}</span>
        </div>
        <div className="brand-tagline">WHAT'S SPECIAL TODAY</div>
      </div>
    </div>
  );
}
