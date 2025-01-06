'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { BreadcrumbWithDropdown } from '@/components/breadcrumb';
//import { API_NOTIFICATIONS } from '@/config/apiconfig';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {BreadcrumbItemType} from '@/tipos/typos';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { dni, idrol, idsubuni } = useParams();
  const pathname = usePathname();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`api/${dni}`);
      if (!response.ok) {
        throw new Error('Error al obtener las notificaciones');
      }
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };

  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'notificaciones');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');

  //definimos valores para el breadCrumb
  const breadcrumbData:BreadcrumbItemType[] = [
    { type: 'link', label: 'Inicio', href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: 'page', label: 'Notificaciones' },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="w-[90%] mx-auto py-4 space-y-4 text-black dark:text-white min-h-screen">
      <div className="flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-10">
        Notificaciones
      </h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {notification.title}
              </CardTitle>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(notification.date).toLocaleDateString()}
              </span>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              {notification.message}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
