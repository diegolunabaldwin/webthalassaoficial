import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Arregla dos cosas que el navegador no resuelve solo en una SPA:
 *
 * 1. Al cambiar de ruta no reinicia el scroll. Viniendo de la portada con la
 *    página bajada, /profesionales se abría por la mitad.
 *
 * 2. Al entrar con ancla (/#recomienda desde /profesionales) el navegador
 *    busca el elemento al cargar el HTML, cuando React todavía no ha pintado
 *    nada. No lo encuentra y se queda arriba. Por eso reintentamos un rato:
 *    las secciones con datos de la API aparecen unos instantes después.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let intentos = 0;
    let temporizador: number;

    const buscar = () => {
      const destino = document.getElementById(id);
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // ~2 s de margen: suficiente para que lleguen los datos del Worker.
      if (++intentos < 20) temporizador = window.setTimeout(buscar, 100);
    };

    buscar();
    return () => clearTimeout(temporizador);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
