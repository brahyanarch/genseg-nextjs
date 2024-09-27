import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock3Icon, MoreHorizontal } from "lucide-react"

const notifications = [
  {
    id: 1,
    name: "Jose Roberto Mamani canaza",
    action: "Cambiar fecha del proyecto",
    time: "10:41 AM Agosto 7,2024",
    timeAgo: "10m",
    initial: "J",
    initialColor: "bg-yellow-500",
  },
  {
    id: 2,
    name: "David Rodolfo larota Guzman",
    action: "Inserto un nuevo proyecto",
    time: "10:20 AM Agosto 7,2024",
    timeAgo: "20m",
    initial: "D",
    initialColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Mariana arisaca machaca",
    action: "Elimino un proyecto",
    time: "9:30 AM Agosto 7,2024",
    timeAgo: "1h",
    initial: "M",
    initialColor: "bg-green-500",
  },
  {
    id: 4,
    name: "Jose Roberto Mamani canaza",
    action: "Elimino un proyecto",
    time: "9:11 AM Agosto 6,2024",
    timeAgo: "1D",
    initial: "M",
    initialColor: "bg-purple-500",
  },
]

export default function NotificationsComponent() {
  return (
    <div className=" z-20 absolute right-2 top-10 w-80 max-w-md bg-gray-900 text-white rounded-lg shadow-lg ">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        <Button variant="link" className="text-blue-400 text-sm">
          Marcar todo como leido
        </Button>
      </div>
      <ScrollArea className="h-[400px] ">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-3 border-b border-gray-700 ">
            <div className="flex items-start ">
              <div
                className={`${notification.initialColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-3`}
              >
                {notification.initial}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notification.name}</p>
                <p className="text-sm text-gray-400 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {notification.action}
                  <span className="ml-2 text-gray-500">{notification.timeAgo}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock3Icon className="w-3 h-3 mr-1" />
                  {notification.time}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-gray-700">
        <Button variant="link" className="text-blue-400 text-sm w-full justify-center">
          Historial de Notificaciones
        </Button>
      </div>
    </div>
  )
}