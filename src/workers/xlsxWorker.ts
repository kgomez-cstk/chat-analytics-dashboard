import * as XLSX from 'xlsx';

self.onmessage = (e) => {
  try {
    const { buffer, sheetName, hasLevels } = e.data;
    
    // Decodificar el ArrayBuffer (string UTF-8)
    const text = new TextDecoder().decode(buffer);
    const R = '\x1E';
    const C = '\x1F';
    
    // Reconstruir el array 2D y procesar los niveles si aplica
    let rows: any[][];
    let rowLevels: number[] = [];

    if (hasLevels) {
      rows = text.split(R).map(rowStr => {
        const cells = rowStr.split(C);
        const level = parseInt(cells.pop() || '0', 10);
        rowLevels.push(level);
        return cells;
      });
    } else {
      rows = text.split(R).map(rowStr => rowStr.split(C));
    }
    
    // Usar la utilidad ultra rápida de SheetJS
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    if (hasLevels) {
      worksheet['!rows'] = rowLevels.map(lvl => ({ level: lvl }));
      // Configurar para que el "Summary" esté ARRIBA de los detalles (por defecto Excel lo pone abajo)
      worksheet['!outline'] = { below: false };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Datos');
    
    // Generar el buffer final de Excel (type 'array' devuelve ArrayBuffer)
    const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Transferir de vuelta al hilo principal sin copiar
    self.postMessage({ success: true, buffer: xlsxBuffer }, [xlsxBuffer]);
  } catch (error: any) {
    self.postMessage({ success: false, error: error.message });
  }
};
