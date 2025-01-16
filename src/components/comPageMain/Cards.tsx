'use client'
import Image from 'next/image'
import { ParticipateModal } from '@/components/comPageMain/participateModal';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config/apiconfig';
import Swal from 'sweetalert2';
export default function Card({ nombreAct, encargado, idActivity}: any) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  }
  return (
    <div className="max-w-sm h-[450px] rounded overflow-hidden shadow-lg bg-white mb-10 mx-auto w-80 ">
      {/* Imagen */}
      <div className="relative h-36 w-full">
        <Image
          src="/resources/images/5.jpg" // Cambia esto por la ruta real de la imagen
          alt="Lisa Mamani"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-blue-700">{encargado} <span className="text-gray-500 font-light text-xs">Encargad@</span></h3>
        <p className="text-xl font-bold text-gray-900">{nombreAct.length > 40 ? nombreAct.slice(0, 40) + "..." : nombreAct}
        </p>
        <p className="text-gray-600 h-28 mt-2 font-normal">
          {nombreAct.length > 80 ? nombreAct.slice(0, 80) + "..." : nombreAct}
        </p>

        {/* Botones */}
        <div className="mt-4 flex justify-between items-center ">
          <button className="bg-white-800   h-[40px] w-[130px] hover:bg-blue-700 hover:text-white text-blue-500 border-[1px] border-blue-500 font-medium py-2 px-4 rounded">
            Ver más
          </button>
          <button className="bg-blue-500 h-[40px] w-[130px] hover:bg-blue-700  text-white font-medium py-2 px-4 rounded" onClick={toggleModal} >
            Participar
          </button>
        </div>
      </div>
      {isOpenModal && (<ParticipateModal toggleModal={toggleModal} idActivity={idActivity} />)}

    </div>
  );
}
interface ActivityData{
  idActivi: number;
  name: string;
  fInit: string;
  fFin: string;
  public: boolean;
  project: {
    usuario:{
      nombre: string;
    }
  };
}
export function Cards() {
  const [actividades, setActividades] = useState<ActivityData[]>([]);

     ///funcion para obtener los datos del estudiante(participante)
     const handleGetActivitiesPublic = async () => {
         try {
             const response = await fetch(`${API_URL}/api/actividades/pagina`);
             if (response.ok) {
                 const data = await response.json();
                 setActividades(data);
             } else {
                 Swal.fire({
                     icon: 'error',
                     title: 'Error',
                     text: 'No se pudo obtener los datos del participante'
 
                 })
             }
         } catch (error) {
             Swal.fire({
                 icon: 'error',
                 title: 'Error no se pudo obtener los datos del participante',
                 text: 'Compruebe su conexion a internet'
 
             })
         }
 
 
     }

     useEffect(() => {
         handleGetActivitiesPublic();
     }, [])
  return (
    <div className='grid grid-cols-3 gap-4 w-4/5 mx-auto my-10 relative'>

      {
        actividades.map((actividad, index) => (
          <Card key={actividad.idActivi} nombreAct={actividad.name} encargado={actividad.project.usuario.nombre} idActivity={actividad.idActivi} />
        ))
      }

    </div>
  )
}