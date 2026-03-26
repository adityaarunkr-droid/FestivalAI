import React from 'react';
import { Cake, Heart, MailOpen, Gift, GraduationCap, PartyPopper } from 'lucide-react';
import './FutureCategoriesSection.css';

export default function FutureCategoriesSection() {
  const categories = [
    { title: 'Birthdays', desc: 'Personalized AI wishes', icon: <Cake size={24} />, color: '#ff9ff3' },
    { title: 'Anniversaries', desc: 'Romantic custom greetings', icon: <Heart size={24} />, color: '#ff6b6b' },
    { title: 'Invitations', desc: 'AI evites for any event', icon: <MailOpen size={24} />, color: '#48dbfb' },
    { title: 'Congratulations', desc: 'Celebrate achievements', icon: <GraduationCap size={24} />, color: '#1dd1a1' },
    { title: 'Thank You', desc: 'Warm gratitude cards', icon: <Gift size={24} />, color: '#feca57' },
    { title: 'Custom Events', desc: 'Create unique celebrations', icon: <PartyPopper size={24} />, color: '#a29bfe' },
  ];

  return (
    <section className="categories-section">
      <div className="categories-header text-center">
        <h2>Celebrate Every Moment</h2>
        <p>Beyond festivals. Generate magical, personalized content for all of life's special occasions.</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="category-card card">
            <div 
              className="category-icon-wrapper"
              style={{ background: `${cat.color}20`, color: cat.color }}
            >
              {cat.icon}
            </div>
            <div className="category-info">
              <h3 className="category-title">{cat.title}</h3>
              <p className="category-desc">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
