import iconStrategy from '@/assets/icon-strategy.png';
import iconMarkets from '@/assets/icon-markets.png';
import iconLearning from '@/assets/icon-learning.png';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/contexts/LanguageContext';


const cardStyles = {
  strategy: 'card-strategy',
  markets: 'card-markets',
  learning: 'card-learning',
};

const ServicesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });
  const t = useTranslation();

  // Services data with translations
  const services = [
    {
      id: 'strategy',
      icon: iconStrategy,
      title: t('services.strategy.title'),
      description: t('services.strategy.description'),
      items: [
        t('services.strategy.items.1'),
        t('services.strategy.items.2'),
        t('services.strategy.items.3'),
        t('services.strategy.items.4'),
        t('services.strategy.items.5'),
      ],
      variant: 'strategy' as const,
    },
    {
      id: 'markets',
      icon: iconMarkets,
      title: t('services.markets.title'),
      description: t('services.markets.description'),
      items: [
        t('services.markets.items.1'),
        t('services.markets.items.2'),
        t('services.markets.items.3'),
        t('services.markets.items.4'),
        t('services.markets.items.5'),
      ],
      variant: 'markets' as const,
    },
    {
      id: 'learning',
      icon: iconLearning,
      title: t('services.learning.title'),
      description: t('services.learning.description'),
      items: [
        t('services.learning.items.1'),
        t('services.learning.items.2'),
        t('services.learning.items.3'),
        t('services.learning.items.4'),
        t('services.learning.items.5'),
      ],
      variant: 'learning' as const,
    },
  ];

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
            {t('services.subtitle')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            {t('services.title')}
          </h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto font-body">
            {t('services.description')}
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
              <ul className="space-y-3 mt-6">
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
