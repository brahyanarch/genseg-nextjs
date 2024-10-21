import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Bell, Settings, Users, FileText, LayoutDashboard, ChevronDown, Search } from "lucide-react"

export default function Component({idrol, idsubuni, dni}:{idrol:number, idsubuni:number, dni:string}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [activeContent, setActiveContent] = useState("Principal")

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen)

  const menuItems = [
    { icon: LayoutDashboard, label: "Principal" },
    { icon: Bell, label: "Notificación" },
    { 
      icon: Settings, 
      label: "Configuracion", 
      subItems: ["Roles", "Permisos", "Usuarios", "Sub unidad"],
      onClick: toggleConfig
    },
    { icon: FileText, label: "Monitoreo" },
    { icon: Users, label: "Pagina" },
  ]

  const handleMenuClick = (label: string) => {
    setActiveContent(label)
    if (label !== "Configuracion") {
      setIsConfigOpen(false)
    }
  }

  const handleSubItemClick = (subItem: string) => {
    setActiveContent(subItem)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-800 dark:text-white">Proyección Social y Extensión Cultural</span>
            
            </div>
            <div className="flex items-center">
              <Input 
                className="mr-4 w-64" 
                placeholder="Buscar..." 
                type="search"
                
              />
              <Button size="icon" variant="ghost" aria-label="Notifications" className="mr-4">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <nav className="space-y-2 p-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-4"}`}
                    onClick={() => {
                      handleMenuClick(item.label)
                      item.onClick?.()
                    }}
                    aria-expanded={item.label === "Configuracion" ? isConfigOpen : undefined}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-2">{item.label}</span>
                        {item.subItems && (
                          <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />
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
            <h1 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">{activeContent}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Este es el contenido de la sección {activeContent}. Aquí se mostraría la información relevante para esta área.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}