import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import landing1 from '@/assets/landing1.webp';
import landing2 from '@/assets/landing2.webp';
import landing3 from '@/assets/landing3.webp';

const slides = [landing1, landing2, landing3];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // La primera imagen es la que marca el tiempo de carga percibido. Las otras
  // dos no se piden hasta que el navegador está libre: la primera transición
  // ocurre a los 5 s, así que da tiempo de sobra.
  const [cargarResto, setCargarResto] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    const idle =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(() => setCargarResto(true), { timeout: 2500 })
        : window.setTimeout(() => setCargarResto(true), 1500);
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Fondo. Son decorativas: el texto real va en el h1, así que alt vacío. */}
      {slides.map((slide, index) => {
        if (index > 0 && !cargarResto) return null;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide}
              alt=""
              aria-hidden="true"
              width={1920}
              height={1080}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding={index === 0 ? 'sync' : 'async'}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/85" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 max-w-5xl mx-auto leading-tight animate-slide-up">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto animate-fade-in font-body">
            {t('hero.subtitle')}
          </p>
          <a
            href="#servicios"
            className="btn-secondary inline-block text-lg animate-fade-in"
          >
            {t('hero.cta')}
          </a>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-secondary w-8'
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(210, 33%, 98%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroCarousel;
