import susana from '@/assets/susana.png';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-background">
      <div 
        ref={sectionRef}
        className={`container mx-auto px-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
              Sobre Nosotros
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8">
              25 años navegando la Industria Alimentaria
            </h2>
            
            <div className="space-y-5 text-foreground/80 font-body text-lg leading-relaxed">
              <p>
                En Thalassa Hub creemos que la seguridad alimentaria funciona mejor cuando se entiende desde la realidad del negocio.
              </p>
              <p>
                <strong className="text-foreground">Susana Serna</strong>, fundadora y CEO, es <strong className="text-foreground">Ingeniera de Industrias Alimentarias</strong> y cuenta con más de <strong className="text-foreground">25 años de experiencia</strong> en <strong className="text-foreground">entidades internacionales</strong>, trabajando con empresas de toda la cadena de suministro alimentaria: desde la producción primaria hasta la industria, el retail y el canal HORECA.
              </p>
              <p>
                Esta visión transversal le ha permitido comprender de primera mano los <strong className="text-foreground">retos y oportunidades</strong> de cada eslabón de la cadena y acompañar a las organizaciones no solo a cumplir, sino a <strong className="text-foreground">consolidar sus marcas y expandirse</strong>, convirtiendo los <strong className="text-foreground">requisitos normativos y las exigencias de clientes</strong> en <strong className="text-foreground">oportunidades reales de diferenciación.</strong>
              </p>
              <p>
                Thalassa Hub se apoya en una <strong className="text-foreground">red de colaboradores senior</strong>, profesionales con amplia trayectoria y conocimiento profundo del sector, que comparten una misma forma de entender la seguridad alimentaria: con criterio, experiencia y sentido práctico.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="mt-8 pl-6 border-l-4 border-secondary py-4">
              <p className="text-xl md:text-2xl font-heading font-semibold text-primary italic">
                "Vamos más allá del requisito. Convertimos la complejidad en criterio, foco y decisiones claras."
              </p>
            </blockquote>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl -z-10" />
              <img
                src={susana}
                alt="Susana Serna - Founder & CEO de Thalassa Hub"
                className="rounded-xl shadow-2xl max-w-full h-auto w-full max-h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
