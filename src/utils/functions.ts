import { formatDistance } from 'date-fns';

const functions = {
  distanceTime: (date: Date): string => {
    return formatDistance(date, new Date(), { addSuffix: true });
  },
};

export default functions;
