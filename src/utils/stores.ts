import { STATUS_DATA } from '@/constants/status';
import { CompanyStore } from '@/redux/reducers/stores/types';

const timeFormat = 'HH:mm';

export const getStoreRecord = (values: any): Partial<CompanyStore> => {
  return {
    store_id: values?.store_id || null,
    company_id: values?.company_id || null,
    is_active: true,
    status_id: STATUS_DATA.ACTIVE.id,
    slug: values?.slug || null,
    logo_url: values?.logo_url || null,
    allow_orders_by_whatsapp: values?.allow_orders_by_whatsapp || false,
    delivery_types: {
      on_site: !!values?.deliveryOptions.includes('on_site'),
      take_away: !!values?.deliveryOptions.includes('take_away'),
      home_delivery: !!values?.deliveryOptions.includes('home_delivery'),
    },
    schedule: {
      monday: {
        closed: values?.scheduleChecks.includes('monday_closed'),
        from: values.monday_time?.[0].format(timeFormat) || null,
        to: values.monday_time?.[1].format(timeFormat) || null,
      },
      tuesday: {
        closed: values?.scheduleChecks.includes('tuesday_closed'),
        from: values.tuesday_time?.[0].format(timeFormat) || null,
        to: values.tuesday_time?.[1].format(timeFormat) || null,
      },
      wednesday: {
        closed: values?.scheduleChecks.includes('wednesday_closed'),
        from: values.wednesday_time?.[0].format(timeFormat) || null,
        to: values.wednesday_time?.[1].format(timeFormat) || null,
      },
      thursday: {
        closed: values?.scheduleChecks.includes('thursday_closed'),
        from: values.thursday_time?.[0].format(timeFormat) || null,
        to: values.thursday_time?.[1].format(timeFormat) || null,
      },
      friday: {
        closed: values?.scheduleChecks.includes('friday_closed'),
        from: values.friday_time?.[0].format(timeFormat) || null,
        to: values.friday_time?.[1].format(timeFormat) || null,
      },
      saturday: {
        closed: values?.scheduleChecks.includes('saturday_closed'),
        from: values.saturday_time?.[0].format(timeFormat) || null,
        to: values.saturday_time?.[1].format(timeFormat) || null,
      },
      sunday: {
        closed: values?.scheduleChecks.includes('sunday_closed'),
        from: values.sunday_time?.[0].format(timeFormat) || null,
        to: values.sunday_time?.[1].format(timeFormat) || null,
      },
    },
    social_media: {
      facebook: values?.facebook || null,
      instagram: values?.instagram || null,
      whatsapp: values?.whatsapp || null,
    },
    description: values?.description || null,
    email: values?.email || null,
    location_url: values?.location_url || null,
    phone: values?.phone || null,
    products: values?.products || null,
    wifi: {
      network: values?.network || null,
      password: values?.password || null,
    },
    name: values?.name || null,
  };
};
