import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProfessionalAvatar from '@/components/ProfessionalAvatar';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfesionales } from '@/hooks/useContenidoThalassa';
import { enviarConsulta, enIdioma, codigoIdioma } from '@/lib/thalassaApi';

const Bloque = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">{titulo}</h2>
    {children}
  </section>
);

const Pildoras = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((i) => (
      <span key={i} className="px-3.5 py-1.5 rounded-full text-sm font-semibold bg-secondary/15 text-primary">
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
  'w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground font-body ' +
  'outline-none transition-colors focus:border-secondary';

const Campo = ({ id, etiqueta, children }: { id: string; etiqueta: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-foreground/85 mb-2">
      {etiqueta}
    </label>
    {children}
  </div>
);

const vacio = { nombre: '', email: '', empresa: '', telefono: '', mensaje: '', web: '' };

/**
 * Ficha individual con URL propia (/profesionales/:slug).
 *
 * Tener URL por persona es lo que permite que cada auditor sea una entidad
 * indexable por su cuenta, con su Person en el grafo de datos estructurados.
 * El HTML de cada una se genera en el build (ver vite.config.ts).
 */
const Professional = () => {
  const { slug = '' } = useParams();
  const { t, language } = useLanguage();
  const { profesionales, cargando } = useProfesionales();

  const [datos, setDatos] = useState({ ...vacio });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [privacidad, setPrivacidad] = useState(false);

  const p = useMemo(() => profesionales.find((x) => x.slug === slug), [profesionales, slug]);

  useEffect(() => {
    if (!p) return;
    const anterior = document.title;
    document.title = `${p.nombre} | Thalassa Hub`;
    return () => {
      document.title = anterior;
    };
  }, [p]);

  const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!acepta) {
      setError(t('consulta.errorConsent'));
      return;
    }
    setEnviando(true);
    try {
      await enviarConsulta({ ...datos, profesional_id: p?.id, consentimiento: true });
      setEnviado(true);
    } catch (err) {
      setError((err as Error).message || t('consulta.errorGeneric'));
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-40 pb-24 text-center text-muted-foreground font-body">
          {t('reviewForm.loading')}
        </div>
        <Footer />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-40 pb-24 container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            {t('professionals.notFound')}
          </h1>
          <Link to="/profesionales" className="btn-primary inline-block mt-4">
            {t('professionals.seeAll')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rol = enIdioma(p.rol_es, p.rol_en, language);
  const bio = enIdioma(p.bio_es, p.bio_en, language);
  const disponibilidad = enIdioma(p.disponibilidad_es, p.disponibilidad_en, language);
  const ubicacion = [p.ciudad, p.pais].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <header className="relative bg-primary pt-32 pb-24 md:pt-40 md:pb-28">
          <div className="container mx-auto px-4">
            <nav aria-label="Migas de pan" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/60 font-body">
                <li><Link to="/" className="hover:text-champagne transition-colors">Thalassa Hub</Link></li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to="/profesionales" className="hover:text-champagne transition-colors">
                    {t('professionals.subtitle')}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-primary-foreground/90">{p.nombre}</li>
              </ol>
            </nav>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7">
              <ProfessionalAvatar p={p} className="w-28 h-28 text-3xl border-2 border-white/30" />
              <div className="min-w-0">
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                  {p.nombre}
                </h1>
                <p className="text-sm font-semibold uppercase tracking-widest text-champagne mt-3">{rol}</p>
                {ubicacion && (
                  <p className="text-primary-foreground/70 font-body mt-2">{ubicacion}</p>
                )}
              </div>
            </div>
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

        <div className="bg-background pb-24 pt-6 md:pt-10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 max-w-6xl mx-auto">
              {/* Perfil */}
              <div className="space-y-10">
                {bio && (
                  <Bloque titulo={t('professionals.profile')}>
                    <p className="text-foreground/80 font-body text-lg leading-relaxed">{bio}</p>
                  </Bloque>
                )}

                <div className="grid sm:grid-cols-2 gap-10">
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

                <div className="grid sm:grid-cols-2 gap-10">
                  {p.acreditaciones.length > 0 && (
                    <Bloque titulo={t('professionals.accreditations')}>
                      <Lista items={p.acreditaciones} />
                    </Bloque>
                  )}
                  <div className="space-y-10">
                    {p.idiomas.length > 0 && (
                      <Bloque titulo={t('professionals.languages')}>
                        <Pildoras items={p.idiomas.map((i) => `${i} (${codigoIdioma(i)})`)} />
                      </Bloque>
                    )}
                    {disponibilidad && (
                      <Bloque titulo={t('professionals.availability')}>
                        <p className="text-foreground/80 font-body">{disponibilidad}</p>
                      </Bloque>
                    )}
                  </div>
                </div>

                <Link
                  to="/profesionales"
                  className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary transition-colors pt-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('professionals.seeAll')}
                </Link>
              </div>

              {/* Consulta */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="card-markets p-8">
                  {enviado ? (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-champagne/25 flex items-center justify-center mx-auto mb-5">
                        <Check className="w-7 h-7 text-champagne-foreground" strokeWidth={3} />
                      </div>
                      <h2 className="font-heading text-xl font-bold text-primary mb-3">
                        {t('consulta.okTitulo')}
                      </h2>
                      <p className="text-foreground/70 font-body text-sm">{t('consulta.okTexto')}</p>
                    </div>
                  ) : (
                    <form onSubmit={enviar}>
                      <h2 className="font-heading text-xl font-bold text-primary mb-2">
                        {t('consulta.titulo').replace('{n}', p.nombre.split(' ')[0])}
                      </h2>
                      <p className="text-foreground/70 font-body text-sm mb-6">{t('consulta.intro')}</p>

                      <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                        <label htmlFor="web-prof">No rellenar</label>
                        <input id="web-prof" name="web" type="text" tabIndex={-1} autoComplete="off"
                          value={datos.web} onChange={set('web')} />
                      </div>

                      <div className="space-y-4 mb-5">
                        <Campo id="c_nombre" etiqueta={`${t('consulta.nombre')} *`}>
                          <input id="c_nombre" required autoComplete="name" value={datos.nombre}
                            onChange={set('nombre')} className={claseCampo} />
                        </Campo>
                        <Campo id="c_email" etiqueta={`${t('consulta.email')} *`}>
                          <input id="c_email" type="email" required autoComplete="email" value={datos.email}
                            onChange={set('email')} className={claseCampo} />
                        </Campo>
                        <Campo id="c_empresa" etiqueta={t('consulta.empresa')}>
                          <input id="c_empresa" value={datos.empresa} onChange={set('empresa')} className={claseCampo} />
                        </Campo>
                        <Campo id="c_mensaje" etiqueta={t('consulta.mensaje')}>
                          <textarea id="c_mensaje" rows={4} maxLength={2000} value={datos.mensaje}
                            onChange={set('mensaje')} placeholder={t('consulta.mensajePlaceholder')}
                            className={`${claseCampo} resize-y`} />
                        </Campo>
                      </div>

                      <label className="flex items-start gap-3 mb-5 cursor-pointer group">
                        <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)}
                          className="sr-only" />
                        <span aria-hidden="true"
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            acepta ? 'bg-champagne border-champagne' : 'border-border group-hover:border-secondary'
                          }`}>
                          {acepta && <Check className="w-3.5 h-3.5 text-champagne-foreground" strokeWidth={3} />}
                        </span>
                        <span className="text-foreground/75 font-body text-xs leading-relaxed">
                          {t('consulta.consent')}{' '}
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPrivacidad(true); }}
                            className="underline hover:text-secondary transition-colors">
                            {t('consulta.consentPrivacy')}
                          </button>
                          .
                        </span>
                      </label>

                      {error && (
                        <p role="alert" className="bg-orange/10 text-orange rounded-lg px-4 py-2.5 mb-4 text-sm font-body">
                          {error}
                        </p>
                      )}

                      <button type="submit" disabled={enviando}
                        className="btn-champagne w-full disabled:opacity-55 disabled:cursor-not-allowed">
                        {enviando ? t('consulta.enviando') : t('consulta.enviar')}
                      </button>

                      <p className="text-xs text-muted-foreground text-center mt-4 font-body">
                        {t('professionals.viaHub')}
                      </p>
                    </form>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
      <WhatsAppButton />
      <PrivacyPolicyModal open={privacidad} onOpenChange={setPrivacidad} />
    </div>
  );
};

export default Professional;
