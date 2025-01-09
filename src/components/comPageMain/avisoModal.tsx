"use client"
import { useEffect, useState } from "react";

interface AvisoModalProps {
  aviso: {
    titulo: string;
    descripcion: string;
    fInicio: string;
    fFin: string;
  };
}
  
  export default function AvisoModal({ aviso }: AvisoModalProps) {
    const [mostrarAviso, setMostrarAviso] = useState(false);
  
    useEffect(() => {
      const fechaActual = new Date();
      const fechaFin = new Date(aviso.fFin);
  
      // Mostrar modal si la fecha actual está antes de la fecha fin
      if (fechaActual < fechaFin) {
        setMostrarAviso(true);
      } else {
        setMostrarAviso(false);
      }
  
      // Opcional: Cerrar automáticamente después de 5 segundos (puedes ajustarlo o quitarlo)
      const timer = setTimeout(() => {
        setMostrarAviso(false);
      }, 10000);
  
      return () => clearTimeout(timer);
    }, [aviso]);
  
    // Función para cerrar el modal manualmente
    const closeModal = () => {
      setMostrarAviso(false);
    };
  
    return (
      <>
      {mostrarAviso && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg flex flex-col items-center justify-center p-8 shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold m-4 text-gray-500">{aviso.titulo}</h2>
            <p className="text-gray-700 m-6">{aviso.descripcion}</p>
            <h4 className="text-gray-950 m-5">Fin del aviso: {new Date(aviso.fFin).toLocaleString()}</h4>
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