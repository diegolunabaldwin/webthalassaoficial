import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-header.png';
import type { TranslationKey } from '@/locales';

type Enlace = { key: TranslationKey; destino: string; ruta?: boolean };

// "Recomiéndanos" no está aquí: pide una acción, así que va como botón
// destacado. Y "Reseñas" vive junto a Contacto, enlazada desde el pie.
const ENLACES: Enlace[] = [
  { key: 'navbar.home', destino: '#inicio' },
  { key: 'navbar.about', destino: '#nosotros' },
  { key: 'navbar.services', destino: '#servicios' },
  { key: 'navbar.professionals', destino: '/profesionales', ruta: true },
  { key: 'navbar.events', destino: '#eventos' },
  { key: 'navbar.contact', destino: '#contacto' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Fuera de la portada un ancla suelta no lleva a ninguna parte: hay que
  // anteponer la barra para volver a la home y luego bajar a la sección.
  const enHome = useLocation().pathname === '/';
  const ancla = (a: string) => (enHome ? a : `/${a}`);

  const claseEnlace = 'text-primary-foreground font-medium hover:text-secondary transition-colors duration-300';

  const pintar = (e: Enlace, movil = false) => {
    const clase = movil ? `${claseEnlace} py-2` : claseEnlace;
    const cerrar = movil ? () => setIsOpen(false) : undefined;
    return e.ruta ? (
      <Link key={e.key} to={e.destino} onClick={cerrar} className={clase}>
        {t(e.key)}
      </Link>
    ) : (
      <a key={e.key} href={ancla(e.destino)} onClick={cerrar} className={clase}>
        {t(e.key)}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <img src={logo} alt="Thalassa Hub" width={160} height={27} className="h-10 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7">
            {ENLACES.map((e) => pintar(e))}

            <ToggleGroup
              type="single"
              value={language}
              onValueChange={(value) => {
                if (value) setLanguage(value as 'es' | 'en');
              }}
            >
              <ToggleGroupItem
                value="es"
                className="px-3 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                aria-label="Español"
              >
                ES
              </ToggleGroupItem>
              <ToggleGroupItem
                value="en"
                className="px-3 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                aria-label="English"
              >
                EN
              </ToggleGroupItem>
            </ToggleGroup>

            <a
              href={ancla('#recomienda')}
              className="bg-champagne text-champagne-foreground font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-champagne/90 transition-colors whitespace-nowrap"
            >
              {t('navbar.recommend')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary-foreground p-2"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {ENLACES.map((e) => pintar(e, true))}

              <a
                href={ancla('#recomienda')}
                onClick={() => setIsOpen(false)}
                className="bg-champagne text-champagne-foreground font-bold text-center px-5 py-3 rounded-lg mt-2"
              >
                {t('navbar.recommend')}
              </a>

              <div className="flex gap-2 mt-4">
                <Button
                  variant={language === 'es' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setLanguage('es');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  ES
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setLanguage('en');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  EN
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
