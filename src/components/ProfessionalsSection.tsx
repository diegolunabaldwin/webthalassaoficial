import { useMemo, useState } from 'react';
import { Linkedin } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfesionales } from '@/hooks/useContenidoThalassa';
import { codigoIdioma, enIdioma, iniciales, type Profesional } from '@/lib/thalassaApi';
import ProfessionalModal from './ProfessionalModal';

const Avatar = ({ p, className }: { p: Profesional; className?: string }) =>
  p.foto_url ? (
    <img
      src={p.foto_url}
      alt={p.nombre}
      loading="lazy"
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`rounded-full flex-shrink-0 flex items-center justify-center font-heading font-bold text-primary-foreground bg-gradient-to-br from-primary to-secondary ${className}`}
    >
      {iniciales(p.nombre)}
    </div>
  );

const ProfessionalsSection = () => {
  const { t, language } = useLanguage();
  const { profesionales, cargando } = useProfesionales();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  const [area, setArea] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<Profesional | null>(null);

  // Las áreas del filtro salen de los propios perfiles: si Susana añade una
  // especialidad nueva desde el panel, aparece sola.
  const areas = useMemo(() => {
    const vistas = new Set<string>();
    profesionales.forEach((p) => p.expertise.forEach((e) => vistas.add(e)));
    return [...vistas].sort((a, b) => a.localeCompare(b, 'es'));
  }, [profesionales]);

  const visibles = useMemo(
    () => (area ? profesionales.filter((p) => p.expertise.includes(area)) : profesionales),
    [profesionales, area]
  );

  // Mientras no haya nadie cargado, la sección no se pinta: es preferible a
  // enseñarle a un visitante un Hub vacío.
  if (!cargando && profesionales.length === 0) return null;

  return (
    <section id="profesionales" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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

        {cargando ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-service p-8 h-72 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <>
            {areas.length > 1 && (
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button
                  onClick={() => setArea(null)}
                  aria-pressed={area === null}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    area === null
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground/75 border-border hover:border-secondary'
                  }`}
                >
                  {t('professionals.filterAll')}
                </button>
                {areas.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    aria-pressed={area === a}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      area === a
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground/75 border-border hover:border-secondary'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}

            <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibles.map((p, i) => (
                <article
                  key={p.id}
                  className={`card-markets p-8 h-full flex flex-col transition-all duration-700 hover:shadow-2xl ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: cardsVisible ? `${Math.min(i, 5) * 120}ms` : '0ms' }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <Avatar p={p} className="w-16 h-16 text-lg" />
                    <div>
                      <h3 className="font-heading text-xl font-bold text-primary leading-tight">
                        {p.nombre}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary mt-1.5">
                        {enIdioma(p.rol_es, p.rol_en, language)}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/70 font-body mb-5 flex-grow">
                    {enIdioma(p.bio_es, p.bio_en, language)}
                  </p>

                  {p.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.expertise.slice(0, 3).map((e) => (
                        <span
                          key={e}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/15 text-primary"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border/70 pt-4 mt-auto">
                    <button
                      onClick={() => setAbierto(p)}
                      className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                    >
                      {t('professionals.viewProfile')}
                    </button>
                    <div className="flex items-center gap-3">
                      {p.idiomas.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {p.idiomas.map(codigoIdioma).join(' · ')}
                        </span>
                      )}
                      {p.linkedin && (
                        <a
                          href={p.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn · ${p.nombre}`}
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <ProfessionalModal
        profesional={abierto}
        onClose={() => setAbierto(null)}
        Avatar={Avatar}
      />
    </section>
  );
};

export default ProfessionalsSection;
