import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const API_URL = process.env.VITE_API_URL || "https://thalassa-api.diegoluba17.workers.dev";

type Fila = Record<string, unknown>;

/** Escapar "<" impide que un dato cierre la etiqueta <script> antes de tiempo. */
const seguroEnScript = (json: string) => json.replace(/</g, "\\u003c");

const escHtml = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

/* Texto plano para los rastreadores que no ejecutan JavaScript. */
const ficha = (p: Fila) =>
  `<article><h3>${escHtml(p.nombre)}</h3><p>${escHtml(p.rol_es)}</p>` +
  `<p>${escHtml(p.bio_es)}</p>` +
  `<p>${escHtml(((p.expertise as string[]) || []).join(", "))}</p></article>`;

const cita = (r: Fila) =>
  `<blockquote><p>${escHtml(r.texto_es)}</p><footer>${escHtml(
    [r.cliente_nombre, r.cliente_cargo, r.cliente_empresa].filter(Boolean).join(", ")
  )}</footer></blockquote>`;

/**
 * Hornea en el HTML los profesionales y las reseñas aprobadas.
 *
 * La web es una SPA sin renderizado en servidor. Si estos datos llegaran solo
 * por fetch, Google los indexaría mal y los rastreadores de IA (GPTBot,
 * ClaudeBot, PerplexityBot), que no ejecutan JavaScript, no los verían nunca.
 * Horneándolos quedan en el HTML de origen.
 *
 * Si la API no responde durante el build se continúa sin datos: preferimos un
 * despliegue con la sección vacía a un despliegue roto.
 */
function contenidoThalassa(): Plugin {
  let profesionales: Fila[] = [];
  let resenas: Fila[] = [];
  let media: number | null = null;
  let outDir = "dist";

  return {
    name: "thalassa-contenido",
    apply: "build",

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },

    async buildStart() {
      const traer = async (ruta: string) => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 10_000);
        try {
          const r = await fetch(`${API_URL}${ruta}`, { signal: ctrl.signal });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return (await r.json()) as Record<string, never>;
        } finally {
          clearTimeout(t);
        }
      };

      try {
        const [p, r] = await Promise.all([traer("/api/professionals"), traer("/api/reviews")]);
        profesionales = (p.profesionales ?? []) as Fila[];
        resenas = (r.resenas ?? []) as Fila[];
        media = (r.media ?? null) as number | null;
        console.log(
          `[thalassa] horneados ${profesionales.length} profesionales y ${resenas.length} reseñas`
        );
      } catch (e) {
        console.warn(
          `[thalassa] no se pudo leer la API (${(e as Error).message}). ` +
            "El build sigue; el contenido se cargará en el navegador."
        );
      }
    },

    transformIndexHtml(html) {
      const datos = seguroEnScript(
        JSON.stringify({
          profesionales,
          resenas,
          total: resenas.length,
          media,
          generado: new Date().toISOString(),
        })
      );

      // Datos estructurados solo de las personas del Hub.
      // Las reseñas NO se marcan como AggregateRating: Google no muestra
      // estrellas de reseñas alojadas en la web de la propia empresa, y
      // declararlas así es justo el patrón que considera abuso.
      const personas = profesionales.map((p) => ({
        "@context": "https://schema.org",
        "@type": "Person",
        name: p.nombre,
        jobTitle: p.rol_es,
        description: p.bio_es || undefined,
        knowsAbout: (p.expertise as string[])?.length ? p.expertise : undefined,
        knowsLanguage: (p.idiomas as string[])?.length ? p.idiomas : undefined,
        worksFor: { "@type": "Organization", name: "Thalassa Hub S.L" },
        sameAs: p.linkedin ? [p.linkedin] : undefined,
      }));

      const tags = [
        {
          tag: "script",
          attrs: { id: "thalassa-datos" },
          children: `window.__THALASSA__=${datos};`,
          injectTo: "head" as const,
        },
        ...personas.map((p) => ({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: seguroEnScript(JSON.stringify(p)),
          injectTo: "head" as const,
        })),
      ];

      const bloques = [
        profesionales.length
          ? `<section><h2>Hub de Profesionales de Thalassa Hub</h2>${profesionales.map(ficha).join("")}</section>`
          : "",
        resenas.length
          ? `<section><h2>Opiniones de clientes de Thalassa Hub</h2>${resenas.map(cita).join("")}</section>`
          : "",
      ].join("");

      return {
        html: bloques ? html.replace("</body>", `<noscript>${bloques}</noscript></body>`) : html,
        tags,
      };
    },

    /**
     * Emite profesionales.html a partir de index.html, con su propio título,
     * descripción y canonical.
     *
     * Hace falta porque esto es una SPA: sin un HTML propio, /profesionales
     * serviría la cabecera de la portada y Google indexaría las dos URL con el
     * mismo título, que es justo lo que hace que una de las dos no posicione.
     */
    closeBundle() {
      const indice = path.join(outDir, "index.html");
      if (!fs.existsSync(indice)) {
        console.warn("[thalassa] no encuentro index.html, no genero profesionales.html");
        return;
      }

      const TITULO =
        "Hub de Profesionales | Auditores de seguridad alimentaria · Thalassa Hub";
      const DESC =
        "Conoce a los auditores y consultores senior de Thalassa Hub: BRCGS, IFS Food, " +
        "FSSC 22000, sostenibilidad y formación para la industria alimentaria.";
      const URL = "https://www.thalassahub.com/profesionales";

      let html = fs
        .readFileSync(indice, "utf-8")
        .replace(/<title>[^<]*<\/title>/, `<title>${escHtml(TITULO)}</title>`)
        .replace(
          /(<meta name="description" content=")[^"]*(")/,
          `$1${escHtml(DESC)}$2`
        )
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${URL}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${URL}$2`)
        .replace(
          /(<meta property="og:title" content=")[^"]*(")/,
          `$1${escHtml(TITULO)}$2`
        )
        .replace(
          /(<meta property="og:description" content=")[^"]*(")/,
          `$1${escHtml(DESC)}$2`
        );

      // En esta página el texto sin JavaScript es solo el equipo.
      if (profesionales.length) {
        html = html.replace(
          /<noscript>[\s\S]*?<\/noscript>/,
          `<noscript><section><h1>Hub de Profesionales de Thalassa Hub</h1>${profesionales
            .map(ficha)
            .join("")}</section></noscript>`
        );
      }

      fs.writeFileSync(path.join(outDir, "profesionales.html"), html, "utf-8");
      console.log("[thalassa] generado profesionales.html con cabecera propia");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    contenidoThalassa(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
