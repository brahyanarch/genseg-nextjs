//importando recursos

import { useState } from 'react';

export function Dropdown(){
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select an option');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option:any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-60 mx-5 my-5">
      {/* Dropdown Button */}
      <div
        onClick={toggleDropdown}
        className="px-4 py-2 border text-sm text-gray-400 border-gray-300 rounded-md cursor-pointer bg-white"
      >
        {selectedOption}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-40 overflow-y-auto text-sm">
          <li
            onClick={() => handleOptionClick('Gestión Ambiental')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            Gestión Ambiental
          </li>
          <li
            onClick={() => handleOptionClick('Seguimiento al Egresado')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            Seguimiento al Egresado
          </li>
          <li
            onClick={() => handleOptionClick('Proyección Social y Extensión Cultural')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 "
          >
            Proyección Social y Extensión Cultural
          </li>
        </ul>
      )}
    </div>
  );
};


export default function ObtenerCertificado() {
    return (
      <>
        <div className="bg-gray-300 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Solicitar Certificado</h2>
          <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-[90%] text-center mb-4">
            ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
          </p>
          <div className="flex justify-between items-center w-[90%]  mb-4">
            <h3 className="text-lg">Digite su código de estudiante:</h3>
            <Dropdown/>
            <div className="flex space-x-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="201861"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Consultar
              </button>
            </div>
          </div>
  
          <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-[90%] text-center">
            Los certificados se entregarán de manera digital a su correo institucional, si requiere en físico apersonarse a la oficina de la DPSEC.
          </p>
        </div>
      </>
    );
  }
  