'use client'
//importando
import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export default function Carrusel() {
    //array images que almacena las direcciones de las images que aparecerán en el carrucel
    const images = [
    {
      src: "/resources/images/42.png",
      alt: "First slide",
      heading: "GENSEG",
      description: "Dpsec",
    },
    {
      src: "/resources/images/9.jpg",
      alt: "Second slide",
      heading: "Gestion Ambiental",
      description: "Evidencia de la actividad de la que nosotros nos encontramos con todos",
    },
    {
      src: "/resources/images/FondoP1.png",
      alt: "Third slide",
      heading: "Seguimiento al egresado",
    },
    {
      src: "/resources/images/FondoP.png",
      alt: "Fourth slide",
      heading: "Proyección Social y Extensión Cultural",
      description: "Evidencia de las que no estamos, y sobre todo el respeto",
    },
    ];
    //inicializando estados para cambiar las imágenes y controlar el cambio suave de las imágenes
    const [imagenActual, setImagenActual] = useState(0);
    const [isFading, setIsFading] = useState(false);
    // Cambia la imagen cada 10 segundos
    const [activeIndex, setActiveIndex] = useState(0);
  
    const nextSlide = () => {
      setActiveIndex((current) => (current + 1) % images.length);
    };
  
    const prevSlide = () => {
      setActiveIndex((current) => (current - 1 + images.length) % images.length);
    };
  
    const goToSlide = (index: number) => {
      setActiveIndex(index);
    };
     
    useEffect(() => {
      const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
      console.log("solo pasa una vez");
      return () => clearInterval(timer);
    }, []);
    //función para controlar el cambio de las imágenes al hacer click en los botones del carrusel
    
    
  
    return (
      <div
        className="relative overflow-hidden h-[600px] "
        id="carouselExampleCaptions"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[2.3s] ease-in-out ${
              index === activeIndex ? "bg-opacity-5 bg-zinc-100" : "opacity-0 z-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2  text-white">
              <h5 className="text-xl font-bold mb-0 text-center">
                {image.heading}
                
              </h5>
              <p className="text-sm text-center mb-16">{image.description ? image.description:"DPSEC" }</p>
            </div>
          </div>
        ))}
  
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white text-opacity-50  hover:text-white p-2 rounded-full"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-9 w-9" />
          <span className="sr-only">Previous</span>
        </button>
  
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white text-opacity-50  hover:text-white p-2 rounded-full"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-9 w-9" />
          <span className="sr-only">Next</span>
        </button>
  
        <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-10 h-1 rounded-[11px] ${
                index === activeIndex ? "bg-blue-700" : "bg-blue-400 opacity-50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : "false"}
            ></button>
          ))}
        </div>
  
      </div>
    );
  }