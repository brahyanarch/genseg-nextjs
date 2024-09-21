// components/Footer.js
export default function Footer() {
    return (
      <footer className="bg-gray-100 py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            
            {/* Sección de descripción */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="font-bold text-xl mb-2">Dirección de Proyección Social y Extensión Cultural</h3>
              <p className="text-sm text-gray-600">
                Genseg es un gestor de proyectos y planes que maneja la Dirección de Proyección Social y Extensión Cultural, siendo una entidad de la Universidad Nacional del Altiplano.
              </p>
            </div>
  
            {/* Enlaces - Acerca de Genseg */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="font-semibold text-lg mb-2">Acerca de Genseg</h4>
              <ul className="text-sm text-gray-600">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Nuestra Misión y Visión</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Equipo desarrollador</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Política y Privacidad</a></li>
                <li><a href="#" className="hover:text-blue-500">Términos y condiciones</a></li>
              </ul>
            </div>
  
            {/* Mantente Conectado */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="font-semibold text-lg mb-2">Mantente Conectado</h4>
              <ul className="text-sm text-gray-600">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Blogs</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Facebook</a></li>
                <li><a href="#" className="hover:text-blue-500">Twitter</a></li>
              </ul>
            </div>
  
            {/* Servicio al Usuario */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="font-semibold text-lg mb-2">Servicio al Usuario</h4>
              <ul className="text-sm text-gray-600">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Centro de Ayuda</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Soporte</a></li>
                <li><a href="#" className="hover:text-blue-500">Comunidad de Genseg</a></li>
              </ul>
            </div>
  
            {/* Métodos de Participación */}
            <div className="w-full md:w-1/4">
              <h4 className="font-semibold text-lg mb-2">Métodos de Participación</h4>
              <ul className="text-sm text-gray-600">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Voluntariado</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Inscripción en Actividades</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Certificaciones</a></li>
                <li><a href="#" className="hover:text-blue-500">Consultas y Recomendaciones</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  