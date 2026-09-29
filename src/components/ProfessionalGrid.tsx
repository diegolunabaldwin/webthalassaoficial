import { useMemo, useState } from 'react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { codigoIdioma, enIdioma, type Profesional } from '@/lib/thalassaApi';
import ProfessionalAvatar from './ProfessionalAvatar';
import ProfessionalModal from './ProfessionalModal';

interface Props {
  profesionales: Profesional[];
  /** El filtro solo tiene sentido en la página completa, no en el adelanto de la home. */
  conFiltros?: boolean;
  cargando?: boolean;
}

/** Rejilla de fichas, compartida por la home y por /profesionales. */
const ProfessionalGrid = ({ profesionales, conFiltros = false, cargando = false }: Props) => {
  const { t, language } = useLanguage();
  const { ref: cardsRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [area, setArea] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<Profesional | null>(null);

  // Las áreas salen de los propios perfiles: si Susana añade una especialidad
  // nueva desde el panel, aparece sola en el filtro.
  const areas = useMemo(() => {
    const vistas = new Set<string>();
    profesionales.forEach((p) => p.expertise.forEach((e) => vistas.add(e)));
    return [...vistas].sort((a, b) => a.localeCompare(b, 'es'));
  }, [profesionales]);

  const visibles = useMemo(
    () => (area ? profesionales.filter((p) => p.expertise.includes(area)) : profesionales),
    [profesionales, area]
  );

  if (cargando) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card-service p-8 h-72 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  const claseFiltro = (activo: boolean) =>
    `px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
      activo
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-card text-foreground/75 border-border hover:border-secondary'
    }`;

  return (
    <>
      {conFiltros && areas.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button onClick={() => setArea(null)} aria-pressed={area === null} className={claseFiltro(area === null)}>
            {t('professionals.filterAll')}
          </button>
          {areas.map((a) => (
            <button key={a} onClick={() => setArea(a)} aria-pressed={area === a} className={claseFiltro(area === a)}>
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
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: isVisible ? `${Math.min(i, 5) * 120}ms` : '0ms' }}
          >
            <div className="flex items-center gap-4 mb-5">
              <ProfessionalAvatar p={p} className="w-16 h-16 text-lg" />
              <div>
                <h3 className="font-heading text-xl font-bold text-primary leading-tight">{p.nombre}</h3>
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
                  <span key={e} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/15 text-primary">
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
              {p.idiomas.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {p.idiomas.map(codigoIdioma).join(' · ')}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <ProfessionalModal profesional={abierto} onClose={() => setAbierto(null)} />
    </>
  );
};

export default ProfessionalGrid;
