import { Product } from '@/redux/reducers/products/types';
import numeral from 'numeral';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { repeat } from 'lodash';

dayjs.extend(utc);

const functions = {
  money: (
    number: string | number | undefined,
    options?: { hidden?: boolean; digits?: number },
  ) => {
    if (options?.hidden) return `$${repeat('*', options?.digits || 5)}`;
    return numeral(number).format('$0,0.00');
  },
  moneySimple: (number: string | number) => {
    return numeral(number).format('$0.0');
  },
  number: (
    number: string | number | undefined,
    options?: { hidden?: boolean; digits?: number },
  ) => {
    if (options?.hidden) return `${repeat('*', options?.digits || 5)}`;
    return numeral(number).format('0,0');
  },
  formatToLocal: (dateStr: string | Dayjs): Dayjs => {
    const date = dayjs.utc(dateStr);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);
    return localDate;
  },
  formatToLocalTimezone(dateStr: string): string {
    return dayjs(dateStr).format('D [de] MMMM [del] YYYY, h:mma');
  },
  formatToLocalTimezoneShort(dateStr: string): string {
    const date = dayjs.utc(dateStr);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = date.tz(timeZone);

    return localDate.format('D [de] MMMM [del] YYYY, h:mma');
  },
  date: (dateStr: Date | string) => {
    if (!dateStr) return '- - -';
    return dayjs(dateStr).format('D MMMM, YYYY');
  },
  tableDate: (dateStr: Date | string | null) => {
    if (!dateStr) return '- - -';
    return dayjs.utc(dateStr?.toString()).format('D MMMM, YYYY h:mma');
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
    const hash = frase
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colores = [
      'green',
      'volcano',
      'gold',
      'magenta',
      'red',
      'orange',
      'cyan',
      'blue',
      'geekblue',
      'purple',
    ];
    return colores[hash % colores.length];
  },
  getCode: (product: Product) => {
    let words = product?.description?.split(' ');
    let code = '';
    code = words?.map((word) => word[0])?.join('') || '';
    code += product?.size_id;
    code += product?.category_id;
    return code?.toUpperCase();
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  extractUUID(input: string): string | null {
    const inputString = String(input);

    // Expresión regular para extraer solo el UUID
    const uuidRegex =
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

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
