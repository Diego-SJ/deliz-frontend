import { Product } from '@/redux/reducers/products/types';
import { addDays, format, formatDistance, isValid, subDays, subHours } from 'date-fns';
import { es } from 'date-fns/locale';
import numeral from 'numeral';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Importar el idioma español

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.locale('es');

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
  number: (number?: string | number) => {
    return numeral(number).format('0,0');
  },
  formatToLocal: (dateStr: string | Dayjs): Dayjs => {
    const date = dayjs.utc(dateStr);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);
    return localDate;
  },
  formatToLocalTimezone(dateStr: string): string {
    const date = dayjs.utc(dateStr);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);

    return localDate.format('D [de] MMMM [del] YYYY, h:mma');
  },
  formatToLocalTimezoneShort(dateStr: string): string {
    const date = dayjs.utc(dateStr);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);

    return localDate.format('D [de] MMMM [del] YYYY, h:mma');
  },
  date: (dateStr: Date | string) => {
    if (!dateStr) return '- - -';
    const date = dayjs.utc(dateStr?.toString());
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);
    return localDate.format('D MMMM, YYYY');
  },
  date1: (date: Date | string) => {
    let [_date] = new Date(date).toLocaleString()?.split(',');
    if (!isValid(new Date(_date))) return _date;
    return format(new Date(_date), 'PPP', { locale: es });
  },
  tableDate: (dateStr: Date | string | null) => {
    if (!dateStr) return '- - -';
    const date = dayjs.utc(dateStr?.toString());
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);

    return localDate.format('D MMMM, YYYY h:mma');
  },
  dateTime: (date: Date | string) => {
    let _date = subHours(new Date(date), 6);
    return format(new Date(_date), 'PPp', { locale: es });
  },
  fullDateTime: (date: Date | string) => {
    let _date = subHours(new Date(date), 6);
    return format(new Date(_date), 'PPPPpp', { locale: es });
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
    let date1 = format(new Date(date), 'P');
    let date2 = format(addDays(new Date(startDate), 1), 'P');
    return date1 >= date2;
  },
  dateBefore: (date: Date | string, endDate: Date | string): boolean => {
    let date1 = format(new Date(date), 'P');
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

    // Construir un patrón de expresión regular para buscar value2 en cualquier lugar de value1
    return normalizedValue1?.includes(normalizedValue2);
  },
  normalizeText: (text: string) => {
    let newText = text?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
    return newText?.replace(/[^\w\s]/gi, '') || '';
  },
  getTagColor: (frase: string) => {
    if (frase === 'empty') return 'default';
    const hash = frase.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colores = ['green', 'volcano', 'gold', 'magenta', 'red', 'orange', 'cyan', 'blue', 'geekblue', 'purple'];
    return colores[hash % colores.length];
  },
  getCode: (product: Product) => {
    let words = product?.description?.split(' ');
    let code = '';
    code = words?.map(word => word[0])?.join('') || '';
    code += product?.size_id;
    code += product?.category_id;
    return code?.toUpperCase();
  },
  datesAreEquals: (date1?: string | Date | null, date2?: string | Date | any) => {
    if (!date1 || !date2) return false;
    return format(new Date(date1), 'PP') === format(new Date(date2), 'PP');
  },
  getRoundedValues(x: number): [number, number, number] {
    const roundedToBase50 = Math.ceil(x / 50) * 50;
    let roundedToBase100 = Math.ceil(x / 100) * 100;

    // Si el resultado de base 50 es igual al resultado de base 100, incrementar el de base 100 en 100 unidades
    if (roundedToBase50 === roundedToBase100) {
      roundedToBase100 += 100;
    }

    return [x, roundedToBase50, roundedToBase100];
  },
  sleep: async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  extractUUID(input: string): string | null {
    const inputString = String(input);

    // Expresión regular para extraer solo el UUID
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    // Extraer el UUID del string
    const match = inputString.match(uuidRegex);

    if (match) {
      return match[0]; // Retorna el UUID encontrado
    } else {
      return null; // Retorna null si no se encuentra un UUID
    }
  },
};

export default functions;
