import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { enviarConsulta, enIdioma, type Profesional } from '@/lib/thalassaApi';
import ProfessionalAvatar from './ProfessionalAvatar';
import PrivacyPolicyModal from './PrivacyPolicyModal';

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

const claseCampo =
  'w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body ' +
  'outline-none transition-colors focus:border-secondary';

// Fuera del componente: declararlo dentro crearía un tipo nuevo en cada render
// y los inputs perderían el foco en cada tecla.
const Campo = ({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-foreground/85 mb-2">
      {etiqueta}
    </label>
    {children}
  </div>
);

const vacio = { nombre: '', email: '', empresa: '', telefono: '', mensaje: '', web: '' };

const ProfessionalModal = ({ profesional: p, onClose }: Props) => {
  const { t, language } = useLanguage();
  const [vista, setVista] = useState<'perfil' | 'form' | 'enviado'>('perfil');
  const [datos, setDatos] = useState({ ...vacio });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [privacidad, setPrivacidad] = useState(false);

  // Al abrir otra ficha se vuelve al perfil, sin arrastrar el formulario anterior.
  useEffect(() => {
    setVista('perfil');
    setDatos({ ...vacio });
    setAcepta(false);
    setError('');
  }, [p?.id]);

  if (!p) return null;

  const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const rol = enIdioma(p.rol_es, p.rol_en, language);
  const ubicacion = [p.ciudad, p.pais].filter(Boolean).join(', ');
  const disponibilidad = enIdioma(p.disponibilidad_es, p.disponibilidad_en, language);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!acepta) {
      setError(t('consulta.errorConsent'));
      return;
    }
    setEnviando(true);
    try {
      await enviarConsulta({ ...datos, profesional_id: p.id, consentimiento: true });
      setVista('enviado');
    } catch (err) {
      setError((err as Error).message || t('consulta.errorGeneric'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
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
                {ubicacion}
              </DialogDescription>
            </div>
          </div>

          {/* ── Perfil ── */}
          {vista === 'perfil' && (
            <>
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

              <div className="border-t border-border bg-muted px-7 py-6 md:px-11 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-body max-w-xs">
                  {t('professionals.viaHub')}
                </p>
                <button onClick={() => setVista('form')} className="btn-champagne text-base">
                  {t('consulta.abrir').replace('{n}', p.nombre.split(' ')[0])}
                </button>
              </div>
            </>
          )}

          {/* ── Formulario ── */}
          {vista === 'form' && (
            <form onSubmit={enviar} className="px-7 py-8 md:px-11">
              <button
                type="button"
                onClick={() => setVista('perfil')}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('consulta.volver')}
              </button>

              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                {t('consulta.titulo').replace('{n}', p.nombre)}
              </h3>
              <p className="text-foreground/70 font-body mb-7">{t('consulta.intro')}</p>

              {/* Señuelo: invisible para las personas, irresistible para los bots */}
              <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                <label htmlFor="web-cons">No rellenar</label>
                <input id="web-cons" name="web" type="text" tabIndex={-1} autoComplete="off"
                  value={datos.web} onChange={set('web')} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Campo id="c_nombre" etiqueta={`${t('consulta.nombre')} *`}>
                  <input id="c_nombre" required autoComplete="name" value={datos.nombre}
                    onChange={set('nombre')} className={claseCampo} />
                </Campo>
                <Campo id="c_email" etiqueta={`${t('consulta.email')} *`}>
                  <input id="c_email" type="email" required autoComplete="email" value={datos.email}
                    onChange={set('email')} className={claseCampo} />
                </Campo>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Campo id="c_empresa" etiqueta={t('consulta.empresa')}>
                  <input id="c_empresa" value={datos.empresa} onChange={set('empresa')} className={claseCampo} />
                </Campo>
                <Campo id="c_telefono" etiqueta={t('consulta.telefono')}>
                  <input id="c_telefono" type="tel" value={datos.telefono} onChange={set('telefono')}
                    placeholder={t('consulta.opcional')} className={claseCampo} />
                </Campo>
              </div>

              <div className="mb-6">
                <Campo id="c_mensaje" etiqueta={t('consulta.mensaje')}>
                  <textarea id="c_mensaje" rows={4} maxLength={2000} value={datos.mensaje}
                    onChange={set('mensaje')} placeholder={t('consulta.mensajePlaceholder')}
                    className={`${claseCampo} resize-y`} />
                </Campo>
              </div>

              <label className="flex items-start gap-3.5 mb-6 cursor-pointer group">
                <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)}
                  className="sr-only" />
                <span aria-hidden="true"
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    acepta ? 'bg-champagne border-champagne' : 'border-border group-hover:border-secondary'
                  }`}>
                  {acepta && <Check className="w-4 h-4 text-champagne-foreground" strokeWidth={3} />}
                </span>
                <span className="text-foreground/80 font-body text-sm leading-relaxed">
                  {t('consulta.consent')}{' '}
                  <button type="button" onClick={(e) => { e.preventDefault(); setPrivacidad(true); }}
                    className="underline hover:text-secondary transition-colors">
                    {t('consulta.consentPrivacy')}
                  </button>
                  .
                </span>
              </label>

              {error && (
                <p role="alert" className="bg-orange/10 text-orange rounded-lg px-4 py-3 mb-5 text-sm font-body">
                  {error}
                </p>
              )}

              <button type="submit" disabled={enviando}
                className="btn-champagne w-full disabled:opacity-55 disabled:cursor-not-allowed">
                {enviando ? t('consulta.enviando') : t('consulta.enviar')}
              </button>
            </form>
          )}

          {/* ── Enviado ── */}
          {vista === 'enviado' && (
            <div className="px-7 py-14 md:px-11 text-center">
              <div className="w-16 h-16 rounded-full bg-champagne/25 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-champagne-foreground" strokeWidth={3} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                {t('consulta.okTitulo')}
              </h3>
              <p className="text-foreground/70 font-body max-w-md mx-auto mb-8">
                {t('consulta.okTexto')}
              </p>
              <button onClick={onClose} className="btn-primary">
                {t('consulta.cerrar')}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PrivacyPolicyModal open={privacidad} onOpenChange={setPrivacidad} />
    </>
  );
};

export default ProfessionalModal;
