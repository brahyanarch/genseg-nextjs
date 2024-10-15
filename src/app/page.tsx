"use client";
//importando
import { useState, useEffect } from "react";
import { Menu, X, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Carrusel from "../components/comPageMain/carrusel";
import Navbarr from "../components/comPageMain/navbar";
import Footer from "@/components/comPageMain/Footer";
import ObtenerCertificado from "@/components/comPageMain/getCertificate";
import AvisoModal from "@/components/comPageMain/avisoModal";
//funcion principal que controla el Modal de aviso

const datos = [
  {
    src: "/resources/images/fb1.jpg",
    alt: "First slide",
    heading: "GENSEG",
    description: "Dpsec",
  },
  {
    src: "/resources/images/fb2.jpg",
    alt: "Second slide",
    heading: "Gestion Ambiental",
    description: "Evidencia de la actividad de la que nosotros nos encontramos con todos",
  },
  {
    src: "/resources/images/fb3.jpg",
    alt: "Third slide",
    heading: "Seguimiento al egresado",
    
  },
  {
    src: "/resources/images/fb4.jpg",
    alt: "Fourth slide",
    heading: "Proyección Social y Extensión Cultural",
    description: "Evidencia de las que no estamos, y sobre todo el respeto",
  },
  ];

  
// Lista de frameworks
const frameworks = [
  {
    value: "Gestion Ambiental",
    label: "Gestion Ambiental",
  },
  {
    value: "Seguimiento y Desarrollo del Graduado",
    label: "Seguimiento y Desarrollo del Graduado",
  },
  {
    value: "Proyección Social y Extensión cultural",
    label: "Proyección Social y Extensión cultural",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]


export default function Home() {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    setMostrarAlerta(true);

    const timer = setTimeout(() => {
      setMostrarAlerta(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-ColorPrincipal">
      <AvisoModal timeOff={mostrarAlerta} />
      <Navbarr />
      <Carrusel data={datos}/>
      {/*<ObtenerCertificado key={frameworks} />*/}
      <ObtenerCertificado data={frameworks} />
      <Footer />
    </div>
  );
}
