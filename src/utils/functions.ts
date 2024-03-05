import { addDays, format, formatDistance, isValid, subDays, subHours } from 'date-fns';
import { es } from 'date-fns/locale';
import numeral from 'numeral';

const functions = {
  distanceTime: (date: Date): string => {
    return formatDistance(date, new Date(), { addSuffix: true });
  },
  distanceTime2: (date: Date): string => {
    return formatDistance(date, new Date(), { addSuffix: true });
  },
  distanceTime3: (date: Date): string => {
    return formatDistance(date, new Date(), { addSuffix: true });
  },
  distanceTime4: (date: Date): string => {
    return formatDistance(date, new Date(), { addSuffix: true });
  },
  money: (number?: string | number) => {
    return numeral(number).format('$0,0.00');
  },
  moneySimple: (number: string | number) => {
    return numeral(number).format('$0.0');
  },
  date: (date: Date | string) => {
    let [year, month, day] = (date + '')?.split('-');
    let _date = `${month}/${day}/${year}`;
    return format(new Date(_date), 'PP', { locale: es });
  },
  date1: (date: Date | string) => {
    let [_date] = new Date(date).toLocaleString()?.split(',');
    if (!isValid(new Date(_date))) return _date;
    return format(new Date(_date), 'PPP', { locale: es });
  },
  tableDate: (date: Date | string) => {
    // let [_date] = new Date(date).toLocaleString();
    if (!!!date) return '- - -';
    return format(new Date(date), 'PPp', { locale: es });
  },
  dateTime: (date: Date | string) => {
    let _date = subHours(new Date(date), 6);
    return format(new Date(_date), 'PPp', { locale: es });
  },
  currentDate: () => {
    let _date = new Date();
    return format(new Date(_date), 'PPp', { locale: es });
  },
  betweenDates: (date: Date | string, startDate: Date | string, endDate: Date | string): boolean => {
    let _date = new Date(date)?.toLocaleString()?.split(',')[0];

    let date1 = format(subDays(new Date(_date), 1), 'P');
    let date2 = format(addDays(new Date(startDate), 1), 'P');
    let date3 = format(addDays(new Date(endDate), 1), 'P');
    return date1 >= date2 && date1 <= date3;
  },
  dateAfter: (date: Date | string, startDate: Date | string): boolean => {
    let _date = new Date(date)?.toLocaleString()?.split(',')[0];

    let date1 = format(subDays(new Date(_date), 1), 'P');
    let date2 = format(addDays(new Date(startDate), 1), 'P');
    return date1 >= date2;
  },
  dateBefore: (date: Date | string, endDate: Date | string): boolean => {
    let _date = new Date(date)?.toLocaleString()?.split(',')[0];

    let date1 = format(subDays(new Date(_date), 1), 'P');
    let date2 = format(addDays(new Date(endDate), 1), 'P');
    return date1 <= date2;
  },
  removeBucketURL: (path: string, bucket: string) => {
    let filename = path.replace(bucket, '');
    return filename;
  },
  includes: function (value1 = '', value2 = '') {
    // Normalizar los textos para eliminar acentos
    const normalizedValue1 = this.normalizeText(value1)?.toLowerCase();
    const normalizedValue2 = this.normalizeText(value2)?.toLowerCase();

    console.log('normalizedValue1', normalizedValue1);
    console.log('normalizedValue2', normalizedValue2);

    // Escape de caracteres especiales en value2
    const escapedValue2 = normalizedValue2?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    console.log('escapedValue2', escapedValue2);
    // Construir un patrón de expresión regular para buscar value2 en cualquier lugar de value1
    const pattern = new RegExp(`\\b${escapedValue2?.replace(/ /g, '\\b|\\b')}\\b`, 'i');
    // Verificar si el patrón coincide con value1
    return pattern?.test(normalizedValue1);
  },
  normalizeText: (text: string) => {
    return text?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
  },
  getTagColor: (frase: string) => {
    const hash = frase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colores = ['green', 'volcano', 'gold', 'magenta', 'red', 'orange', 'lime', 'cyan', 'blue', 'geekblue', 'purple'];
    return colores[hash % colores.length];
  },
};

export default functions;
