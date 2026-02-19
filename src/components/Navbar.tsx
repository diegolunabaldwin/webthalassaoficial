import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo-header.png';

// Navigation links will be translated using the language context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Navigation links with translation keys
  const navLinks = [
    { key: 'navbar.home' as const, href: '#inicio' },
    { key: 'navbar.about' as const, href: '#nosotros' },
    { key: 'navbar.services' as const, href: '#servicios' },
    { key: 'navbar.events' as const, href: '#eventos' },
    { key: 'navbar.contact' as const, href: '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <img src={logo} alt="Thalassa Hub" className="h-10 w-auto" />
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-primary-foreground font-medium hover:text-secondary transition-colors duration-300"
              >
                {t(link.key)}
              </a>
            ))}

            {/* Language Toggle - Desktop */}
            <ToggleGroup
              type="single"
              value={language}
              onValueChange={(value) => {
                if (value) setLanguage(value as 'es' | 'en');
              }}
              className="ml-4"
            >
              <ToggleGroupItem
                value="es"
                className="px-3 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-md data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                aria-label="Spanish"
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary-foreground p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground font-medium py-2 hover:text-secondary transition-colors duration-300"
                >
                  {t(link.key)}
                </a>
              ))}

              {/* Language Toggle - Mobile */}
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