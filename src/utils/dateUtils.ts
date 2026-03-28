/**
 * Date utility functions
 */

export const getFechasDia = (offsetHoras: number) => {
  const nowUTC = new Date();
  const local = new Date(nowUTC.getTime() + offsetHoras * 60 * 60 * 1000);

  const yyyy = local.getFullYear();
  const mm = String(local.getMonth() + 1).padStart(2, '0');
  const dd = String(local.getDate()).padStart(2, '0');

  return {
    inicio: `${yyyy}-${mm}-${dd}T00:00`,
    fin: `${yyyy}-${mm}-${dd}T23:59`,
  };
};

export const convertDateOnlyToDateTime = (
  dateStr: string,
  type: 'start' | 'end'
): string => {
  if (dateStr.includes('T')) return dateStr;
  return type === 'start' ? `${dateStr}T00:00` : `${dateStr}T23:59`;
};

export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ];
  return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
