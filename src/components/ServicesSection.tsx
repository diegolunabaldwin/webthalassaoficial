import iconStrategy from '@/assets/icon-strategy.png';
import iconMarkets from '@/assets/icon-markets.png';
import iconLearning from '@/assets/icon-learning.png';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const services = [
  {
    id: 'strategy',
    icon: iconStrategy,
    title: 'Strategy',
    description: 'Donde se analiza el negocio completo, y se decide hacia dónde y cómo crecer.',
    items: [
      'Estándares privados de seguridad alimentaria',
      'Desarrollo de programas de auditorías de seguridad alimentaria',
      'Compliance y seguridad alimentaria en franquicias',
      'Acompañamiento a entidades de certificación',
    ],
    variant: 'strategy' as const,
  },
  {
    id: 'markets',
    icon: iconMarkets,
    title: 'Markets',
    description: 'Donde la estrategia se convierte en relaciones comerciales, acuerdos y presencia en mercados clave.',
    items: [
      'Dirección comercial externalizada.',
      'Desarrollo de cuentas clave y acuerdos estratégicos.',
      'Apoyo estratégico en la toma de decisiones.',
      'Negociación estratégica nacional e internacional.',
    ],
    variant: 'markets' as const,
  },
  {
    id: 'learning',
    icon: iconLearning,
    title: 'Learning',
    description: 'Donde formamos a los profesionales para que desarrollen criterio y aporten valor real a sus organizaciones.',
    items: [
      'Seguridad Alimentaria',
      'Cursos oficiales de BRCGS, IFS, FSSC 22000',
      'Sostenibilidad y medioambiente',
      'Calidad',
      'Cursos a medida',
    ],
    variant: 'learning' as const,
  },
];

const cardStyles = {
  strategy: 'card-strategy',
  markets: 'card-markets',
  learning: 'card-learning',
};

const ServicesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="servicios" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
            Nuestras líneas de negocio
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Un Hub. Tres líneas. Un mismo criterio.
          </h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto font-body">
            Crecimiento, marca y expansión para empresas del sector alimentario que quieren ir más allá.
          </p>
        </div>

        {/* Cards */}
        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`${cardStyles[service.variant]} p-8 h-full flex flex-col transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                cardsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms' }}
            >
              <img 
                src={service.icon} 
                alt={service.title} 
                className="w-20 h-20 object-contain mb-6"
              />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                {service.title}
              </h3>
              <p className="text-foreground/70 mb-6 font-body">
                {service.description}
              </p>
              <ul className="space-y-3 mt-auto">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      service.variant === 'strategy' ? 'bg-secondary' :
                      service.variant === 'markets' ? 'bg-champagne' : 'bg-orange'
                    }`} />
                    <span className="text-foreground/80 font-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
