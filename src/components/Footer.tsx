import { useState } from 'react';
import logoFooter from '@/assets/logo-footer.png';
import LegalNoticeModal from './LegalNoticeModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const Footer = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer id="legal" className="bg-footer text-footer-foreground py-16">
        <div className="container mx-auto px-4">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img src={logoFooter} alt="Thalassa Hub" className="h-12 w-auto brightness-200" />
          </div>

          {/* Legal Text */}
          <div className="max-w-4xl mx-auto space-y-6 text-sm leading-relaxed mb-10 font-body">
            <p>
              <strong className="text-footer-foreground/90">Objeto del sitio web:</strong> El presente sitio web tiene como finalidad informar sobre los servicios de Thalassa Hub S.L, especializada en consultoría para empresas de la Industria Alimentaria, y facilitar el contacto y reserva de reuniones profesionales.
            </p>
            <p>
              <strong className="text-footer-foreground/90">Propiedad intelectual:</strong> Todos los contenidos de esta web (textos, imágenes, logotipos, diseños, códigos) son propiedad de Thalassa Hub S.L o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
            </p>
            <p>
              <strong className="text-footer-foreground/90">Responsabilidad:</strong> Thalassa Hub S.L no se responsabiliza de errores, mal uso de la información o contenido de terceros accesible desde enlaces externos.
            </p>
          </div>

          {/* Separator */}
          <div className="border-t border-footer-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Legal Links */}
              <div className="flex items-center gap-6 text-sm font-body">
                <button 
                  onClick={() => setLegalModalOpen(true)}
                  className="hover:text-secondary transition-colors"
                >
                  Aviso legal
                </button>
                <span className="text-footer-foreground/30">|</span>
                <button 
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-secondary transition-colors"
                >
                  Política de privacidad
                </button>
              </div>

              {/* Copyright */}
              <p className="text-sm font-body">
                © 2026 Thalassa Hub. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <LegalNoticeModal open={legalModalOpen} onOpenChange={setLegalModalOpen} />
      <PrivacyPolicyModal open={privacyModalOpen} onOpenChange={setPrivacyModalOpen} />
    </>
  );
};

export default Footer;
