import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { AdvisorRow } from '../../types';

export const exportAdvisorsToExcel = async (data: AdvisorRow[], fileName = 'Reporte_Asesores.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Asesores');

  // Define Columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Asesor', key: 'nombre', width: 30 },
    { header: 'Atendidas Cerradas', key: 'conversacionesAtendidasCerradas', width: 25 },
    { header: 'Totales', key: 'conversacionesTotales', width: 20 },
    { header: 'Menores 3 Min', key: 'conversacionesMenores3Min', width: 20 },
    { header: '% Menores 3 Min', key: 'porcentajeMenores3Min', width: 20 },
  ];

  // Add Data
  data.forEach((row) => {
    worksheet.addRow({
      ...row,
      porcentajeMenores3Min: `${row.porcentajeMenores3Min.toFixed(2)}%`,
    });
  });

  // Style Header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E4EA' }, // brand.surfaceContainerHigh
  };

  // Generate and Save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};
