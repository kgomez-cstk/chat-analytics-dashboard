import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AdvisorRow } from '../../types';

export const exportAdvisorsToPdf = (data: AdvisorRow[], fileName = 'Reporte_Asesores.pdf') => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Reporte de Desempeño por Asesor', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

  const tableData = data.map((row) => [
    row.id,
    row.nombre,
    row.conversacionesAtendidasCerradas,
    row.conversacionesTotales,
    row.conversacionesMenores3Min,
    `${row.porcentajeMenores3Min.toFixed(2)}%`,
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['ID', 'Asesor', 'Atendidas', 'Totales', '< 3 Min', '% < 3 Min']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 83, 219] }, // brand.primary
    didDrawPage: (data) => {
      doc.setFontSize(10);
      doc.text(
        `Página ${data.pageNumber}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save(fileName);
};
