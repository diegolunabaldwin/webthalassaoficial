import { Calendar, MapPin } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const events = [
  {
    id: 'alimentaria',
    badge: 'Presencia Confirmada',
    badgeVariant: 'gold' as const,
    title: 'Feria Alimentaria',
    date: 'Del 23 al 26 de marzo 2026',
    location: 'Barcelona, España',
    description: 'Visita nuestro stand y descubre las nuevas rutas de exportación hacia mercados emergentes.',
    variant: 'dark' as const,
  },
  {
    id: 'formacion',
    badge: 'Próximamente',
    badgeVariant: 'light' as const,
    title: 'Cursos de Formación',
    date: 'Q2 2026',
    location: 'Online & Presencial',
    description: 'Actualización normativa para equipos de calidad y seguridad alimentaria.',
    variant: 'light' as const,
  },
];

const EventsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

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
            Agenda 2026
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            Próximos eventos
          </h2>
        </div>

        {/* Event Cards */}
        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
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
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                {event.title}
              </h3>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 flex-shrink-0 opacity-80" />
                  <span className="font-body">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 opacity-80" />
                  <span className="font-body">{event.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className={`font-body ${event.variant === 'dark' ? 'text-primary-foreground/80' : 'text-foreground/70'}`}>
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
