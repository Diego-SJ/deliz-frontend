import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.locale('es');

const today = dayjs();
const startOfLastWeek = today.subtract(6, 'days');
export const formattedDateRange = `Del ${startOfLastWeek.format('D')} de ${startOfLastWeek.format('MMMM')} al ${today.format(
  'D',
)} de ${today.format('MMMM')}`;
