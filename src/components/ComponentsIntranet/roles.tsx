import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon } from "lucide-react"

const roles = [
  { name: "Sub Administrador", icon: "M" },
  { name: "Coordinador PSEC", icon: "M" },
  { name: "Personal de planta", icon: "M" },
  { name: "Sub Administrador PSEC", icon: "M" },
]

export default function Roles() {
  return (
    <div className="w-[300px] bg-gray-900 text-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role, index) => (
            <div key={index} className="flex flex-col items-center p-2 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center mb-2">
                <span className="text-sm font-bold">{role.icon}</span>
              </div>
              <span className="text-xs text-center">{role.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  )
}