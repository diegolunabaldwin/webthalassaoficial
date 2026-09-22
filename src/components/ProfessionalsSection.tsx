import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfesionales } from '@/hooks/useContenidoThalassa';
import ProfessionalGrid from './ProfessionalGrid';

const ADELANTO = 3;

/**
 * Adelanto del Hub en la portada. El listado completo, con filtros, vive en
 * /profesionales: así esa página tiene URL propia, título propio y se puede
 * posicionar por su cuenta.
 */
const ProfessionalsSection = () => {
  const { t } = useLanguage();
  const { profesionales, cargando } = useProfesionales();
  const { ref: headerRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  // Con el Hub vacío la sección no se pinta: mejor eso que un hueco.
  if (!cargando && profesionales.length === 0) return null;

  const hayMas = profesionales.length > ADELANTO;

  return (
    <section id="profesionales" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
            {t('professionals.subtitle')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            {t('professionals.title')}
          </h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto font-body">
            {t('professionals.description')}
          </p>
        </div>

        <ProfessionalGrid profesionales={profesionales.slice(0, ADELANTO)} cargando={cargando} />

        {!cargando && (
          <div className="text-center mt-14">
            <Link
              to="/profesionales"
              className="btn-primary inline-flex items-center gap-2 text-lg group"
            >
              {hayMas
                ? t('professionals.seeAllCount').replace('{n}', String(profesionales.length))
                : t('professionals.seeAll')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfessionalsSection;
