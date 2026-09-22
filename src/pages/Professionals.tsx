import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProfessionalGrid from '@/components/ProfessionalGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfesionales } from '@/hooks/useContenidoThalassa';

/**
 * Página completa del Hub de Profesionales.
 *
 * Tener URL propia hace que Google y los buscadores con IA puedan posicionar
 * el equipo por separado de la portada. El HTML con el título y el contenido
 * de esta ruta se genera en el build (ver el plugin de vite.config.ts), porque
 * la web es una SPA y sin eso todas las rutas compartirían la misma cabecera.
 */
const Professionals = () => {
  const { t, language } = useLanguage();
  const { profesionales, cargando } = useProfesionales();

  // En una SPA el título no cambia solo al navegar entre rutas.
  useEffect(() => {
    const anterior = document.title;
    document.title =
      language === 'en'
        ? 'Professionals Hub | Thalassa Hub'
        : 'Hub de Profesionales | Thalassa Hub';
    return () => {
      document.title = anterior;
    };
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Cabecera azul, con la ola de salida hacia el contenido claro */}
        <header className="relative bg-primary pt-32 pb-24 md:pt-40 md:pb-28">
          <div className="container mx-auto px-4 text-center">
            <span className="text-champagne font-semibold uppercase tracking-widest text-sm mb-4 block">
              {t('professionals.subtitle')}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto leading-tight">
              {t('professionals.title')}
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto font-body">
              {t('professionals.description')}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="hsl(210, 33%, 98%)"
              />
            </svg>
          </div>
        </header>

        <section className="bg-background pb-24 pt-8 md:pt-12">
          <div className="container mx-auto px-4">
            {!cargando && profesionales.length === 0 ? (
              <p className="text-center text-foreground/70 font-body text-lg py-20 max-w-xl mx-auto">
                {t('professionals.empty')}
              </p>
            ) : (
              <ProfessionalGrid profesionales={profesionales} conFiltros cargando={cargando} />
            )}

            <div className="text-center mt-16 pt-10 border-t border-border">
              <p className="text-foreground/70 font-body mb-6 max-w-2xl mx-auto">
                {t('professionals.ctaText')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="/#contacto" className="btn-champagne">
                  {t('professionals.ctaButton')}
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('professionals.backHome')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </div>
  );
};

export default Professionals;
