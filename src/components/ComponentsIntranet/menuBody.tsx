"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Users,
  FileText,
  LayoutDashboard,
  ChevronDown,
  Search,
  Moon,
  Sun,
  FolderKanban,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  API_ROLES,
  API_SUBUNIDADES,
  apiRolesWithDni,
  API_ROLES_WITH_DNI,
} from "@/config/apiconfig";
import { MenuRoles } from "@/components/iconsPlus";
import {
  Roles,
  Perfil,
  Notificacion,
} from "@/components/ComponentsIntranet/navIntranet";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Principal from "@/components/ComponentsIntranet/principal";
import ConfiRoles from "@/components/ComponentsIntranet/confiRoles";
import ConfiPermisos from "@/components/ComponentsIntranet/confiPermisos";
import ConfiUsers from "@/components/ComponentsIntranet/confiUsers";
import ConfiSunidad from "@/components/ComponentsIntranet/confiSunidad";
import Proyectos from "@/components/ComponentsIntranet/confiProyectos";

interface Role {
  id_rol: number;
  n_rol: string;
  abrev: string;
}
interface Subunidad {
  id_subuni: number;
  n_subuni: string;
  abreviatura: string;
}

// Define los posibles valores para `activeContent`
type ContentType =
  | "Principal"
  | "Roles"
  | "Configuracion"
  | "Permisos"
  | "Usuarios"
  | "Sub unidad"
  | "Proyectos"
  | "Monitoreo"
  | "Estadísticas"
  | "Logs";

// Define el tipo del mapeo de contenido
const contentMap: Record<ContentType, JSX.Element> = {
  Principal: <Principal />,
  Configuracion: <Principal />,
  Roles: <ConfiRoles />,
  Permisos: <ConfiPermisos />,
  Usuarios: <ConfiUsers />,
  "Sub unidad": <ConfiSunidad />,
  Proyectos: <Proyectos />,
  Monitoreo: <>Componente de Monitoreo</>,
  Estadísticas: <>Componente de Estadísticas</>,
  Logs: <>Componente de Logs</>,
};

const Component = ({
  idrol,
  idsubuni,
  dni,
}: {
  idrol: number;
  idsubuni: number;
  dni: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false); // Para el segundo submenú
  const [activeContent, setActiveContent] = useState<ContentType>("Principal");
  const [nomroles, setnomroles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const [nombreRol, setNombreRol] = useState<String>();
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen);
  const toggleMonitor = () => setIsMonitorOpen(!isMonitorOpen);

  const menuItems = [
    { icon: LayoutDashboard, label: "Principal" },
    { icon: Bell, label: "Notificación" },
    {
      icon: Settings,
      label: "Configuracion",
      subItems: ["Roles", "Permisos", "Usuarios", "Sub unidad"],
      onClick: toggleConfig,
    },
    {
      icon: FileText,
      label: "Monitoreo",
      subItems: ["Estadísticas", "Logs"],
      onClick: toggleMonitor,
    },
    { icon: Users, label: "Pagina" },
    { icon: FolderKanban, label: "Proyectos" },
  ];

  const getRoleName = (rol_id: number) => {
    const role = nomroles.find((r) => r.id_rol === rol_id);
    //return role ? role.n_rol : `Rol ${rol_id}`; // poner esqueleton
    console.log(role);
    return role ? role.n_rol + " de " : null;
  };
  const getSubunidadName = (subunidad_id: number) => {
    const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
    //return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
    return subunidad ? subunidad.n_subuni : null;
  };

  const handleMenuClick = (label: ContentType) => {
    setActiveContent(label);
    if (label !== "Configuracion") {
      setIsConfigOpen(false);
    }
    if (label !== "Monitoreo") {
      setIsMonitorOpen(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(API_ROLES);
      const data: Role[] = await response.json();
      setnomroles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchSubunidades = async () => {
    try {
      const response = await fetch(API_SUBUNIDADES);
      const data: Subunidad[] = await response.json();
      setSubunidades(data);
    } catch (error) {
      console.error("Error fetching subunidades:", error);
    }
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const handleSubItemClick = (subItem: ContentType) => {
    setActiveContent(subItem);
  };

  useEffect(() => {
    fetchRoles();
    fetchSubunidades();
  }, []);
  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 ">
      <nav className="bg-white dark:text-white w-full dark:bg-gray-800 shadow-md">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="/resources/images/DPSEClogo.png"
                alt="Logo"
                className="h-9 w-9 rounded-full bg-white"
              />
              <div className="flex flex-col pl-3">
                <span className="text-sm font-semibold text-gray-800 dark:text-white ">
                  Proyección Social y Extensión Cultural
                </span>

                {/*<p className="text-xs text-gray-400 flex-row">{getRoleName(idrol)} de {getSubunidadName(idsubuni)}</p>*/}
                {getRoleName(idrol) && getSubunidadName(idsubuni) ? (
                  <p className="text-xs text-gray-400 flex-row">
                    {" "}
                    {getRoleName(idrol)}
                    {getSubunidadName(idsubuni)}{" "}
                  </p>
                ) : (
                  <Skeleton className="h-4 w-full bg-slate-700 " />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                className="mr-4 w-64"
                placeholder="Buscar..."
                type="search"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-black dark:text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-black dark:text-white" />
                )}
              </Button>
              <Notificacion />

              <Roles idRol={idrol} idSubUnidad={idsubuni} dni={dni} />
              <Perfil />
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden ">
        <aside
          className={`bg-white text-black dark:bg-gray-800 dark:text-white ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Menu
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="h-full">
            <ul className="space-y-1 p-4">
              {menuItems.map(({ icon: Icon, label, subItems, onClick }) => (
                <li key={label}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex justify-between items-center"
                    onClick={() => {
                      handleMenuClick(label as ContentType);
                      if (subItems) {
                        onClick && onClick();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && label}
                    </div>
                    {!isCollapsed && subItems && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          (label === "Configuracion" && isConfigOpen) ||
                          (label === "Monitoreo" && isMonitorOpen)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </Button>
                  {!isCollapsed && subItems && ((label === "Configuracion" && isConfigOpen) || (label === "Monitoreo" && isMonitorOpen)) && (
                    <ul className="pl-6 space-y-1">
                      {subItems.map((subItem) => (
                        <li key={subItem}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-left"
                            onClick={() => handleSubItemClick(subItem as ContentType)}
                          >
                            {subItem}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              {/*activeContent*/}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {/*Este es el contenido de la sección {activeContent}. Aquí se
              mostraría la información relevante para esta área.*/}

              {contentMap[activeContent] || <>Componentes de por defecto</>}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Component;
