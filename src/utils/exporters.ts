import { saveAs } from 'file-saver';

// ─────────────────────────────────────────────────────────────────────────────
// Protocolo de serialización para Worker (zero-copy transfer)
//
// El problema de memory spikes:
//   postMessage(array) → hace un "structured clone" del array completo
//   Para 107k filas × 15 columnas → duplica ~100-200 MB de RAM temporalmente
//   Y bloquea el hilo principal mientras clona.
//
// La solución:
//   Serializar los datos a un ArrayBuffer (string UTF-8 compacto).
//   Enviar con transfer: [buffer] → ZERO-COPY, sin clonar, sin RAM extra.
//   El worker recibe el mismo bloque de memoria, sin duplicados.
// ─────────────────────────────────────────────────────────────────────────────
const R = '\x1E'; // ASCII 30: Record Separator  – nunca aparece en texto de UI
const C = '\x1F'; // ASCII 31: Unit Separator    – nunca aparece en texto de UI

/** Limpia el valor y elimina los separadores internos si existieran */
const encode = (v: any) =>
  (v == null ? '' : String(v)).replace(/[\x1E\x1F]/g, '');

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────────────────────

const cleanControlChars = (v: any) => {
  if (v == null) return '';
  let str = String(v).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

  // Limpieza de teléfonos: remover '+' y espacios (iniciales o intermedios)
  // Solo si el resultado final son solo dígitos (números de teléfono puros)
  if (str.includes('+') || str.includes(' ')) {
    const cleaned = str.replace(/\+/g, '').replace(/\s/g, '');
    if (cleaned !== '' && /^\d+$/.test(cleaned)) {
      str = cleaned;
    }
  }
  return str;
};

const getTimestampedFilename = (prefix: string) => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${prefix}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

function formatCapitalizedText(groupByField: string): string {
  return groupByField
    .replace(/_/g, ' ')
    .replace(/\\w\\S*/g, (word) => {
      const p = word.toLowerCase();
      if (p === 'campania') return 'Campaña';
      return p.charAt(0).toUpperCase() + p.slice(1);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Comunicación con el Web Worker
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envía un ArrayBuffer (zero-copy) al Worker y gestiona la respuesta.
 * @param buffer  Datos ya serializados con el protocolo R/C
 * @param sheetName Nombre de la hoja en el XLSX
 * @param filename  Nombre de descarga sin extensión
 * @param onEnd   Callback al terminar (éxito o error)
 */
const generateXlsxViaWorker = (
  buffer: ArrayBufferLike,
  sheetName: string,
  filename: string,
  onEnd: () => void,
  hasLevels: boolean = false
) => {
  try {
    const worker = new Worker(
      new URL('../workers/xlsxWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = ({ data }) => {
      worker.terminate();
      if (data.success) {
        const blob = new Blob([data.buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `${filename}.xlsx`);
      } else {
        console.error('[xlsxWorker] Error:', data.error);
      }
      onEnd();
    };

    worker.onerror = (err) => {
      console.error('[xlsxWorker] Error en Worker thread:', err);
      worker.terminate();
      onEnd();
    };

    // ★ transfer: [buffer] — el buffer se MUEVE al worker sin copiar RAM
    worker.postMessage({ buffer, sheetName, hasLevels }, [buffer]);

  } catch (error) {
    console.error('[xlsxWorker] No se pudo inicializar el Worker:', error);
    onEnd();
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// Exportaciones: Reporte General (tabla completa con columnas configurables)
// ─────────────────────────────────────────────────────────────────────────────

export const exportToXLSX = (
  data: any[],
  columns: { accessorKey: string; header: string }[],
  filenamePrefix: string,
  showToastAlert: any,
  onStart?: () => void,
  onEnd?: () => void,
  rowLevelFn?: (row: any) => number
) => {
  if (!data?.length) {
    showToastAlert({ title: 'Descarga Excel', description: 'No hay registros disponibles para exportar.', status: 'info' });
    return;
  }
  onStart?.();

  // Delay 50ms para que la UI renderice el spinner antes de cualquier trabajo pesado
  setTimeout(() => {
    const headers = columns.map((col) => col.header);
    const keys = columns.map((col) => col.accessorKey);

    // Serializar directamente a string sin crear un array 2D intermedio
    const headerRow = headers.map(encode);
    if (rowLevelFn) headerRow.push('0'); // Nivel 0 para el header
    const rows: string[] = [headerRow.join(C)];

    for (const item of data) {
      const rowArr = keys.map((k) => encode(item[k]));
      if (rowLevelFn) rowArr.push(encode(rowLevelFn(item)));
      rows.push(rowArr.join(C));
    }

    // TextEncoder → ArrayBuffer (UTF-8, ~20-30 MB para 107k filas)
    const buffer = new TextEncoder().encode(rows.join(R)).buffer;

    const filename = getTimestampedFilename(filenamePrefix.toLowerCase());
    generateXlsxViaWorker(buffer, 'Datos', filename, () => onEnd?.(), !!rowLevelFn);
  }, 50);
};

export const exportToCSV = (
  data: any[],
  columns: { accessorKey: string; header: string }[],
  filenamePrefix: string,
  showToastAlert: any,
  onStart?: () => void,
  onEnd?: () => void
) => {
  if (!data?.length) {
    showToastAlert({ title: 'Descarga CSV', description: 'No hay registros disponibles para exportar.', status: 'info' });
    return;
  }
  onStart?.();
  setTimeout(() => {
    try {
      const headers = columns.map((col) => col.header);
      const keys = columns.map((col) => col.accessorKey);
      const csv = [
        headers.join(','),
        ...data.map((row) =>
          keys.map((key) => `"${cleanControlChars(row[key]).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(',')
        ),
      ].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${getTimestampedFilename(filenamePrefix.toLowerCase())}.csv`);
    } finally {
      onEnd?.();
    }
  }, 50);
};
