import { formatDistance } from 'date-fns';

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
};

export default functions;
