import { APP_ROUTES } from '@/routes/routes';

const Footer = () => {
  return (
    <footer className="h-12 flex justify-between items-center bg-white border-t px-5">
      <span>© 2024 Posiffy. Todos los derechos reservados.</span>

      <div className="flex gap-5 items-center">
        <a
          href={APP_ROUTES.PUBLIC.TERMS_AND_CONDITIONS.path}
          className="text-sm hover:text-primary"
        >
          Términos y condiciones
        </a>
        <a
          href={APP_ROUTES.PUBLIC.PRIVACY_POLICY.path}
          className="text-sm hover:text-primary"
        >
          Aviso de privacidad
        </a>
      </div>
    </footer>
  );
};

export default Footer;
