import { Collapse, Switch, Typography } from 'antd';
import { PERMISSION_NAMES, PERMISSIONS, PermissionsType } from './data-and-types';
import { AppModules, useMembershipAccess } from '@/routes/module-access';

type Props = {
  value: PermissionsType;
  onPermissionsChange: React.Dispatch<React.SetStateAction<PermissionsType>>;
};

const Permissions = ({ onPermissionsChange = () => null, value: permissions }: Props) => {
  const { hasAccess } = useMembershipAccess();
  return (
    <div className="flex w-full">
      <Collapse
        className="w-full"
        items={
          Object.keys(PERMISSIONS || {})
            .map(pkey => {
              const currentPermission = (permissions as any)[pkey];
              if (!hasAccess(pkey as AppModules)) return null;
              return {
                key: `${pkey}`,
                label: (PERMISSION_NAMES as any)[pkey],
                children: (
                  <div className="flex flex-col gap-2 !select-none">
                    {Object.entries((PERMISSIONS as any)[pkey] || {})?.map(([subPermissionKey]) => {
                      return (
                        <div key={subPermissionKey} className="flex items-center justify-between">
                          <Typography.Text className="!select-none">
                            {(PERMISSION_NAMES as any)[subPermissionKey]}
                          </Typography.Text>
                          <Switch
                            value={currentPermission?.[subPermissionKey]?.value}
                            onChange={newValue => {
                              onPermissionsChange(prev => {
                                return {
                                  ...prev,
                                  [pkey]: {
                                    ...currentPermission,
                                    [subPermissionKey]: {
                                      value: newValue,
                                    },
                                  },
                                };
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ),
              };
            })
            ?.filter(p => !!p?.key) as any
        }
      />
    </div>
  );
};

export default Permissions;
