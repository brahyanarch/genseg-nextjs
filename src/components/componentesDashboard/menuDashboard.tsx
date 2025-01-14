"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, ChevronDown, LayoutDashboard, StickyNote, Settings, Settings2, FolderKanban, Bell } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import Link from 'next/link'
import clsx from 'clsx'

const Menu = ({admi}:{admi:boolean}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSubConfigOpen, setIsSubConfigOpen] = useState(false);
  const [isPaginaOpen, setIsPaginaOpen] = useState(false);
  const [esCertificadoOpen, setEsCertificadoOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen);
  const toggleSubConfig = () => setIsSubConfigOpen(!isSubConfigOpen);
  const togglePagina = () => setIsPaginaOpen(!isPaginaOpen);
  const toggleCertificado = () => setEsCertificadoOpen(!esCertificadoOpen);

  const pathname = usePathname();
  const { idrol, idsubuni, dni } = useParams();
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Principal",
      url: admi
        ? `/intranet/privilegios`
        : `/intranet/${dni}/${idrol}/${idsubuni}`,
    },
    {
      icon: Bell,
      label: "Notificación",
      url: admi
        ? `/intranet/privilegios/notificacion`
        : `/intranet/${dni}/${idrol}/${idsubuni}/notificacion`,
    },
    // Condicionalmente incluir "Configuración" solo si es administrador
    ...(admi
      ? [
          {
            icon: Settings,
            label: "Configuración",
            url: "#",
            subItems: [
              {
                label: "Roles",
                url: `/intranet/privilegios/configuracion/roles`,
              },
              {
                label: "Permisos",
                url: `/intranet/privilegios/configuracion/permisos`,
              },
              {
                label: "Usuarios",
                url: `/intranet/privilegios/configuracion/usuarios`,
              },
              {
                label: "Sub unidad",
                url: `/intranet/privilegios/configuracion/subUnidades`,
              },
            ],
            onClick: toggleConfig,
            isOpen: isConfigOpen,
          },
        ]
      : []),
    {
      icon: LayoutDashboard,
      label: "Página",
      url: `#`,
      subItems: [
        {
          label: "Carrusel",
          url: admi
            ? `/intranet/privilegios/pagina/carrusel`
            : `/intranet/${dni}/${idrol}/${idsubuni}/pagina/carrusel`,
        },
        {
          label: "Avisos",
          url: admi
            ? `/intranet/privilegios/pagina/avisos`
            : `/intranet/${dni}/${idrol}/${idsubuni}/pagina/avisos`,
        },
      ],
      onClick: togglePagina,
      isOpen: isPaginaOpen,
    },
    
    // Condicionalmente incluir "Proyectos" y "Sub Configuraciones"
    ...(!admi
      ? [
          {
            icon: FolderKanban,
            label: "Proyectos",
            url: `/intranet/${dni}/${idrol}/${idsubuni}/proyectos`,
          },
          {
            icon: Settings2,
            label: "Sub Configuraciones",
            url: `#`,
            subItems: [
              {
                label: "Formularios",
                url: `/intranet/${dni}/${idrol}/${idsubuni}/subConfiguraciones/Formularios`,
              },
              {
                label: "Usuarios",
                url: `/intranet/${dni}/${idrol}/${idsubuni}/subConfiguraciones/usuarios`,
              },
            ],
            onClick: toggleSubConfig,
            isOpen: isSubConfigOpen,
          },
          {
            icon: StickyNote,
            label: "Certificados",
            url: `#`,
            subItems: [
              {
                label: "Ver Certificados",
                url: `/intranet/${dni}/${idrol}/${idsubuni}/certificados/ver-certificados`,
              },
              {
                label: "Solicitados",
                url: `/intranet/${dni}/${idrol}/${idsubuni}/certificados/solicitados`,
              },
              {
                label: "Plantillas",
                url: `/intranet/${dni}/${idrol}/${idsubuni}/certificados/plantillas`,
              },
            ],
            onClick: toggleCertificado,
            isOpen: esCertificadoOpen,
          },
        ]
      : []),
  ];
  

  return (
    <aside
      className={`bg-white text-black dark:bg-gray-800 dark:text-white border-r-2 border-gray-400 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="flex items-center justify-between p-4 ">
        {!isCollapsed && <h2 className="text-xl font-semibold">Menu</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <ScrollArea >
        <ul className="space-y-1 p-4">
          {menuItems.map(({ icon: Icon, label, url, subItems, onClick, isOpen }) => (
            <li key={label}>
              <Link href={url} >
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    clsx("w-full flex justify-between items-center",
                      {
                        "bg-gray-400 text-black": pathname === url,
                      }
                    )
                  }
                  onClick={() => {
                    onClick && onClick();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && label}
                  </div>
                  {!isCollapsed && subItems && (
                    <ChevronDown className={`h-4 w-4 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </Link>

              {!isCollapsed && subItems && isOpen && (
                <ul className="pl-6">
                  {subItems.map(({ label, url }) => (
                    <li key={label}>
                      <Link href={url} >
                        <Button variant="ghost" size="sm" className={
                          clsx("w-full flex justify-between items-center",
                            {
                              "bg-gray-400 text-black": pathname === url,
                            }
                          )
                        }>
                          {label}
                        </Button>
                      </Link>

                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
};

export default Menu;
