import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProfessionalsSection from '@/components/ProfessionalsSection';
import EventsSection from '@/components/EventsSection';
import ReferralSection from '@/components/ReferralSection';
import ReviewsSection from '@/components/ReviewsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';

/**
 * Orden pensado para la conversión: quien baja conoce al equipo, ve los
 * eventos, puede recomendarnos, lee la prueba social y llega a Contacto
 * justo después. Las Reseñas van pegadas a Contacto a propósito.
 */
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroCarousel />
        <AboutSection />
        <ServicesSection />
        <ProfessionalsSection />
        <EventsSection />
        <ReferralSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
