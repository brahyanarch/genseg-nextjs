'use client';

import { useEffect, useState } from 'react';
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
  actividad: {
    name: string;
  };
}

export interface Template {
  idplantilla: number;
  nombre: string;
}

export default function CertificatePage() {
  const [code, setCode] = useState('');
  const [dni, setDni] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);

  const { idsubuni } = useParams();

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
    }
  };

  // Fetch de plantillas
  const fetchTemplatesData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/plantilla/${idsubuni}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data || []);
      } else {
        alert("Error al cargar plantillas");
      }
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
    }
  };

  useEffect(() => {
    fetchTemplatesData();
  }, []);

  // Manejo de cambio en Checkbox (actividades)
  const handleActivityChange = (id: number) => {
    setSelectedActivityIds((prev) =>
      prev.includes(id) ? prev.filter((activityId) => activityId !== id) : [...prev, id]
    );
  };

  // Manejo de cambio en RadioGroup (plantillas)
  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(parseInt(id));
  };
  const enviarCertificado = async () => {
    try {
      const response = await fetch(`${API_URL}/api/certificado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo:  code,
          dni: dni,
          idplantilla: selectedTemplateId,
          actividad_ids: selectedActivityIds,
        }),
      });

      if (response.ok) {
        alert('Certificado enviado con éxito');
        enviarDatos();
      } else {
        alert('Error al enviar certificado');
        enviarDatos();
      }
    } catch (error) {
      console.error('Error al enviar certificado:', error);
    }
  };

  const enviarDatos = () => {
    console.log(selectedTemplateId);
    console.log(selectedActivityIds);
  }
  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 p-6">
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
        <div className="flex justify-between items-start gap-8 mb-8">
          {/* Actividades */}
          {activities.length > 0 && (
            <div className='w-[60%]'>
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
                      <td className="py-2">{activity.actividad.name}</td>
                      <td className="py-2 text-center">
                        <Checkbox
                          checked={selectedActivityIds.includes(activity.id)}
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
            <div className='w-[40%]'>
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
                      <tr key={template.idplantilla} className="border-b border-gray-700">
                        <td className="py-2">{template.idplantilla}</td>
                        <td className="py-2">{template.nombre}</td>
                        <td className="py-2 text-center">
                          <RadioGroupItem
                            value={template.idplantilla.toString()}
                            checked={selectedTemplateId === template.idplantilla}
                          />
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
          <Button size="lg"
          onClick={enviarCertificado}
          >Brindar Certificado</Button>
        </div>
      </div>
    </div>
  );
}
