import { useState } from 'react';
import { Calendar, Linkedin, Phone, Mail } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const ContactSection = () => {
  const [accepted, setAccepted] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleBooking = () => {
    if (accepted) {
      window.open('https://calendly.com/susana-serna-thalassahub/30min', '_blank');
    }
  };

  return (
    <>
      <section id="contacto" className="relative bg-primary py-20 md:py-28">
        {/* Wave Divider Top */}
        <div className="absolute top-0 left-0 right-0 -translate-y-[99%]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(227, 43%, 42%)"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4">
          <div 
            ref={sectionRef}
            className={`max-w-5xl mx-auto transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Glass Card */}
            <div className="glass-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Left Column - Contact Info */}
                <div className="text-left">
                  <p className="text-primary-foreground text-xl md:text-2xl font-heading font-semibold mb-4 leading-relaxed">
                    Antes de dar el salto, conviene tener claro el rumbo.
                  </p>
                  <p className="text-primary-foreground/80 text-lg mb-8 font-body leading-relaxed">
                    Agenda una reunión inicial sin compromiso y hablemos de cómo crecer con sentido.
                  </p>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <a 
                      href="https://www.linkedin.com/company/thalassahub/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-primary-foreground/90 hover:text-secondary transition-colors group"
                    >
                      <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                        <Linkedin className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-body">LinkedIn de Thalassa Hub</span>
                    </a>

                    <a 
                      href="https://wa.me/+34693055276"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-primary-foreground/90 hover:text-secondary transition-colors group"
                    >
                      <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-body">+34 693 055 276</span>
                    </a>

                    <a 
                      href="mailto:hola@thalassahub.com"
                      className="flex items-center gap-3 text-primary-foreground/90 hover:text-secondary transition-colors group"
                    >
                      <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                        <Mail className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-body">hola@thalassahub.com</span>
                    </a>
                  </div>
                </div>

                {/* Right Column - Booking */}
                <div className="text-center">
                  {/* Calendar Icon */}
                  <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Calendar className="w-10 h-10 text-secondary" />
                  </div>

                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                    Agenda tu reunión inicial
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-8 font-body">
                    Reserva directamente en nuestro calendario el horario que mejor te convenga.
                  </p>

                  {/* Checkbox */}
                  <label className="flex items-center justify-center gap-3 mb-8 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        accepted 
                          ? 'bg-secondary border-secondary' 
                          : 'border-primary-foreground/50 group-hover:border-primary-foreground'
                      }`}>
                        {accepted && (
                          <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-primary-foreground/90 font-body">
                      He leído y acepto la{' '}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPrivacyModalOpen(true);
                        }}
                        className="underline hover:text-secondary transition-colors"
                      >
                        Política de privacidad
                      </button>
                    </span>
                  </label>

                  {/* CTA Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!accepted}
                    className={`btn-champagne w-full text-xl uppercase tracking-wide ${
                      !accepted && 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Agendar Reunión Inicial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PrivacyPolicyModal open={privacyModalOpen} onOpenChange={setPrivacyModalOpen} />
    </>
  );
};

export default ContactSection;
