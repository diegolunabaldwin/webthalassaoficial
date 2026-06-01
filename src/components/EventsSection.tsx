import { Calendar, MapPin, GraduationCap } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/contexts/LanguageContext';


const EventsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation({ threshold: 0.1 });
  const t = useTranslation();

  return (
    <section id="eventos" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
            {t('events.subtitle')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            {t('events.title')}
          </h2>
        </div>

        {/* Horizontal Event Card */}
        <div 
          ref={cardRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-event-light rounded-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              {/* Left - Icon + Badge + Title */}
              <div className="flex md:flex-col items-center md:items-start gap-6 md:gap-4 flex-shrink-0">
                <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-secondary" />
                </div>
                <div className="text-center md:text-left">
                  <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-secondary/30 text-primary mb-3">
                    {t('events.formacion.badge')}
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary">
                    {t('events.formacion.title')}
                  </h3>
                </div>
              </div>

              {/* Right - Details + Description */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="font-body text-primary font-medium">{t('events.formacion.date')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="font-body text-primary font-medium">{t('events.formacion.location')}</span>
                  </div>
                </div>
                <p className="font-body text-foreground/70 text-lg leading-relaxed">
                  {t('events.formacion.description')}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="px-4 py-2 bg-white/60 rounded-full text-sm font-medium text-primary">BRCGS</span>
                  <span className="px-4 py-2 bg-white/60 rounded-full text-sm font-medium text-primary">IFS Food</span>
                  <span className="px-4 py-2 bg-white/60 rounded-full text-sm font-medium text-primary">FSSC 22000</span>
                  <span className="px-4 py-2 bg-white/60 rounded-full text-sm font-medium text-primary">Sostenibilidad</span>
                  <span className="px-4 py-2 bg-white/60 rounded-full text-sm font-medium text-primary">Calidad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
