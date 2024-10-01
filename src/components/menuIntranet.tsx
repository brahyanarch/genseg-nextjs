import { HomeIcon, BellIcon, BarChartIcon, FolderIcon, FileIcon } from "lucide-react"

export default function Component() {
  return (
    <div className="w-64 bg-[#222834] text-gray-100 h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <MenuItem icon={<HomeIcon size={20} />} text="Principal" />
          <MenuItem icon={<BellIcon size={20} />} text="Notificación" />
          <MenuItem icon={<BarChartIcon size={20} />} text="Reportes" />
          <MenuItem icon={<FolderIcon size={20} />} text="Proyectos" />
          <MenuItem icon={<FileIcon size={20} />} text="Pagina" />
        </ul>
      </nav>
    </div>
  )
}

function MenuItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li>
      <a
        href="#"
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
      >
        {icon}
        <span>{text}</span>
      </a>
    </li>
  )
}