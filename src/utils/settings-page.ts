import {
  PERMISSIONS,
  PERMISSIONS_DENIED,
} from '@/components/pages/settings/users/permissions/data-and-types';
import _ from 'lodash';

let clonedPermissions = _.cloneDeep(PERMISSIONS_DENIED);

export const finalPermissions = (permissions?: typeof PERMISSIONS | null) => {
  let userPermissions = _.cloneDeep(permissions);
  return _.mergeWith(
    {},
    clonedPermissions,
    userPermissions,
    (objValue, srcValue) => {
      if (_.isPlainObject(objValue) && _.isPlainObject(srcValue)) {
        if ('value' in objValue && 'value' in srcValue) {
          // Comparar y sobrescribir la propiedad 'value' si es diferente
          return objValue.value !== srcValue.value
            ? { ...objValue, value: srcValue.value }
            : objValue;
        } else {
          // Continuar la combinación profunda
          return undefined;
        }
      } else {
        // Para valores primitivos, usar el valor de srcValue
        return srcValue;
      }
    },
  );
};
