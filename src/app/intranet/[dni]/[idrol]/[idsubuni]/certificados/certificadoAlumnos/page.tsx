'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from '@/config/apiconfig';
import { useParams } from 'next/navigation';

// Tipos
export interface Activity {
  id: number;
  name: string;
  checked: boolean;
}

export interface Template {
  id: number;
  name: string;
  selected: boolean;
}

export interface CertificateData {
  activities: Activity[];
  templates: Template[];
}

// Componente principal
export default function CertificatePage() {
  const [code, setCode] = useState('');
  const [dni, setDni] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const { idsubuni } = useParams();

  // Datos estáticos de ejemplo
  const staticData: CertificateData = {
    activities: [
      { id: 1, name: 'Actividad 1', checked: false },
      { id: 2, name: 'Actividad 2', checked: false },
      { id: 3, name: 'Actividad 3', checked: false },
    ],
    templates: [
      { id: 1, name: 'Plantilla 1', selected: false },
      { id: 2, name: 'Plantilla 2', selected: true },
      { id: 3, name: 'Plantilla 3', selected: false },
    ],
  };

  // Fetch de actividades
  const fetchActivitiesData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/completados/actividades/${dni}/${idsubuni}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.actividadesAsistidas || []);
      } else {
        alert("Error al cargar actividades");
      }
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      setActivities(staticData.activities); // Fallback
    }
  };

  // Fetch de plantillas
  const fetchTemplatesData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data || []);
      } else {
        alert("Error al cargar plantillas");
      }
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      setTemplates(staticData.templates); // Fallback
    }
  };

  // Manejo de cambio en Checkbox (actividades)
  const handleActivityChange = (id: number) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, checked: !activity.checked } : activity
      )
    );
  };

  // Manejo de cambio en RadioGroup (plantillas)
  const handleTemplateChange = (id: string) => {
    const templateId = parseInt(id);
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, selected: true }
          : { ...template, selected: false }
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm mb-4">
          <span className="text-gray-400">Inicio {'>'} Certificado</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">CERTIFICADO</h1>

        {/* Formulario */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-8">
          <div>
            <Label htmlFor="code">Código:</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-transparent border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="dni">DNI:</Label>
            <Input
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="bg-transparent border-gray-600"
            />
          </div>
          <Button onClick={fetchActivitiesData} className="self-end">
            Buscar
          </Button>
        </div>

        {/* Tablas */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Actividades */}
          {activities.length > 0 && (
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Actividades</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-700">
                      <td className="py-2">{activity.id}</td>
                      <td className="py-2">{activity.name}</td>
                      <td className="py-2 text-center">
                        <Checkbox
                          checked={activity.checked}
                          onCheckedChange={() => handleActivityChange(activity.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Plantillas */}
          {templates.length > 0 && (
            <div>
              <RadioGroup onValueChange={handleTemplateChange}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-2">ID</th>
                      <th className="text-left py-2">Plantilla</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template) => (
                      <tr key={template.id} className="border-b border-gray-700">
                        <td className="py-2">{template.id}</td>
                        <td className="py-2">{template.name}</td>
                        <td className="py-2 text-center">
                          <RadioGroupItem value={template.id.toString()} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button size="lg">Brindar Certificado</Button>
        </div>
      </div>
    </div>
  );
}
