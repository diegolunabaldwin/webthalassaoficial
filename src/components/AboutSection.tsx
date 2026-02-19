import susana from '@/assets/susana.png';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useTranslation } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const t = useTranslation();

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-background">
      <div 
        ref={sectionRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
              {t('about.subtitle')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8">
              {t('about.title')}
            </h2>
            
            <div className="space-y-5 text-foreground/80 font-body text-lg leading-relaxed">
              <p>
                {t('about.paragraph1')}
              </p>
              <p>{t('about.paragraph2')}</p>
              <p>{t('about.paragraph3')}</p>
              <p>{t('about.paragraph4')}</p>
            </div>

            {/* Quote */}
            <blockquote className="mt-8 pl-6 border-l-4 border-secondary py-4">
              <p className="text-xl md:text-2xl font-heading font-semibold text-primary italic">
                {t('about.quote')}
              </p>
            </blockquote>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl -z-10" />
              <img
                src={susana}
                alt="Susana Serna - Founder & CEO de Thalassa Hub"
                className="rounded-xl shadow-2xl max-w-full h-auto w-full max-h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
