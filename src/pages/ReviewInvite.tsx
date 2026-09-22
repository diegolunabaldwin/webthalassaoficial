import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getInvitacion, enviarResena, type Invitacion } from '@/lib/thalassaApi';
import logo from '@/assets/logo-header.png';

const MIN_CARACTERES = 30;

const Marco = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-primary flex items-center justify-center p-5 py-12">
    <div className="w-full max-w-2xl">
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl px-5 py-3">
          <img src={logo} alt="Thalassa Hub" className="h-9 w-auto" />
        </div>
      </div>
      <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">{children}</div>
    </div>
  </div>
);

const ReviewInvite = () => {
  const { token = '' } = useParams();
  const { t } = useLanguage();

  const [invitacion, setInvitacion] = useState<Invitacion | null>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'invalido' | 'enviado'>('cargando');

  const [puntuacion, setPuntuacion] = useState(5);
  const [sobrevuelo, setSobrevuelo] = useState(0);
  const [texto, setTexto] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // La página no debe indexarse: es un enlace personal y de un solo uso.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    getInvitacion(token)
      .then((inv) => {
        setInvitacion(inv);
        setNombre(inv.cliente_nombre ?? '');
        setCargo(inv.cliente_cargo ?? '');
        setEmpresa(inv.cliente_empresa ?? '');
        setEstado('listo');
      })
      .catch(() => setEstado('invalido'));
  }, [token]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (texto.trim().length < MIN_CARACTERES) {
      setError(t('reviewForm.minChars'));
      return;
    }
    setEnviando(true);
    try {
      await enviarResena(token, {
        texto_es: texto.trim(),
        puntuacion,
        cliente_nombre: nombre.trim(),
        cliente_cargo: cargo.trim(),
        cliente_empresa: empresa.trim(),
      });
      setEstado('enviado');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  if (estado === 'cargando') {
    return (
      <Marco>
        <div className="p-14 text-center text-muted-foreground font-body">{t('reviewForm.loading')}</div>
      </Marco>
    );
  }

  if (estado === 'invalido') {
    return (
      <Marco>
        <div className="p-11 text-center">
          <div className="w-16 h-16 rounded-full bg-orange/15 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-orange" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary mb-3">
            {t('reviewForm.invalidTitle')}
          </h1>
          <p className="text-foreground/70 font-body mb-8">{t('reviewForm.invalidText')}</p>
          <a href="https://www.thalassahub.com" className="btn-primary inline-block">
            {t('reviewForm.backToSite')}
          </a>
        </div>
      </Marco>
    );
  }

  if (estado === 'enviado') {
    return (
      <Marco>
        <div className="p-11 text-center">
          <div className="w-16 h-16 rounded-full bg-champagne/25 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-champagne-foreground" strokeWidth={3} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary mb-3">
            {t('reviewForm.successTitle')}
          </h1>
          <p className="text-foreground/70 font-body mb-8">{t('reviewForm.successText')}</p>
          <a href="https://www.thalassahub.com" className="btn-primary inline-block">
            {t('reviewForm.backToSite')}
          </a>
        </div>
      </Marco>
    );
  }

  const campo =
    'w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body ' +
    'outline-none transition-colors focus:border-secondary';

  return (
    <Marco>
      <div className="bg-primary px-8 py-7 md:px-11">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
          {t('reviewForm.title')}
        </h1>
        {invitacion?.servicio && (
          <p className="text-champagne text-xs font-semibold uppercase tracking-widest mt-2.5">
            {invitacion.servicio}
          </p>
        )}
      </div>

      <form onSubmit={enviar} className="px-8 py-8 md:px-11">
        <p className="text-foreground/70 font-body mb-8">{t('reviewForm.intro')}</p>

        <fieldset className="mb-8">
          <legend className="block text-sm font-semibold text-foreground/85 mb-3">
            {t('reviewForm.rating')}
          </legend>
          <div className="flex gap-1.5" onMouseLeave={() => setSobrevuelo(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPuntuacion(n)}
                onMouseEnter={() => setSobrevuelo(n)}
                aria-label={`${n} / 5`}
                aria-pressed={puntuacion === n}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    n <= (sobrevuelo || puntuacion)
                      ? 'fill-champagne text-champagne'
                      : 'text-border'
                  }`}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mb-6">
          <label htmlFor="rf_texto" className="block text-sm font-semibold text-foreground/85 mb-2">
            {t('reviewForm.text')} *
          </label>
          <textarea
            id="rf_texto"
            rows={6}
            required
            maxLength={1500}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={t('reviewForm.textPlaceholder')}
            className={`${campo} resize-y`}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            {texto.trim().length} / {MIN_CARACTERES}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-7">
          <div>
            <label htmlFor="rf_nombre" className="block text-sm font-semibold text-foreground/85 mb-2">
              {t('reviewForm.name')}
            </label>
            <input id="rf_nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
          </div>
          <div>
            <label htmlFor="rf_cargo" className="block text-sm font-semibold text-foreground/85 mb-2">
              {t('reviewForm.role')}
            </label>
            <input id="rf_cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} className={campo} />
          </div>
          <div>
            <label htmlFor="rf_empresa" className="block text-sm font-semibold text-foreground/85 mb-2">
              {t('reviewForm.company')}
            </label>
            <input id="rf_empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={campo} />
          </div>
        </div>

        {error && (
          <p role="alert" className="bg-orange/10 text-orange rounded-lg px-4 py-3 mb-5 text-sm font-body">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="btn-champagne w-full disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {enviando ? t('reviewForm.sending') : t('reviewForm.submit')}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4 font-body">
          {t('reviewForm.moderationNote')}
        </p>
      </form>
    </Marco>
  );
};

export default ReviewInvite;
