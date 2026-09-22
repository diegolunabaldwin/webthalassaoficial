import { iniciales, type Profesional } from '@/lib/thalassaApi';

/**
 * Foto del profesional si la hay, y si no sus iniciales sobre el degradado de
 * marca. Susana puede dar de alta a alguien sin foto y la ficha se ve digna.
 */
const ProfessionalAvatar = ({
  p,
  className = '',
}: {
  p: Profesional;
  className?: string;
}) =>
  p.foto_url ? (
    <img
      src={p.foto_url}
      alt={p.nombre}
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`rounded-full flex-shrink-0 flex items-center justify-center font-heading font-bold text-primary-foreground bg-gradient-to-br from-primary to-secondary ${className}`}
    >
      {iniciales(p.nombre)}
    </div>
  );

export default ProfessionalAvatar;
