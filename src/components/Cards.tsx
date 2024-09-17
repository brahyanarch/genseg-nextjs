import Image from 'next/image'

export default function Card() {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {/* Imagen */}
      <div className="relative h-48 w-full">
        <Image
          src="/path-to-image.jpg" // Cambia esto por la ruta real de la imagen
          alt="Lisa Mamani"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">Lisa Mamani <span className="text-gray-500">Encargada</span></h3>
        <p className="text-lg font-bold text-gray-800">Limpieza en el bosque</p>
        <p className="text-gray-600 mt-2">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>

        {/* Botones */}
        <div className="mt-4 flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ver más
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Participar
          </button>
        </div>
      </div>
    </div>
  );
}
