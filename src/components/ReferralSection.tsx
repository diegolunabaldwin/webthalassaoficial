import { useState, type FormEvent } from 'react';
import { Check, Gift } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { enviarRecomendacion } from '@/lib/thalassaApi';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import type { TranslationKey } from '@/locales';

const vacio = {
  ref_nombre: '',
  ref_email: '',
  ref_telefono: '',
  lead_nombre: '',
  lead_empresa: '',
  lead_email: '',
  lead_telefono: '',
  servicio: '',
  plazo: '',
  causa: '',
  mensaje: '',
  web: '', // señuelo anti bots
};

const claseCampo =
  'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/25 text-primary-foreground ' +
  'placeholder:text-primary-foreground/45 font-body outline-none transition-colors ' +
  'focus:border-champagne focus:bg-white/15';

// Fuera del componente a propósito: declararlo dentro crearía un tipo nuevo en
// cada render y React desmontaría los inputs, perdiendo el foco en cada tecla.
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
    <label htmlFor={id} className="block text-sm font-semibold text-primary-foreground/85 mb-2">
      {etiqueta}
    </label>
    {children}
  </div>
);

const ReferralSection = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.05 });

  const [datos, setDatos] = useState({ ...vacio });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);
  const [privacidad, setPrivacidad] = useState(false);

  const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const servicios: TranslationKey[] = [
    'services.strategy.title',
    'services.markets.title',
    'services.learning.title',
  ];
  const plazos: TranslationKey[] = [
    'referral.timingNow',
    'referral.timingQuarter',
    'referral.timingYear',
    'referral.timingUnsure',
  ];

  // Las cinco causas que eligió Susana. El valor que viaja es el identificador,
  // no el texto, para que el Worker pueda validarlo.
  const causas: { valor: string; clave: TranslationKey }[] = [
    { valor: 'desperdicio-alimentario', clave: 'referral.causeWaste' },
    { valor: 'restauracion-ambiental', clave: 'referral.causeNature' },
    { valor: 'limpieza-playas', clave: 'referral.causeBeaches' },
    { valor: 'educacion-alimentaria', clave: 'referral.causeEducation' },
    { valor: 'agricultura-regenerativa', clave: 'referral.causeFarming' },
  ];

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!acepta) {
      setError(t('referral.errorConsent'));
      return;
    }
    setEnviando(true);
    try {
      await enviarRecomendacion({ ...datos, consentimiento: true });
      setListo(true);
      setDatos({ ...vacio });
      setAcepta(false);
    } catch (err) {
      setError((err as Error).message || t('referral.errorGeneric'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <section id="recomienda" className="relative bg-primary pt-6 pb-24 md:pb-28">
        {/* Ola de entrada, sobre la sección clara anterior */}
        <div className="absolute top-0 left-0 right-0 -translate-y-[99%] pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(227, 43%, 42%)"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4">
          <div
            ref={sectionRef}
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-12">
              <span className="text-champagne font-semibold uppercase tracking-widest text-sm mb-4 block">
                {t('referral.subtitle')}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                {t('referral.title')}
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto font-body">
                {t('referral.description')}
              </p>
            </div>

            <ol className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
              {[1, 2, 3].map((n) => (
                <li key={n} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-champagne text-champagne-foreground font-heading font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {n}
                  </div>
                  <p className="text-primary-foreground font-bold mb-1.5">
                    {t(`referral.step${n}title` as TranslationKey)}
                  </p>
                  <p className="text-primary-foreground/70 text-sm font-body">
                    {t(`referral.step${n}text` as TranslationKey)}
                  </p>
                </li>
              ))}
            </ol>

            <div className="glass-card max-w-4xl mx-auto p-8 md:p-11">
              {listo ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-champagne/20 flex items-center justify-center mx-auto mb-6">
                    <Gift className="w-10 h-10 text-champagne" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                    {t('referral.successTitle')}
                  </h3>
                  <p className="text-primary-foreground/80 font-body max-w-xl mx-auto mb-8">
                    {t('referral.successText')}
                  </p>
                  <button onClick={() => setListo(false)} className="btn-champagne">
                    {t('referral.successAgain')}
                  </button>
                </div>
              ) : (
                <form onSubmit={enviar} noValidate>
                  {/* Señuelo: invisible para las personas, irresistible para los bots */}
                  <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
                    <label htmlFor="web-ref">No rellenar</label>
                    <input
                      id="web-ref"
                      name="web"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={datos.web}
                      onChange={set('web')}
                    />
                  </div>

                  <fieldset className="mb-8">
                    <legend className="w-full flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-champagne mb-5">
                      {t('referral.yourData')}
                      <span className="flex-1 h-px bg-white/20" />
                    </legend>
                    <div className="grid md:grid-cols-3 gap-5">
                      <Campo id="r_nombre" etiqueta={`${t('referral.name')} *`}>
                        <input id="r_nombre" required value={datos.ref_nombre} onChange={set('ref_nombre')}
                          autoComplete="name" className={claseCampo} />
                      </Campo>
                      <Campo id="r_email" etiqueta={`${t('referral.email')} *`}>
                        <input id="r_email" type="email" required value={datos.ref_email} onChange={set('ref_email')}
                          autoComplete="email" className={claseCampo} />
                      </Campo>
                      <Campo id="r_tel" etiqueta={t('referral.phone')}>
                        <input id="r_tel" type="tel" value={datos.ref_telefono} onChange={set('ref_telefono')}
                          autoComplete="tel" placeholder={t('referral.optional')} className={claseCampo} />
                      </Campo>
                    </div>
                  </fieldset>

                  <fieldset className="mb-8">
                    <legend className="w-full flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-champagne mb-5">
                      {t('referral.theirData')}
                      <span className="flex-1 h-px bg-white/20" />
                    </legend>
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <Campo id="l_nombre" etiqueta={`${t('referral.contactName')} *`}>
                        <input id="l_nombre" required value={datos.lead_nombre} onChange={set('lead_nombre')}
                          className={claseCampo} />
                      </Campo>
                      <Campo id="l_empresa" etiqueta={t('referral.company')}>
                        <input id="l_empresa" value={datos.lead_empresa} onChange={set('lead_empresa')}
                          className={claseCampo} />
                      </Campo>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <Campo id="l_email" etiqueta={`${t('referral.email')} *`}>
                        <input id="l_email" type="email" required value={datos.lead_email} onChange={set('lead_email')}
                          className={claseCampo} />
                      </Campo>
                      <Campo id="l_tel" etiqueta={t('referral.phone')}>
                        <input id="l_tel" type="tel" value={datos.lead_telefono} onChange={set('lead_telefono')}
                          placeholder={t('referral.optional')} className={claseCampo} />
                      </Campo>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <Campo id="l_servicio" etiqueta={t('referral.service')}>
                        <select id="l_servicio" value={datos.servicio} onChange={set('servicio')} className={claseCampo}>
                          <option value="" className="text-foreground">{t('referral.serviceDefault')}</option>
                          {servicios.map((s) => (
                            <option key={s} value={t(s)} className="text-foreground">{t(s)}</option>
                          ))}
                          <option value={t('referral.serviceUnsure')} className="text-foreground">
                            {t('referral.serviceUnsure')}
                          </option>
                        </select>
                      </Campo>
                      <Campo id="l_plazo" etiqueta={t('referral.timing')}>
                        <select id="l_plazo" value={datos.plazo} onChange={set('plazo')} className={claseCampo}>
                          <option value="" className="text-foreground">{t('referral.timingDefault')}</option>
                          {plazos.map((p) => (
                            <option key={p} value={t(p)} className="text-foreground">{t(p)}</option>
                          ))}
                        </select>
                      </Campo>
                    </div>
                    <Campo id="l_mensaje" etiqueta={t('referral.message')}>
                      <textarea id="l_mensaje" rows={3} maxLength={2000} value={datos.mensaje} onChange={set('mensaje')}
                        placeholder={t('referral.messagePlaceholder')} className={`${claseCampo} resize-y`} />
                    </Campo>
                  </fieldset>

                  <fieldset className="mb-8">
                    <legend className="w-full flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-champagne mb-5">
                      {t('referral.causeTitle')}
                      <span className="flex-1 h-px bg-white/20" />
                    </legend>
                    <p className="text-primary-foreground/75 font-body text-sm mb-4 max-w-2xl">
                      {t('referral.causeIntro')}
                    </p>
                    <Campo id="l_causa" etiqueta={t('referral.causeLabel')}>
                      <select id="l_causa" value={datos.causa} onChange={set('causa')} className={claseCampo}>
                        <option value="" className="text-foreground">{t('referral.causeDefault')}</option>
                        {causas.map((c) => (
                          <option key={c.valor} value={c.valor} className="text-foreground">{t(c.clave)}</option>
                        ))}
                      </select>
                    </Campo>
                  </fieldset>

                  <label className="flex items-start gap-3.5 mb-3 cursor-pointer group">
                    <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)}
                      className="sr-only" />
                    <span
                      aria-hidden="true"
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        acepta
                          ? 'bg-champagne border-champagne'
                          : 'border-primary-foreground/50 group-hover:border-primary-foreground'
                      }`}
                    >
                      {acepta && <Check className="w-4 h-4 text-champagne-foreground" strokeWidth={3} />}
                    </span>
                    <span className="text-primary-foreground/90 font-body text-sm leading-relaxed">
                      {t('referral.consent')}{' '}
                      <button type="button" onClick={(e) => { e.preventDefault(); setPrivacidad(true); }}
                        className="underline hover:text-champagne transition-colors">
                        {t('referral.consentPrivacy')}
                      </button>
                      .
                    </span>
                  </label>
                  <p className="text-primary-foreground/55 text-xs font-body mb-7 pl-[38px] leading-relaxed">
                    {t('referral.consentNote')}
                  </p>

                  {error && (
                    <p role="alert" className="bg-orange/20 text-primary-foreground rounded-lg px-4 py-3 mb-6 text-sm font-body">
                      {error}
                    </p>
                  )}

                  <div className="text-center">
                    <button type="submit" disabled={enviando}
                      className="btn-champagne w-full max-w-md uppercase tracking-wide disabled:opacity-55 disabled:cursor-not-allowed">
                      {enviando ? t('referral.sending') : t('referral.submit')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Ola de salida, hacia la sección clara siguiente */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(210, 33%, 96%)"
            />
          </svg>
        </div>
      </section>

      <PrivacyPolicyModal open={privacidad} onOpenChange={setPrivacidad} />
    </>
  );
};

export default ReferralSection;
