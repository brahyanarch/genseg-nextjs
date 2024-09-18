import Image  from "next/image";

// components/Footer.js
export default function Footer() {
    return (
      <footer className="w-full bg-colorFooter py-8 mt-10 absolute button-0 font-nunito ">
        <div className="container mx-auto px-4">
          <div className=" w-full flex flex-wrap justify-normal items-start  ">
            
            {/* Sección de descripción */}
            <div className="w-auto md:w-[40%] mb-6 md:mb-0">
             <div className="flex justify-around items-center flex-wrap">
              <div><Image src="/resources/images/logoDPSEC.png" alt="" width={25} height={25}/></div>
              <h3 className=" text-sm mb-2 text-gray-600 font-bold">Dirección de Proyección Social y Extensión Cultural</h3>
              <div><Image src="/resources/images/genseg.png" alt="" width={25} height={25} /></div>
            </div>
              <p className="text-sm text-gray-500 p-5 font-medium">
                Genseg es un gestor de proyectos y planes que maneja la Dirección de Proyección Social y Extensión Cultural, siendo una entidad de la Universidad Nacional del Altiplano.
              </p>
            </div>
  
            {/* Enlaces - Acerca de Genseg */}
            <div className="w-auto md:w-[15%] mb-6 md:mb-0">
              <h4 className=" text-lg mb-2 text-gray-800 font-bold">Acerca de Genseg</h4>
              <ul className="text-sm text-gray-500 font-medium">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Nuestra Misión y Visión</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Equipo desarrollador</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Política y Privacidad</a></li>
                <li><a href="#" className="hover:text-blue-500">Términos y condiciones</a></li>
              </ul>
            </div>
  
            {/* Mantente Conectado */}
            <div className="w-auto md:w-[15%] mb-6 md:mb-0">
              <h4 className="font-bold text-lg mb-2 text-gray-800">Mantente Conectado</h4>
              <ul className="text-sm text-gray-500 font-medium">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Blogs</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Facebook</a></li>
                <li><a href="#" className="hover:text-blue-500">Twitter</a></li>
              </ul>
            </div>
  
            {/* Servicio al Usuario */}
            <div className="w-auto md:w-[15%] mb-6 md:mb-0">
              <h4 className="font-bold text-lg mb-2 text-gray-800  py-0 ">Servicio al Usuario</h4>
              <ul className="text-sm text-gray-500 font-medium">
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Centro de Ayuda</a></li>
                <li className="mb-1"><a href="#" className="hover:text-blue-500">Soporte</a></li>
                <li><a href="#" className="hover:text-blue-500">Comunidad de Genseg</a></li>
              </ul>
            </div>
  
            {/* Métodos de Participación */}
            <div className="w-auto md:w-[15%] py-0">
              <h4 className="font-bold text-lg mb-2 text-gray-800">Métodos de Participación</h4>
              <ul className="text-sm text-gray-500 font-medium" >
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
  