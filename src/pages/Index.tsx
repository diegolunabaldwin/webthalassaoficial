import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import EventsSection from '@/components/EventsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroCarousel />
        <AboutSection />
        <ServicesSection />
        <EventsSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
