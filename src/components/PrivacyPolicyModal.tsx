import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PrivacyPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyModal = ({ open, onOpenChange }: PrivacyPolicyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-primary border-secondary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-secondary">
            Política de Privacidad de Thalassa Hub S.L
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-primary-foreground/90 font-body">
          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Responsable del tratamiento</h3>
            <ul className="space-y-1">
              <li><strong>Empresa:</strong> Thalassa Hub S.L</li>
              <li><strong>CIF/NIF:</strong> B 25952938</li>
              <li><strong>Dirección:</strong> Avila 162, Escalera 3, Bajos B-08018 Barcelona, España</li>
              <li><strong>Correo electrónico:</strong> hola@thalassahub.com</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Finalidad del tratamiento de datos</h3>
            <p className="mb-2">
              Los datos personales que nos proporciones a través de nuestros formularios de contacto, 
              reservas de citas o cualquier interacción en nuestra web se tratarán con la finalidad de:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gestionar solicitudes de información o servicios.</li>
              <li>Coordinar y agendar citas y reuniones (por ejemplo, a través de Calendly).</li>
              <li>Enviar comunicaciones relacionadas con nuestros servicios, cuando hayas dado tu consentimiento expreso.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Legitimación</h3>
            <p className="mb-2">El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Tu consentimiento explícito al enviar un formulario o reservar una cita.</li>
              <li>El cumplimiento de una relación contractual cuando corresponda (por ejemplo, prestación de servicios).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Destinatarios de los datos</h3>
            <p className="mb-2">Tus datos no se cederán a terceros, excepto:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Proveedores que gestionan los servicios de reserva de citas, como Calendly LLC (EE. UU.), bajo Cláusulas Contractuales Tipo de la UE.</li>
              <li>Proveedores de hosting o analítica, únicamente para la correcta prestación del servicio.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Transferencias internacionales de datos</h3>
            <p>
              Calendly y algunos proveedores externos pueden procesar datos fuera de la UE. 
              Todas las transferencias se realizan con las garantías legales adecuadas, como las 
              Cláusulas Contractuales Tipo aprobadas por la UE.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Derechos de los interesados</h3>
            <p className="mb-2">Puedes ejercer tus derechos en cualquier momento:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Acceso, rectificación, supresión, limitación, portabilidad y oposición al tratamiento de tus datos.</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos, contacta a: hola@thalassahub.com</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Conservación de los datos</h3>
            <p>
              Los datos se conservarán mientras dure la relación con Thalassa Hub y mientras exista una 
              obligación legal de conservación. Una vez cumplidos los plazos legales, los datos se 
              eliminarán de forma segura.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Cookies y otras tecnologías</h3>
            <p>
              Nuestra web y herramientas integradas (Calendly, Google Analytics, Meta Pixel) utilizan 
              cookies para analítica y funcionalidad. Puedes aceptar o rechazar cookies mediante nuestro 
              banner de cookies. Para más información, consulta nuestra Política de cookies.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Cambios en la Política de Privacidad</h3>
            <p>
              Thalassa Hub se reserva el derecho de modificar esta política para adaptarla a novedades 
              legales o cambios en sus servicios. La versión actual siempre estará disponible en esta página.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-secondary mb-2">Contacto</h3>
            <p>Para cualquier consulta relacionada con la protección de datos:</p>
            <ul className="space-y-1 mt-2">
              <li><strong>Email:</strong> hola@thalassahub.com</li>
              <li><strong>Dirección:</strong> Avila 162, Escalera 3, Bajos B - 08018 Barcelona, España</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
