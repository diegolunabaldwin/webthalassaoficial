import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const API_URL = process.env.VITE_API_URL || "https://thalassa-api.diegoluba17.workers.dev";
const SITIO = "https://www.thalassahub.com";
const ORG = `${SITIO}/#organization`;

type Fila = Record<string, unknown>;

/** Escapar "<" impide que un dato cierre la etiqueta <script> antes de tiempo. */
const seguroEnScript = (json: string) => json.replace(/</g, "\\u003c");

const escHtml = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

const arr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

/* Texto plano para los rastreadores que no ejecutan JavaScript. */
const ficha = (p: Fila) =>
  `<article><h3>${escHtml(p.nombre)}</h3><p>${escHtml(p.rol_es)}</p>` +
  `<p>${escHtml(p.bio_es)}</p>` +
  `<p>${escHtml(arr(p.expertise).join(", "))}</p></article>`;

const cita = (r: Fila) =>
  `<blockquote><p>${escHtml(r.texto_es)}</p><footer>${escHtml(
    [r.cliente_nombre, r.cliente_cargo, r.cliente_empresa].filter(Boolean).join(", ")
  )}</footer></blockquote>`;

/**
 * Nodo Person de un profesional.
 *
 * Va deliberadamente cargado de atributos: los estudios de 2026 coinciden en
 * que un schema genérico y escueto rinde PEOR que no poner ninguno, porque
 * añade ambigüedad en vez de quitarla. Y `worksFor` apunta al @id de la
 * organización para que todo cuelgue de un mismo grafo en vez de quedar suelto.
 */
const nodoPersona = (p: Fila) => {
  const saber = [...arr(p.expertise), ...arr(p.sectores), ...arr(p.acreditaciones)];
  return {
    "@type": "Person",
    "@id": `${SITIO}/profesionales/${p.slug}#person`,
    name: p.nombre,
    url: `${SITIO}/profesionales/${p.slug}`,
    jobTitle: p.rol_es,
    description: p.bio_es || undefined,
    image: p.foto_url || undefined,
    knowsAbout: saber.length ? saber : undefined,
    knowsLanguage: arr(p.idiomas).length ? p.idiomas : undefined,
    hasCredential: arr(p.acreditaciones).length
      ? arr(p.acreditaciones).map((a) => ({
          "@type": "EducationalOccupationalCredential",
          name: a,
        }))
      : undefined,
    workLocation: p.ciudad
      ? { "@type": "Place", address: [p.ciudad, p.pais].filter(Boolean).join(", ") }
      : undefined,
    worksFor: { "@id": ORG },
    memberOf: { "@id": ORG },
  };
};

const migas = (partes: { nombre: string; url: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: partes.map((x, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: x.nombre,
    item: x.url,
  })),
});

/**
 * Genera el HTML de cada página con su propia cabecera y su propio grafo.
 *
 * La web es una SPA sin renderizado en servidor: sin esto todas las rutas
 * compartirían título y datos estructurados, y ni Google ni los rastreadores
 * de IA (que no ejecutan JavaScript) verían el contenido.
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

    /* ── Portada ── */
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

      const tags: {
        tag: string;
        attrs?: Record<string, string>;
        children?: string;
        injectTo: "head";
      }[] = [
        {
          tag: "script",
          attrs: { id: "thalassa-datos" },
          children: `window.__THALASSA__=${datos};`,
          injectTo: "head",
        },
      ];

      // En la portada las personas se añaden al grafo referenciando la
      // organización, sin volver a definirla: redefinirla en cada página
      // fragmenta la autoridad de la entidad.
      if (profesionales.length) {
        tags.push({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: seguroEnScript(
            JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                ...profesionales.map(nodoPersona),
                { "@id": ORG, employee: profesionales.map((p) => ({ "@id": `${SITIO}/profesionales/${p.slug}#person` })) },
              ],
            })
          ),
          injectTo: "head",
        });
      }

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

    /* ── Páginas derivadas ── */
    closeBundle() {
      const indice = path.join(outDir, "index.html");
      if (!fs.existsSync(indice)) {
        console.warn("[thalassa] no encuentro index.html, no genero las páginas derivadas");
        return;
      }
      const base = fs.readFileSync(indice, "utf-8");

      /** Deriva una página: cabecera propia, grafo propio y texto sin JS propio. */
      const derivar = (opciones: {
        archivo: string;
        titulo: string;
        descripcion: string;
        url: string;
        grafo: unknown[];
        sinJs: string;
        indexable: boolean;
      }) => {
        let html = base
          // Fuera los datos estructurados de la portada: cada página lleva los suyos.
          .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "")
          .replace(/<title>[^<]*<\/title>/, `<title>${escHtml(opciones.titulo)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escHtml(opciones.descripcion)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${opciones.url}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${opciones.url}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escHtml(opciones.titulo)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escHtml(opciones.descripcion)}$2`)
          .replace(
            /(<meta name="robots" content=")[^"]*(")/,
            `$1${opciones.indexable ? "index, follow" : "noindex, follow"}$2`
          );

        const grafo = seguroEnScript(
          JSON.stringify({ "@context": "https://schema.org", "@graph": opciones.grafo })
        );
        html = html.replace(
          "</head>",
          `  <script type="application/ld+json">${grafo}</script>\n  </head>`
        );
        html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>${opciones.sinJs}</noscript>`);
        if (!html.includes("<noscript>")) {
          html = html.replace("</body>", `<noscript>${opciones.sinJs}</noscript></body>`);
        }

        const destino = path.join(outDir, opciones.archivo);
        fs.mkdirSync(path.dirname(destino), { recursive: true });
        fs.writeFileSync(destino, html, "utf-8");
      };

      /* Listado del Hub */
      derivar({
        archivo: "profesionales.html",
        titulo: "Hub de Profesionales | Auditores de seguridad alimentaria · Thalassa Hub",
        descripcion:
          "Conoce a los auditores y consultores senior de Thalassa Hub: BRCGS, IFS Food, " +
          "FSSC 22000, sostenibilidad y formación para la industria alimentaria.",
        url: `${SITIO}/profesionales`,
        indexable: profesionales.length > 0,
        grafo: [
          {
            "@type": "CollectionPage",
            "@id": `${SITIO}/profesionales#page`,
            url: `${SITIO}/profesionales`,
            name: "Hub de Profesionales de Thalassa Hub",
            isPartOf: { "@id": `${SITIO}/#website` },
            about: { "@id": ORG },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: profesionales.length,
              itemListElement: profesionales.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITIO}/profesionales/${p.slug}`,
                name: p.nombre,
              })),
            },
          },
          migas([
            { nombre: "Thalassa Hub", url: SITIO },
            { nombre: "Hub de Profesionales", url: `${SITIO}/profesionales` },
          ]),
          ...profesionales.map(nodoPersona),
        ],
        sinJs: profesionales.length
          ? `<section><h1>Hub de Profesionales de Thalassa Hub</h1>${profesionales.map(ficha).join("")}</section>`
          : "<section><h1>Hub de Profesionales de Thalassa Hub</h1></section>",
      });

      /* Una página por profesional */
      for (const p of profesionales) {
        const saber = [...arr(p.expertise), ...arr(p.acreditaciones)];
        derivar({
          archivo: path.join("profesionales", `${p.slug}.html`),
          titulo: `${p.nombre}, ${p.rol_es} | Thalassa Hub`,
          descripcion:
            (String(p.bio_es || "").slice(0, 150) ||
              `${p.nombre}, ${p.rol_es} en Thalassa Hub`) +
            (saber.length ? ` Especialista en ${saber.slice(0, 3).join(", ")}.` : ""),
          url: `${SITIO}/profesionales/${p.slug}`,
          indexable: true,
          grafo: [
            {
              "@type": "ProfilePage",
              "@id": `${SITIO}/profesionales/${p.slug}#page`,
              url: `${SITIO}/profesionales/${p.slug}`,
              isPartOf: { "@id": `${SITIO}/#website` },
              mainEntity: { "@id": `${SITIO}/profesionales/${p.slug}#person` },
            },
            migas([
              { nombre: "Thalassa Hub", url: SITIO },
              { nombre: "Hub de Profesionales", url: `${SITIO}/profesionales` },
              { nombre: String(p.nombre), url: `${SITIO}/profesionales/${p.slug}` },
            ]),
            nodoPersona(p),
          ],
          sinJs:
            `<article><h1>${escHtml(p.nombre)}</h1><p>${escHtml(p.rol_es)}</p>` +
            `<p>${escHtml(p.bio_es)}</p>` +
            (arr(p.expertise).length
              ? `<h2>Áreas de expertise</h2><ul>${arr(p.expertise).map((e) => `<li>${escHtml(e)}</li>`).join("")}</ul>`
              : "") +
            (arr(p.acreditaciones).length
              ? `<h2>Acreditaciones</h2><ul>${arr(p.acreditaciones).map((a) => `<li>${escHtml(a)}</li>`).join("")}</ul>`
              : "") +
            `</article>`,
        });
      }

      /* Sitemap con todo lo indexable */
      const hoy = new Date().toISOString().slice(0, 10);
      const url = (loc: string, prio: string, freq = "weekly") =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${hoy}</lastmod>\n` +
        `    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
      const urls = [url(`${SITIO}/`, "1.0")];
      if (profesionales.length) {
        urls.push(url(`${SITIO}/profesionales`, "0.9"));
        profesionales.forEach((p) => urls.push(url(`${SITIO}/profesionales/${p.slug}`, "0.8", "monthly")));
      }
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
        "utf-8"
      );

      console.log(
        `[thalassa] generadas ${profesionales.length + 1} páginas derivadas y sitemap con ${urls.length} URL`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    contenidoThalassa(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
