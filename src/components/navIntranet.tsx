import { BellIcon, MenuIcon, SearchIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <nav className="bg-gray-900 text-white p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="/resources/images/DPSEClogo.png" alt="Logo" className="h-9 w-9 rounded-full bg-white" />
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold">Proyección Social y Extensión Cultural</h1>
          <p className="text-xs text-gray-400">Coordinador</p>
        </div>
      </div>
        <div className="relative hidden md:block ">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar..." 
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-64 rounded-3xl"
          />
        </div>
      <div className="flex items-center space-x-4">
        <Button variant="default" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon" className="bg-white rounded-full">
          <span className="text-sm font-bold text-black">M</span>
        </Button>
        
      </div>
    </nav>
  )
}