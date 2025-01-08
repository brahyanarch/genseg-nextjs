"use client";
// Importando
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { API_URL } from "@/config/apiconfig";

interface carruselProps {
  idcarrusel: number;
  img: string;
  titulo: string | "Default";
  subtitulo?: string | "DEPSEC";
}

interface vectorCarruselProps {
  data: carruselProps[];
}

export default function Carrusel({ data }: vectorCarruselProps) {
  // Inicializa el estado con el índice del primer carrusel
  const [activeIndex, setActiveIndex] = useState(0); // Usamos índice en lugar de idcarrusel

  // Temporizador para cambiar de imagen automáticamente
  useEffect(() => {
    if (data.length > 1) {
      const timer = setInterval(() => {
        nextSlide(); // Cambiar al siguiente slide automáticamente
      }, 4000);
      
      // Limpiar el temporizador al desmontar el componente
      return () => clearInterval(timer);
    }
  }, [activeIndex, data.length]); // Dependencia también sobre data.length
   // Solo se ejecuta una vez al montar el componente

  // Función para avanzar al siguiente slide
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % data.length);
    console.log("hbhvjhv",activeIndex);
  };

  // Función para retroceder al slide anterior
  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + data.length) % data.length);
  };

  // Función para ir a un slide específico
  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative overflow-hidden h-[600px]" id="carouselExampleCaptions">
      {data.map((image, index) => (
        <div
          key={image.idcarrusel}
          className={`absolute inset-0 transition-opacity duration-[2.3s] ease-in-out ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`} // Cambié a "opacity-100" para hacerlo visible en vez de "bg-opacity-5"
          aria-hidden={index !== activeIndex}
        >
          <img
            src={`${API_URL}/${image.img}`}
            alt={image.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
            <h5 className="text-xl font-bold mb-0 text-center bg-slate-500/30">
              {image.titulo}
            </h5>
            <p className="text-sm text-center mb-16 bg-slate-500/30 text-white">
              {image.subtitulo}
            </p>
          </div>
        </div>
      ))}

      {/* Botón para ir al slide anterior */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white text-opacity-50 hover:text-white p-2 rounded-full"
        onClick={() => {
          prevSlide(); // Cambia al slide anterior
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-9 w-9" />
        <span className="sr-only">Previous</span>
      </button>

      {/* Botón para ir al siguiente slide */}
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white text-opacity-50 hover:text-white p-2 rounded-full"
        onClick={() => {
          nextSlide(); // Cambia al siguiente slide
        }}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-9 w-9" />
        <span className="sr-only">Next</span>
      </button>

      {/* Indicadores (botones) para navegar entre los slides */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {data.map((img, index) => (
          <button
            key={img.idcarrusel}
            type="button"
            className={`w-10 h-1 rounded-[11px] ${
              index === activeIndex ? "bg-blue-700" : "bg-blue-400 opacity-50"
            }`}
            onClick={() => goToSlide(index)} // Cambia al slide seleccionado
            aria-label={`Slide ${img.idcarrusel}`}
            aria-current={index === activeIndex ? "true" : "false"}
          ></button>
        ))}
      </div>
    </div>
  );
}
