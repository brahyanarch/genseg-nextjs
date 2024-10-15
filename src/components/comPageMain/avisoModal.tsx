import { useEffect, useState } from "react";
interface AvisoModalProps {
    timeOff: Boolean;
  }
  
  export default function AvisoModal({ timeOff }: AvisoModalProps) {
    const [mostrarAviso, setMostrarAviso] = useState(false);
  
    // Mostrar modal de aviso cuando el componente esté montado
    useEffect(() => {
      setMostrarAviso(true);
  
      // Configurar el temporizador para cerrar el modal automáticamente después de 2 segundos
      const timer = setTimeout(() => {
        setMostrarAviso(false);
      }, 2000);
  
      // Limpiar el temporizador cuando el componente se desmonte
      return () => clearTimeout(timer);
    }, []);
  
    // Función para cerrar el modal manualmente
    const closeModal = () => {
      setMostrarAviso(false);
    };
  
    return (
      <>
        {/* Modal */}
        {mostrarAviso && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg flex flex-col items-center justify-center p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-bold m-4 text-gray-500">Aviso Importante</h2>
              <p className="text-gray-700 m-6">Que culminaron sus 3 actividades ya pueden solicitar sus certificados mediante esta plataforma con su código de estudiante.</p>
              <h4 className="text-gray-950 m-5">
                {Date()}
              </h4>
              <button
                className="w-40 h-15 text-center pb-1 bg-gray-500 text-white rounded hover:bg-gray-300 hover:text-gray-900"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }