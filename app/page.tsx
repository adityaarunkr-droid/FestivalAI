"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeedSection from '@/components/FeedSection';
import AllOccasionsSection from '@/components/AllOccasionsSection';
import PersonalizedStudioSection from '@/components/PersonalizedStudioSection';
import CreateWithPhotoSection from '@/components/CreateWithPhotoSection';
import { ContentItem, getContentForOccasion } from '@/utils/festivalCalendar';
import { fetchTodayOccasions, LiveOccasion } from '@/utils/fetchTodayOccasions';

export default function Home() {
  const [occasions, setOccasions] = useState<LiveOccasion[]>([]);
  const [activeOccasion, setActiveOccasion] = useState<LiveOccasion | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState('both');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<ContentItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Fetch today's occasions from Calendarific + local DB (server route) ──
  useEffect(() => {
    fetchTodayOccasions().then((data) => {
      if (data && data.occasions.length > 0) {
        setOccasions(data.occasions);
        setActiveOccasion(data.occasions[0]);
      } else {
        // Hard fallback — should never happen but keeps UI alive
        const fallback: LiveOccasion = {
          id: 'beautiful-day',
          name: { en: 'Beautiful Day' },
          message: { en: 'Every day is a gift. Make today amazingly special.' },
          imageKeyword: 'sunshine+happy',
          popularityScore: 50,
          source: 'local',
        };
        setOccasions([fallback]);
        setActiveOccasion(fallback);
      }
      setLoading(false);
    });
  }, []);

  // ── Load dynamic content from stored Database for active occasion ────────────
  useEffect(() => {
    if (activeOccasion) {
      // Production scalable: Fetching stored results so users see generated content instantly
      fetch(`/api/occasion-media?id=${activeOccasion.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.items) {
            setContentItems(data.items);
            setActiveFilter('All');
          }
        })
        .catch(err => {
          console.error("Failed to load occasion media", err);
          // Sync fallback
          setContentItems(getContentForOccasion(activeOccasion.id));
        });
    }
  }, [activeOccasion]);

  // ── Filter media effectively guaranteeing boundary conditions ────────────────
  useEffect(() => {
    let filtered = contentItems;
    // Map Exact strings emitted by HeroSection filters ['All', 'Images', 'Videos']
    if (activeFilter === 'Images') filtered = contentItems.filter(i => i.mediaType === 'image');
    if (activeFilter === 'Videos') filtered = contentItems.filter(i => i.mediaType === 'video');
    
    setFilteredMedia(filtered);
    setActiveIndex(0); // Reset bound on filter change protecting Next/Prev logic
  }, [activeFilter, contentItems]);

  // Boundaries securely constrained to current filtered media sequence
  const activeContent = filteredMedia[activeIndex];
  const hasNext = activeIndex < filteredMedia.length - 1;
  const hasPrev = activeIndex > 0;

  const handleNext = () => { if (hasNext) setActiveIndex(activeIndex + 1); };
  const handlePrev = () => { if (hasPrev) setActiveIndex(activeIndex - 1); };

  // ── Loading state ────────────────────────────────────────────────
  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🎉</div>
          <p>Checking today's special occasions...</p>
        </div>
      </main>
    );
  }

  if (!activeOccasion) return null;

  // ── Convert LiveOccasion → Occasion shape for HeroSection ────────
  // HeroSection expects the same shape, which LiveOccasion satisfies
  const heroOccasion = activeOccasion as any;
  const heroAllOccasions = occasions as any[];

  return (
    <main>
      <Navbar />
      <HeroSection
        occasion={heroOccasion}
        allOccasions={heroAllOccasions}
        activeContent={activeContent}
        allContent={filteredMedia}
        activeIndex={activeIndex}
        totalItems={filteredMedia.length}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSelectItem={(idx) => {
          setActiveIndex(idx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <div className="container" style={{ margin: 'var(--spacing-3xl) auto' }}>
        <FeedSection items={filteredMedia} />
      </div>

      {/* Lower Premium Sections */}
      <AllOccasionsSection />
      <PersonalizedStudioSection />
      <CreateWithPhotoSection />
    </main>
  );
}
