import Footer from './layout/footer';
import LandingNavbar from './layout/navbar';

const PrivacyPolicy = () => {
  return (
    <main className="bg-white">
      <LandingNavbar />
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-2xl font-bold mb-4">Aviso de Privacidad</h1>
        <p className="text-sm text-gray-500 mb-6">
          Última actualización: 14 de Octubre de 2024
        </p>

        <p className="mb-4">
          En <span className="font-semibold">Possify</span> (en adelante,
          “nosotros” o “nuestro”), nos comprometemos a proteger la privacidad y
          seguridad de los datos personales de nuestros usuarios y clientes (en
          adelante, “tú” o “tu”). Este Aviso de Privacidad describe cómo
          recopilamos, utilizamos, compartimos y protegemos tu información
          personal cuando utilizas nuestro sistema de punto de venta en la nube
          (en adelante, “el Servicio”).
        </p>

        <h2 className="text-xl font-semibold mb-2">
          1. Identidad y Domicilio del Responsable
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Responsable: Possify</li>
          <li>Domicilio: Actopan Hidalgo, México</li>
          <li>
            Contacto:{' '}
            <a href="mailto:soporte@possify.com" className="text-blue-500">
              soporte@possify.com
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          2. Datos Personales que Recopilamos
        </h2>
        <p className="mb-4">
          Recopilamos los siguientes datos personales de forma directa cuando te
          registras y utilizas el Servicio:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Datos de Identificación: Nombre completo, nombre de usuario.</li>
          <li>Datos de Contacto: Correo electrónico, número de teléfono.</li>
          <li>
            Información de la Empresa: Nombre comercial, tipo y tamaño del
            negocio.
          </li>
          <li>
            Datos de Uso: Información sobre cómo interactúas con el Servicio.
          </li>
          <li>
            Información Financiera: Datos necesarios para procesar pagos (cuando
            corresponda).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          3. Finalidades del Tratamiento de Datos
        </h2>
        <p className="mb-4">
          Utilizamos tus datos personales para las siguientes finalidades:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Primarias:</strong>
          </li>
          <ul className="list-disc pl-6 mb-4">
            <li>Proporcionar acceso y uso del Servicio.</li>
            <li>Personalizar y mejorar tu experiencia con el Servicio.</li>
            <li>
              Gestionar y mantener actualizadas tus cuentas y suscripciones.
            </li>
            <li>Proporcionar soporte técnico y responder a tus consultas.</li>
          </ul>
          <li>
            <strong>Secundarias:</strong>
          </li>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Enviarte comunicaciones promocionales y ofertas especiales (con tu
              consentimiento).
            </li>
            <li>
              Realizar encuestas y solicitar retroalimentación para mejorar el
              Servicio.
            </li>
            <li>
              Cumplir con obligaciones legales y requerimientos de autoridades
              competentes.
            </li>
          </ul>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          4. Bases Legales para el Tratamiento
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Consentimiento:</strong> Al registrarte y aceptar este Aviso
            de Privacidad, nos autorizas a tratar tus datos para las finalidades
            aquí descritas.
          </li>
          <li>
            <strong>Relación Contractual:</strong> El tratamiento es necesario
            para el cumplimiento de las obligaciones derivadas del Servicio.
          </li>
          <li>
            <strong>Interés Legítimo:</strong> Para mejorar nuestros productos y
            servicios.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
        </h2>
        <p className="mb-4">Tienes derecho a:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Acceder a tus datos personales que poseemos.</li>
          <li>Rectificar tus datos si son inexactos o incompletos.</li>
          <li>
            Cancelar tus datos cuando consideres que no son necesarios para las
            finalidades señaladas.
          </li>
          <li>Oponerte al tratamiento de tus datos para fines específicos.</li>
        </ul>
        <p className="mb-4">
          Para ejercer tus derechos ARCO, envía una solicitud al correo
          electrónico:
          <a href="mailto:soporte@possify.com" className="text-blue-500">
            {' '}
            soporte@possify.com
          </a>
          , especificando:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Tu nombre y datos de contacto.</li>
          <li>Derecho que deseas ejercer.</li>
          <li>
            Descripción clara de los datos respecto de los cuales buscas ejercer
            el derecho.
          </li>
        </ul>
        <p className="mb-4">
          Atenderemos tu solicitud en un plazo no mayor a 20 días hábiles.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          6. Transferencia de Datos Personales
        </h2>
        <p className="mb-4">
          No compartiremos tus datos personales con terceros, excepto en los
          siguientes casos:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Proveedores de Servicios:</strong> Que nos ayudan a operar
            el Servicio, quienes están obligados a proteger tus datos bajo los
            mismos estándares de este aviso.
          </li>
          <li>
            <strong>Obligaciones Legales:</strong> Cuando sea requerido por ley
            o autoridades competentes.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">7. Medidas de Seguridad</h2>
        <p className="mb-4">
          Implementamos medidas de seguridad para proteger tus datos,
          incluyendo:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Encriptación de datos sensibles.</li>
          <li>Control de Acceso restringido a personal autorizado.</li>
          <li>Monitoreo continuo de nuestros sistemas y redes.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          8. Uso de Cookies y Tecnologías Similares
        </h2>
        <p className="mb-4">
          Utilizamos cookies para mejorar tu experiencia en el Servicio. Pueden
          recopilar:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Preferencias de usuario.</li>
          <li>Datos de sesión.</li>
          <li>Estadísticas de uso.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">
          9. Cambios al Aviso de Privacidad
        </h2>
        <p className="mb-4">
          Nos reservamos el derecho de modificar este Aviso en cualquier
          momento. Las modificaciones serán publicadas en nuestro sitio web con
          la fecha de la última actualización.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          10. Aceptación y Consentimiento
        </h2>
        <p className="mb-4">
          Al utilizar el Servicio, confirmas que has leído y comprendido este
          Aviso de Privacidad.
        </p>

        <h2 className="text-xl font-semibold mb-2">11. Menores de Edad</h2>
        <p className="mb-4">
          El Servicio no está dirigido a menores de edad. Si eres padre o tutor
          y tienes conocimiento de que un menor nos ha proporcionado datos,
          contáctanos para tomar las medidas necesarias.
        </p>

        <h2 className="text-xl font-semibold mb-2">12. Contacto</h2>
        <p className="mb-4">
          Si tienes preguntas sobre este Aviso, contáctanos:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Correo Electrónico:{' '}
            <a href="mailto:soporte@possify.com" className="text-blue-500">
              soporte@possify.com
            </a>
          </li>
          <li>Dirección Física: Actopan Hidalgo, México</li>
        </ul>
      </div>

      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
