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
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
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
  const [activeContent, setActiveContent] = useState("Principal");
  const [nomroles, setnomroles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const [nombreRol, setNombreRol] = useState<String>();
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen);

  const menuItems = [
    { icon: LayoutDashboard, label: "Principal" },
    { icon: Bell, label: "Notificación" },
    {
      icon: Settings,
      label: "Configuracion",
      subItems: ["Roles", "Permisos", "Usuarios", "Sub unidad"],
      onClick: toggleConfig,
    },
    { icon: FileText, label: "Monitoreo" },
    { icon: Users, label: "Pagina" },
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

  const handleMenuClick = (label: string) => {
    setActiveContent(label);
    if (label !== "Configuracion") {
      setIsConfigOpen(false);
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
  const handleSubItemClick = (subItem: string) => {
    setActiveContent(subItem);
  };

  useEffect(() => {
    fetchRoles();
    fetchSubunidades();
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="/resources/images/DPSEClogo.png"
                alt="Logo"
                className="h-9 w-9 rounded-full bg-white"
              />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
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
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Notificacion />

              <Roles idRol={idrol} idSubUnidad={idsubuni} dni={dni}  />
              <Perfil />
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-white dark:bg-gray-800 ${
            isCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 ease-in-out`}
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
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <nav className="space-y-2 p-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isCollapsed ? "px-2" : "px-4"
                    }`}
                    onClick={() => {
                      handleMenuClick(item.label);
                      item.onClick?.();
                    }}
                    aria-expanded={
                      item.label === "Configuracion" ? isConfigOpen : undefined
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-2">{item.label}</span>
                        {item.subItems && (
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${
                              isConfigOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </Button>
                  {!isCollapsed && item.subItems && isConfigOpen && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleSubItemClick(subItem)}
                        >
                          {subItem}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
              {activeContent}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Este es el contenido de la sección {activeContent}. Aquí se
              mostraría la información relevante para esta área.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Component;
