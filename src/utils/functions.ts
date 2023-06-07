import { format, formatDistance } from 'date-fns';
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
  date1: (date: Date | string) => {
    let [_date, time] = new Date(date).toLocaleString()?.split(',');
    return format(new Date(_date), 'PPP') + ' ' + _date;
  },
  removeBucketURL: (path: string, bucket: string) => {
    let filename = path.replace(bucket, '');
    return filename;
  },
  includes: (value1 = '', value2 = '') => {
    return value1?.toLowerCase()?.includes(value2?.toLowerCase());
  },
};

export default functions;
