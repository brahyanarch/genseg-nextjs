// AvisoContext.tsx
'use client';
import React, { createContext, useState,ReactNode } from 'react';
import clsx from 'clsx'
import Aviso from '@/components/aviso';


interface AvisoContextProps {
  mostrarAviso: (type: string, content: string, fixed: boolean) => void;
}

export const AvisoContext = createContext<AvisoContextProps | undefined>(undefined);

const AvisoProvider = ({ children }: { children: ReactNode }) => {
  const [avisoData, setAvisoData] = useState<{ type: string; content: string; fixed: boolean } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const mostrarAviso = (type: string, content: string, fixed: boolean = false) => {
    setAvisoData({ type, content, fixed });
    setIsVisible(true);

    if (!fixed) {
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Ocultar después de 3 segundos
    }else {
        setIsVisible(true);
    }
  };

  return (
    <AvisoContext.Provider value={{ mostrarAviso }}>
      {children}
      {isVisible && avisoData && (
        <div className={clsx("fixed top-4 left-1/2 transform -translate-x-1/2",{
          "w-[80%]": avisoData.fixed === true,
          "w-[20%]": avisoData.fixed === false,

        })}>
          <Aviso type={avisoData.type} content={avisoData.content} fixed={avisoData.fixed} />
        </div>
      )}
    </AvisoContext.Provider>
  );
};


export default AvisoProvider;
