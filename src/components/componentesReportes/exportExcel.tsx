'use client'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Gestión RSU');

  // Encabezados de las columnas
  worksheet.columns = [
    { header: 'CÓDIGO INFORME', key: 'codigo', width: 20 },
    { header: 'ACTIVIDAD', key: 'actividad', width: 50 },
    { header: 'OBJETIVO DE LA ACTIVIDAD', key: 'objetivo', width: 30 },
    { header: 'TIPO DE ACTIVIDAD DE RSU', key: 'tipo', width: 25 },
    { header: 'FUENTE', key: 'fuente', width: 15 },
    { header: 'ÁMBITO / ALCANCE', key: 'ambito', width: 20 },
    { header: 'BENEFICIARIOS', key: 'beneficiarios', width: 25 },
    { header: 'NÚMERO BENEFICIARIOS', key: 'numero', width: 15 },
  ];

  // Agregar datos
  const data = [
    {
      codigo: 'OD-RS-0001',
      actividad: 'Campaña de salud dental al público en general',
      objetivo: 'Concientizar sobre las enfermedades',
      tipo: 'RSU - Extensión Cultural',
      fuente: 'Plan Escuela',
      ambito: 'Ámbito Externo',
      beneficiarios: 'Público en general',
      numero: 100,
    },
    {
      codigo: 'IA-RP-0002',
      actividad: 'Inventario de infraestructura hidráulica',
      objetivo: 'Medir las áreas de la infraestructura',
      tipo: 'RSU - Proyección Social',
      fuente: 'Sílabo',
      ambito: 'Ámbito Externo',
      beneficiarios: 'Comunidad X Estudiantes UNA',
      numero: 300,
    },
    // Más filas...
  ];

  data.forEach((row) => worksheet.addRow(row));

  // Estilo de encabezados
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCCCCC' },
  };

  // Guardar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'gestion_rsu.xlsx');
};

export default function App(): JSX.Element {
  return (
    <div className="p-5">
      <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
      >
        Exportar a Excel con Estilos
      </button>
    </div>
  );
}
