import { useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { enIdioma, type Profesional } from '@/lib/thalassaApi';
import ProfessionalAvatar from './ProfessionalAvatar';

interface Props {
  profesional: Profesional | null;
  onClose: () => void;
}

const Bloque = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">{titulo}</h4>
    {children}
  </div>
);

const Pildoras = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((i) => (
      <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-secondary/15 text-primary">
        {i}
      </span>
    ))}
  </div>
);

const Lista = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((i) => (
      <li key={i} className="flex items-start gap-3 text-foreground/80 font-body">
        <span className="w-1.5 h-1.5 rounded-full bg-champagne mt-2.5 flex-shrink-0" />
        <span>{i}</span>
      </li>
    ))}
  </ul>
);

const ProfessionalModal = ({ profesional: p, onClose }: Props) => {
  const { t, language } = useLanguage();
  // Desde /profesionales el ancla suelta no lleva a ninguna parte: hay que
  // volver a la home.
  const enHome = useLocation().pathname === '/';
  if (!p) return null;

  const rol = enIdioma(p.rol_es, p.rol_en, language);
  const ubicacion = [p.ciudad, p.pais].filter(Boolean).join(', ');
  const disponibilidad = enIdioma(p.disponibilidad_es, p.disponibilidad_en, language);

  return (
    <Dialog open onOpenChange={(abierto) => !abierto && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto p-0 gap-0 bg-card">
        <div className="bg-primary px-7 py-8 md:px-11 flex items-center gap-6">
          <ProfessionalAvatar p={p} className="w-20 h-20 md:w-24 md:h-24 text-2xl border-2 border-white/30" />
          <div className="min-w-0">
            <DialogTitle className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground leading-tight">
              {p.nombre}
            </DialogTitle>
            <p className="text-xs font-semibold uppercase tracking-widest text-champagne mt-2">{rol}</p>
            <DialogDescription className="text-primary-foreground/70 font-body mt-2">
              {[ubicacion, p.anios_experiencia ? `${p.anios_experiencia} ${t('professionals.years')}` : '']
                .filter(Boolean)
                .join(' · ')}
            </DialogDescription>
          </div>
        </div>

        <div className="px-7 py-8 md:px-11 space-y-8">
          {enIdioma(p.bio_es, p.bio_en, language) && (
            <Bloque titulo={t('professionals.profile')}>
              <p className="text-foreground/80 font-body leading-relaxed">
                {enIdioma(p.bio_es, p.bio_en, language)}
              </p>
            </Bloque>
          )}

          <div className="grid sm:grid-cols-2 gap-8">
            {p.expertise.length > 0 && (
              <Bloque titulo={t('professionals.expertise')}>
                <Pildoras items={p.expertise} />
              </Bloque>
            )}
            {p.sectores.length > 0 && (
              <Bloque titulo={t('professionals.sectors')}>
                <Lista items={p.sectores} />
              </Bloque>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {p.acreditaciones.length > 0 && (
              <Bloque titulo={t('professionals.accreditations')}>
                <Lista items={p.acreditaciones} />
              </Bloque>
            )}
            <div className="space-y-8">
              {p.idiomas.length > 0 && (
                <Bloque titulo={t('professionals.languages')}>
                  <Pildoras items={p.idiomas} />
                </Bloque>
              )}
              {disponibilidad && (
                <Bloque titulo={t('professionals.availability')}>
                  <p className="text-foreground/80 font-body">{disponibilidad}</p>
                </Bloque>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-muted px-7 py-5 md:px-11 flex flex-wrap items-center justify-between gap-4">
          {p.linkedin ? (
            <a
              href={p.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-secondary transition-colors"
            >
              {t('professionals.linkedin')}
            </a>
          ) : (
            <span />
          )}
          <a href={enHome ? '#contacto' : '/#contacto'} onClick={onClose} className="btn-champagne text-base">
            {t('professionals.contact')}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalModal;
