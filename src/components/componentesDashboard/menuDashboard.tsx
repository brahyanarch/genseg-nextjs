"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, ChevronDown, LayoutDashboard, Settings, FolderKanban, Bell } from "lucide-react";
import { useParams,usePathname } from "next/navigation";
import Link from 'next/link'
import clsx from 'clsx'

const Menu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen);
  const toggleMonitor = () => setIsMonitorOpen(!isMonitorOpen);
  
  const pathname = usePathname();
  const { idrol, idsubuni, dni } = useParams();
  const menuItems = [
    { icon: LayoutDashboard, 
      label: "Principal",
      url: `/intranet/${dni}/${idrol}/${idsubuni}`
    },
    { icon: Bell, label: "notificacion", url: `/intranet/${dni}/${idrol}/${idsubuni}/notificacion` },
    
    {
      icon: Settings,
      label: "Configuracion",
      url:"#",
      subItems: [
        { 
        label:"Roles",
        url: `/intranet/${dni}/${idrol}/${idsubuni}/configuracion/roles`
        },{
        label: "Permisos",
        url: `/intranet/${dni}/${idrol}/${idsubuni}/configuracion/permisos`
        },
        {
        label:"Usuarios",
        url: `/intranet/${dni}/${idrol}/${idsubuni}/configuracion/usuarios`
        },
        {
        label: "Sub unidad",
        url: `/intranet/${dni}/${idrol}/${idsubuni}/configuracion/subUnidades`
        }],
      onClick: toggleConfig,
    },/*
    {
      icon: FileText,
      label: "Monitoreo",
      url: `/intranet/${dni}/${idrol}/${idsubunidad}/monitoreo`,
      subItems: ["Estadísticas", "Logs"],
      onClick: toggleMonitor,
    },*/
    { icon: FolderKanban, 
      label: "Proyectos",
      url: `/intranet/${dni}/${idrol}/${idsubuni}/proyectos` },
  ];

  return (
    <aside
      className={`bg-white text-black dark:bg-gray-800 dark:text-white border-r-2 border-gray-400 ${
        isCollapsed ? "w-16" : "w-64"
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
          {menuItems.map(({ icon: Icon, label, url, subItems, onClick }) => (
            <li key={label}>
            <Link href={url} >
            <Button
                variant="ghost"
                size="sm"
                className={
                    clsx( "w-full flex justify-between items-center",
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
                  <ChevronDown className={`h-4 w-4 ${isConfigOpen ? "rotate-180" : ""}`} />
                )}
              </Button>
            </Link>

              {!isCollapsed && subItems && isConfigOpen && (
                <ul className="pl-6">
                  {subItems.map(({label,url}) => (
                    <li key={label}>
                    <Link  href={url} >
                    <Button variant="ghost" size="sm" className={
                    clsx( "w-full flex justify-between items-center",
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
