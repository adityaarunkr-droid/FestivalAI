import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import { Occasion } from '@/utils/festivalCalendar';
import { Sparkles, ArrowRight } from 'lucide-react';
import './SecondaryEventsSection.css';

interface Props {
  occasions: Occasion[];
  activeOccasionId: string;
  onSelectCallback: (occasion: Occasion) => void;
}

export default function SecondaryEventsSection({ occasions, activeOccasionId, onSelectCallback }: Props) {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  
  // Filter out the primary active occasion so it only shows "other" events
  const secondaryOccasions = occasions.filter(occ => occ.id !== activeOccasionId);

  if (secondaryOccasions.length === 0) return null;

  return (
    <section className="secondary-events" id="festivals">
      <div className="secondary-header">
        <h3>{t('sec_also_happening')}</h3>
        <p>{t('sec_also_happening_desc')}</p>
      </div>

      <div className="secondary-grid">
        {secondaryOccasions.map(occ => (
          <div 
            key={occ.id} 
            className="secondary-card card"
            onClick={() => onSelectCallback(occ)}
            role="button"
            tabIndex={0}
            aria-label={`View occasion: ${occ.name[language] || occ.name['en']}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCallback(occ);
              }
            }}
          >
            <div className="secondary-content">
              <Sparkles size={16} className="secondary-icon" />
              <div className="secondary-text">
                <h4>{occ.name[language] || occ.name['en']}</h4>
                <p className="line-clamp-2">{occ.message[language] || occ.message['en']}</p>
              </div>
            </div>
            <button className="icon-btn-forward">
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
