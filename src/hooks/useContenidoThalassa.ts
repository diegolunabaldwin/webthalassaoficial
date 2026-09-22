import { useEffect, useState } from 'react';
import {
  datosHorneados,
  getProfesionales,
  getResenas,
  type Profesional,
  type Resena,
} from '@/lib/thalassaApi';

/**
 * Arranca con los datos horneados en el build (ya vienen en el HTML, así que
 * la sección pinta sin salto) y revalida contra la API para reflejar al momento
 * lo que Susana cambie en el panel.
 *
 * Si la API falla, se conserva lo horneado: la web nunca se queda en blanco
 * por una caída del Worker.
 */
function useRevalidado<T>(inicial: T, cargar: () => Promise<T>) {
  const [datos, setDatos] = useState<T>(inicial);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    cargar()
      .then((d) => {
        if (vigente) setDatos(d);
      })
      .catch(() => {
        /* nos quedamos con lo horneado */
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { datos, cargando };
}

export function useProfesionales() {
  const horneado = datosHorneados().profesionales ?? [];
  const { datos, cargando } = useRevalidado<Profesional[]>(horneado, getProfesionales);
  return { profesionales: datos, cargando: cargando && horneado.length === 0 };
}

export function useResenas() {
  const h = datosHorneados();
  const inicial = {
    resenas: h.resenas ?? [],
    total: h.total ?? h.resenas?.length ?? 0,
    media: h.media ?? null,
  };
  const { datos, cargando } = useRevalidado(inicial, getResenas);
  return { ...datos, cargando: cargando && inicial.resenas.length === 0 };
}
