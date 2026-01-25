import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-primary/95 backdrop-blur-sm border-t border-secondary/20 animate-fade-in">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-primary-foreground/90 font-body text-sm md:text-base">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y analizar el uso del sitio.
                Puedes aceptar todas las cookies o configurar tus preferencias. Consulta nuestra{' '}
                <button 
                  onClick={() => setPrivacyModalOpen(true)}
                  className="underline hover:text-secondary transition-colors"
                >
                  Política de Privacidad
                </button>.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleReject}
                className="px-6 py-3 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors font-body"
              >
                Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="btn-champagne px-6 py-3"
              >
                Aceptar Cookies
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrivacyPolicyModal open={privacyModalOpen} onOpenChange={setPrivacyModalOpen} />
    </>
  );
};

export default CookieBanner;
