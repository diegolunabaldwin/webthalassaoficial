import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LegalNoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LegalNoticeModal = ({ open, onOpenChange }: LegalNoticeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-primary border-secondary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-secondary">
            Aviso Legal – Thalassa Hub S.L
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-primary-foreground/90 font-body">
          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Titular de la web</h3>
            <ul className="space-y-1">
              <li><strong>Empresa:</strong> Thalassa Hub S.L</li>
              <li><strong>CIF/NIF:</strong> B25952938</li>
              <li><strong>Dirección:</strong> Avila 162, Escalera 3, Bajos B-08018 Barcelona, España</li>
              <li><strong>Email de contacto:</strong> hola@thalassahub.com</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Objeto del sitio web</h3>
            <p>
              El presente sitio web tiene como finalidad informar sobre los servicios de Thalassa Hub S.L, 
              especializada en consultoría para empresas de la Industria Alimentaria, y facilitar el contacto 
              y reserva de reuniones profesionales.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Propiedad intelectual</h3>
            <p>
              Todos los contenidos de esta web (textos, imágenes, logotipos, diseños, códigos) son propiedad 
              de Thalassa Hub S.L o de terceros que han autorizado su uso. Queda prohibida su reproducción, 
              distribución o transformación sin autorización expresa.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Responsabilidad</h3>
            <p>
              Thalassa Hub S.L no se responsabiliza de errores, mal uso de la información o contenido de 
              terceros accesible desde enlaces externos.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalNoticeModal;
