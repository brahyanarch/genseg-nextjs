import Image from 'next/image'

export default function Card({nombre,encargado}:any) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-10 mx-auto w-80">
      {/* Imagen */}
      <div className="relative h-48 w-full">
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
        <p className="text-xl font-bold text-gray-900">{nombre}</p>
        <p className="text-gray-600 mt-2 font-normal">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>

        {/* Botones */}
        <div className="mt-4 flex justify-between items-center ">
          <button className="bg-white-800 h-[40px] w-[130px] hover:bg-blue-700 hover:text-white text-blue-500 border-[1px] border-blue-500 font-medium py-2 px-4 rounded">
            Ver más
          </button>
          <button className="bg-blue-500 h-[40px] w-[130px] hover:bg-blue-700  text-white font-medium py-2 px-4 rounded">
            Participar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Cards(){


  return(
    <div className='flex justify-around items-center flex-wrap w-4/5 mx-auto my-10'>
      <Card nombre="Actividad 1" encargado="David Larota" />
      <Card nombre="Actividad 2" encargado="Bernardo Pari"/>
      <Card nombre="Actividad 3" encargado="Lennin Chura"/>
      <Card nombre="Actividad 4" encargado="Marco Quispe"/>
      <Card nombre="Actividad 3" encargado="Lennin Chura"/>
      <Card nombre="Actividad 4" encargado="Marco Quispe"/>

    </div>
  )
}