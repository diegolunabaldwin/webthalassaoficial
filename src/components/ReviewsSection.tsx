import { Star } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResenas } from '@/hooks/useContenidoThalassa';
import { enIdioma, iniciales, type Resena } from '@/lib/thalassaApi';

// Cada línea de negocio conserva su color, igual que en la sección de servicios.
const porLinea: Record<string, string> = {
  strategy: 'card-strategy',
  markets: 'card-markets',
  learning: 'card-learning',
};

const Estrellas = ({ n, className = 'w-4 h-4' }: { n: number; className?: string }) => (
  <div className="flex gap-0.5" role="img" aria-label={`${n} / 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`${className} ${i <= n ? 'fill-champagne text-champagne' : 'text-border'}`}
      />
    ))}
  </div>
);

const ReviewsSection = () => {
  const { t, language } = useLanguage();
  const { resenas, total, media, cargando } = useResenas();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  // Sin reseñas aprobadas la sección desaparece. Una banda de prueba social
  // vacía resta más de lo que suma.
  if (cargando || resenas.length === 0) return null;

  const texto = (r: Resena) => enIdioma(r.texto_es, r.texto_en, language);

  return (
    // bg-muted sólido (no /40) para que la ola de salida de Recomiéndanos,
    // rellena con ese mismo color, encaje sin costura.
    <section id="resenas" className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
            {t('reviews.subtitle')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            {t('reviews.title')}
          </h2>
          <p className="text-foreground/70 text-lg md:text-xl max-w-3xl mx-auto font-body">
            {t('reviews.description')}
          </p>
        </div>

        {media !== null && (
          <div className="flex items-center justify-center gap-5 mb-12">
            <span className="font-heading text-5xl font-extrabold text-primary leading-none">
              {media.toLocaleString(language === 'en' ? 'en-GB' : 'es-ES', {
                minimumFractionDigits: 1,
              })}
            </span>
            <div>
              <Estrellas n={Math.round(media)} className="w-5 h-5" />
              <p className="text-sm text-muted-foreground mt-1.5">
                {t('reviews.basedOn').replace('{n}', String(total))}
              </p>
            </div>
          </div>
        )}

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {resenas.map((r, i) => (
            <figure
              key={r.id}
              className={`${porLinea[r.linea ?? ''] ?? 'card-strategy'} p-8 h-full flex flex-col transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: cardsVisible ? `${Math.min(i, 5) * 120}ms` : '0ms' }}
            >
              {r.puntuacion ? <Estrellas n={r.puntuacion} /> : null}

              <blockquote className="text-foreground/80 font-body leading-relaxed flex-grow mt-4 mb-6">
                {texto(r)}
              </blockquote>

              <figcaption className="flex items-center gap-3.5 border-t border-border/70 pt-5">
                {r.logo_url ? (
                  <img
                    src={r.logo_url}
                    alt={r.cliente_empresa ?? ''}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-contain bg-card flex-shrink-0"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-heading font-bold text-primary-foreground bg-gradient-to-br from-primary to-secondary"
                  >
                    {iniciales(r.cliente_nombre)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-primary leading-tight">{r.cliente_nombre}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {[r.cliente_cargo, r.cliente_empresa].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </figcaption>

              {r.servicio && (
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mt-4">
                  {r.servicio}
                </p>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
