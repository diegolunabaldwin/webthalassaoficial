// Type definitions for translation keys
export type TranslationKey =
  // Navbar
  | 'navbar.home'
  | 'navbar.about'
  | 'navbar.services'
  | 'navbar.events'
  | 'navbar.contact'

  // Hero Carousel
  | 'hero.title'
  | 'hero.subtitle'
  | 'hero.cta'

  // About Section
  | 'about.title'
  | 'about.subtitle'
  | 'about.paragraph1'
  | 'about.paragraph2'
  | 'about.paragraph3'
  | 'about.paragraph4'
  | 'about.paragraph2_bold1'
  | 'about.paragraph2_bold2'
  | 'about.paragraph2_bold3'
  | 'about.paragraph2_bold4'
  | 'about.paragraph3_bold1'
  | 'about.paragraph3_bold2'
  | 'about.paragraph3_bold3'
  | 'about.paragraph3_bold4'
  | 'about.paragraph3_bold5'
  | 'about.paragraph4_bold1'
  | 'about.quote'

  // Services Section
  | 'services.title'
  | 'services.subtitle'
  | 'services.description'
  | 'services.strategy.title'
  | 'services.strategy.description'
  | 'services.strategy.items.1'
  | 'services.strategy.items.2'
  | 'services.strategy.items.3'
  | 'services.strategy.items.4'
  | 'services.strategy.items.5'
  | 'services.markets.title'
  | 'services.markets.description'
  | 'services.markets.items.1'
  | 'services.markets.items.2'
  | 'services.markets.items.3'
  | 'services.markets.items.4'
  | 'services.markets.items.5'
  | 'services.learning.title'
  | 'services.learning.description'
  | 'services.learning.items.1'
  | 'services.learning.items.2'
  | 'services.learning.items.3'
  | 'services.learning.items.4'
  | 'services.learning.items.5'

  // Events Section
  | 'events.title'
  | 'events.subtitle'
  | 'events.alimentaria.badge'
  | 'events.alimentaria.title'
  | 'events.alimentaria.date'
  | 'events.alimentaria.location'
  | 'events.alimentaria.description'
  | 'events.alimentaria.whatsapp'
  | 'events.formacion.badge'
  | 'events.formacion.title'
  | 'events.formacion.date'
  | 'events.formacion.location'
  | 'events.formacion.description'
  | 'events.webinar.badge'
  | 'events.webinar.title'
  | 'events.webinar.date'
  | 'events.webinar.location'
  | 'events.webinar.description'
  | 'events.webinar.cta'

  // Contact Section
  | 'contact.headline1'
  | 'contact.headline2'
  | 'contact.linkedin'
  | 'contact.phone'
  | 'contact.email'
  | 'contact.booking.title'
  | 'contact.booking.description'
  | 'contact.checkbox.text'
  | 'contact.checkbox.privacy'
  | 'contact.button'

  // Footer
  | 'footer.object.title'
  | 'footer.object.text'
  | 'footer.intellectual.title'
  | 'footer.intellectual.text'
  | 'footer.responsibility.title'
  | 'footer.responsibility.text'
  | 'footer.legal.legalNotice'
  | 'footer.legal.privacyPolicy'
  | 'footer.copyright';

// Translation resources
import esTranslations from './es.json';
import enTranslations from './en.json';

export const translations = {
  es: esTranslations,
  en: enTranslations,
} as const;

// Helper function to get nested translation
export function getTranslation(lang: 'es' | 'en', key: TranslationKey): string {
  const keys = key.split('.');
  let current: any = translations[lang];

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to Spanish
      let fallback: any = translations.es;
      for (const k2 of keys) {
        if (fallback && typeof fallback === 'object' && k2 in fallback) {
          fallback = fallback[k2];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }

  return typeof current === 'string' ? current : key;
}