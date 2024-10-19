import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export type DateRangeKey = 'historical' | 'today' | 'last_7_days' | 'this_month' | 'last_month' | 'custom';

export function getDateRange(key: DateRangeKey, customRange?: (string | null)[]): [string, string, string[]] {
  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  const now = dayjs().tz('America/Mexico_City'); // Usa la zona horaria deseada

  switch (key) {
    case 'today':
      startDate = now.startOf('day').utc();
      endDate = now.endOf('day').subtract(1, 'day').utc();
      break;
    case 'last_7_days':
      startDate = now.subtract(6, 'days').startOf('day').utc();
      endDate = now.subtract(1, 'day').endOf('day').utc();
      break;
    case 'this_month':
      startDate = now.startOf('month').startOf('day').utc();
      endDate = now.subtract(1, 'day').endOf('day').utc();
      break;
    case 'last_month':
      startDate = now.subtract(1, 'month').startOf('month').startOf('day').utc();
      endDate = now.subtract(1, 'month').endOf('month').subtract(1, 'day').endOf('day').utc();
      break;
    case 'custom':
      if (customRange && customRange[0] && customRange[1]) {
        startDate = dayjs(customRange[0]).startOf('day').utc();
        endDate = dayjs(customRange[1]).subtract(1, 'day').endOf('day').utc();
      } else {
        startDate = now.subtract(6, 'days').startOf('day').utc();
        endDate = now.subtract(1, 'day').endOf('day').utc();
      }
      break;
    default:
      startDate = now.subtract(6, 'days').startOf('day').utc();
      endDate = now.subtract(1, 'day').endOf('day').utc();
      break;
  }

  // Asegura que las horas sean siempre 00:00:00.000 y 23:59:59.999 en UTC
  startDate = startDate.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
  endDate = endDate.set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999);

  // Generar el array de fechas en formato 'YYYY-MM-DD'
  const dateList: string[] = [];
  let currentDate = startDate.clone();

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    let nextDay = currentDate.format('YYYY-MM-DD');
    dateList.push(nextDay);
    currentDate = currentDate.add(1, 'day');
  }

  // Retorna las fechas en formato ISO con la "Z" indicando UTC y el array de fechas en formato 'YYYY-MM-DD'
  return [startDate.toISOString(), endDate.toISOString(), dateList];
}

export const formatAxisBottom = (e: string, totalItems: number) => {
  if (totalItems <= 2) {
    return dayjs(e).format('dddd D MMMM');
  }

  if (totalItems <= 7) {
    return dayjs(e).format('dd D MMM');
  }

  return dayjs(e).format('D');
};

export const formatAxisBottomLabel = (range: DateRangeKey, totalItems?: number) => {
  if (totalItems && totalItems <= 7) {
    return 'Día';
  }

  switch (range) {
    case 'today':
      return 'Hoy';
    case 'last_7_days':
      return 'Día';
    case 'this_month':
      return dayjs().format('MMMM, YYYY');
    case 'last_month':
      return dayjs().subtract(1, 'month').format('MMMM, YYYY');
    case 'custom':
      return 'Día';
    default:
      return 'Día';
  }
};
