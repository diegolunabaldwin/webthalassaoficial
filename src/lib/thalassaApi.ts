/**
 * Cliente de thalassa-api (Cloudflare Worker).
 *
 * La web sigue alojada en Vercel: el Worker solo aporta los datos del
 * Hub de Profesionales, las recomendaciones y las reseñas.
 *
 * Estrategia de carga en dos tiempos:
 *  1. En el build se hornean los datos en el HTML (`window.__THALASSA__`),
 *     para que Google y los rastreadores de IA los lean sin ejecutar JavaScript
 *     y para que la sección pinte sin salto visual.
 *  2. Ya en el navegador se revalida contra la API, así los cambios que haga
 *     Susana en el panel se ven al momento, sin esperar a la reconstrucción.
 */

export const API_URL =
  import.meta.env.VITE_API_URL || 'https://thalassa-api.diegoluba17.workers.dev';

/* ── Tipos (reflejan lo que devuelve el Worker) ── */

export interface Profesional {
  id: number;
  slug: string;
  nombre: string;
  rol_es: string;
  rol_en: string | null;
  bio_es: string;
  bio_en: string | null;
  ciudad: string | null;
  pais: string | null;
  expertise: string[];
  sectores: string[];
  acreditaciones: string[];
  idiomas: string[];
  foto_url: string | null;
  disponibilidad_es: string | null;
  disponibilidad_en: string | null;
  orden: number;
}

export interface Resena {
  id: number;
  cliente_nombre: string;
  cliente_cargo: string | null;
  cliente_empresa: string | null;
  logo_url: string | null;
  puntuacion: number | null;
  texto_es: string;
  texto_en: string | null;
  servicio: string | null;
  linea: string | null;
  destacada: boolean;
  creado_en: string;
}

export interface DatosResenas {
  resenas: Resena[];
  total: number;
  media: number | null;
}

export interface Invitacion {
  cliente_nombre: string;
  cliente_cargo: string | null;
  cliente_empresa: string | null;
  servicio: string | null;
  linea: string | null;
}

export interface Recomendacion {
  ref_nombre: string;
  ref_email: string;
  ref_telefono?: string;
  lead_nombre: string;
  lead_empresa?: string;
  lead_email: string;
  lead_telefono?: string;
  servicio?: string;
  plazo?: string;
  /** Causa a la que Thalassa donará los 50 EUR si la recomendación prospera. */
  causa?: string;
  mensaje?: string;
  consentimiento: boolean;
  /** Señuelo anti bots: debe llegar siempre vacío. */
  web?: string;
}

/* ── Datos horneados en el build ── */

interface Horneado {
  profesionales?: Profesional[];
  resenas?: Resena[];
  total?: number;
  media?: number | null;
  generado?: string;
}

export function datosHorneados(): Horneado {
  if (typeof window === 'undefined') return {};
  return (window as unknown as { __THALASSA__?: Horneado }).__THALASSA__ || {};
}

/* ── Llamadas ── */

async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const r = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(opciones?.headers || {}) },
  });
  const tipo = r.headers.get('Content-Type') || '';
  const datos = tipo.includes('json') ? await r.json() : {};
  if (!r.ok) {
    const error = new Error((datos as { error?: string }).error || `Error ${r.status}`);
    (error as Error & { status?: number }).status = r.status;
    throw error;
  }
  return datos as T;
}

export const getProfesionales = () =>
  pedir<{ profesionales: Profesional[] }>('/api/professionals').then((d) => d.profesionales);

export const getResenas = () => pedir<DatosResenas>('/api/reviews');

export const enviarRecomendacion = (datos: Recomendacion) =>
  pedir<{ ok: boolean; id: number; mensaje: string }>('/api/referrals', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/** Consulta desde la ficha de un profesional. Siempre llega a Thalassa Hub. */
export interface Consulta {
  profesional_id?: number;
  nombre: string;
  email: string;
  empresa?: string;
  telefono?: string;
  mensaje?: string;
  consentimiento: boolean;
  /** Señuelo anti bots: debe llegar siempre vacío. */
  web?: string;
}

export const enviarConsulta = (datos: Consulta) =>
  pedir<{ ok: boolean; mensaje: string }>('/api/consultas', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

export const getInvitacion = (token: string) =>
  pedir<Invitacion>(`/api/review-invite/${encodeURIComponent(token)}`);

export const enviarResena = (
  token: string,
  datos: {
    texto_es: string;
    puntuacion?: number | null;
    cliente_nombre?: string;
    cliente_cargo?: string;
    cliente_empresa?: string;
  }
) =>
  pedir<{ ok: boolean; mensaje: string }>(`/api/review-invite/${encodeURIComponent(token)}`, {
    method: 'POST',
    body: JSON.stringify(datos),
  });

/* ── Ayudas de presentación ── */

/** Devuelve el texto en el idioma activo, cayendo al español si no hay traducción. */
export const enIdioma = (es: string | null, en: string | null, idioma: string): string =>
  (idioma === 'en' ? en || es : es) || '';

/**
 * Código corto de idioma para las fichas. Cortar por las dos primeras letras
 * daba resultados falsos ("Portugués" salía como PO, "Inglés" como IN).
 */
const CODIGOS: Record<string, string> = {
  espanol: 'ES', español: 'ES', spanish: 'ES',
  ingles: 'EN', inglés: 'EN', english: 'EN',
  portugues: 'PT', portugués: 'PT', portuguese: 'PT',
  frances: 'FR', francés: 'FR', french: 'FR',
  aleman: 'DE', alemán: 'DE', german: 'DE',
  italiano: 'IT', italian: 'IT',
  catalan: 'CA', catalán: 'CA', catalanlang: 'CA',
  gallego: 'GL', galician: 'GL',
  euskera: 'EU', basque: 'EU',
  neerlandes: 'NL', neerlandés: 'NL', dutch: 'NL',
};

export const codigoIdioma = (idioma: string): string => {
  const limpio = idioma.trim().toLowerCase();
  return CODIGOS[limpio] ?? idioma.trim().slice(0, 2).toUpperCase();
};

export const iniciales = (nombre: string): string =>
  String(nombre || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || '')
    .join('')
    .toUpperCase();
