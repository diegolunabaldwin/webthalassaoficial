import { Calendar, MapPin } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/contexts/LanguageContext';


const EventsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });
  const t = useTranslation();

  // Events data with translations
  const events = [
    {
      id: 'alimentaria',
      badge: t('events.alimentaria.badge'),
      badgeVariant: 'gold' as const,
      title: t('events.alimentaria.title'),
      date: t('events.alimentaria.date'),
      location: t('events.alimentaria.location'),
      description: t('events.alimentaria.description'),
      variant: 'dark' as const,
    },
    {
      id: 'formacion',
      badge: t('events.formacion.badge'),
      badgeVariant: 'light' as const,
      title: t('events.formacion.title'),
      date: t('events.formacion.date'),
      location: t('events.formacion.location'),
      description: t('events.formacion.description'),
      variant: 'light' as const,
    },
    {
      id: 'webinar',
      badge: t('events.webinar.badge'),
      badgeVariant: 'gold' as const,
      title: t('events.webinar.title'),
      date: t('events.webinar.date'),
      location: t('events.webinar.location'),
      description: t('events.webinar.description'),
      variant: 'light' as const,
    },
  ];

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

        {/* Event Cards */}
        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`rounded-xl p-8 transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                event.variant === 'dark'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-event-light text-primary'
              } ${
                cardsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms' }}
            >
              {/* Badge */}
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ${
                  event.badgeVariant === 'gold'
                    ? 'bg-champagne text-champagne-foreground'
                    : 'bg-secondary/30 text-primary'
                }`}
              >
                {event.badge}
              </span>

              {/* Title */}
              <h3 className={`font-heading font-bold mb-4 break-words ${
                event.id === 'alimentaria'
                  ? 'text-xl md:text-2xl'
                  : 'text-2xl md:text-3xl'
              }`}>
                {event.title}
              </h3>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 flex-shrink-0 opacity-80 flex-shrink-0" />
                  <span className="font-body break-words">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 opacity-80 flex-shrink-0" />
                  <span className="font-body break-words">{event.location}</span>
                </div>
              </div>

              {/* Description or Button */}
              {event.id === 'webinar' ? (
                <a
                  href="https://webinar-thalassahub.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block mt-6"
                >
                  {t('events.webinar.cta')}
                </a>
              ) : (
                <p className={`font-body ${event.variant === 'dark' ? 'text-primary-foreground/80' : 'text-foreground/70'}`}>
                  {event.description}
                </p>
              )}

              {/* WhatsApp Button for Alimentaria */}
              {event.id === 'alimentaria' && (
                <a
                  href="https://wa.me/+34693055276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-champagne px-6 py-3 font-semibold rounded-lg hover:bg-champagne/90 transition-all duration-300 inline-block mt-6"
                >
                  {t('events.alimentaria.whatsapp')}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
