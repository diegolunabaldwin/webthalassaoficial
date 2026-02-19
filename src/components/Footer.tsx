import { useState } from 'react';
import logoFooter from '@/assets/logo-footer.png';
import LegalNoticeModal from './LegalNoticeModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { useTranslation } from '@/contexts/LanguageContext';

const Footer = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const t = useTranslation();

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
              <strong className="text-footer-foreground/90">{t('footer.object.title')}</strong> {t('footer.object.text')}
            </p>
            <p>
              <strong className="text-footer-foreground/90">{t('footer.intellectual.title')}</strong> {t('footer.intellectual.text')}
            </p>
            <p>
              <strong className="text-footer-foreground/90">{t('footer.responsibility.title')}</strong> {t('footer.responsibility.text')}
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
                  {t('footer.legal.legalNotice')}
                </button>
                <span className="text-footer-foreground/30">|</span>
                <button 
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-secondary transition-colors"
                >
                  {t('footer.legal.privacyPolicy')}
                </button>
              </div>

              {/* Copyright */}
              <p className="text-sm font-body">
                {t('footer.copyright')}
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
