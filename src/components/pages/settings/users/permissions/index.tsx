import { Collapse, Switch, Typography } from 'antd';
import { PERMISSION_NAMES, PERMISSIONS, PermissionsType } from './data-and-types';

type Props = {
  value: PermissionsType;
  onPermissionsChange: React.Dispatch<React.SetStateAction<PermissionsType>>;
};

const Permissions = ({ onPermissionsChange = () => null, value: permissions }: Props) => {
  return (
    <div className="flex w-full">
      <Collapse
        className="w-full"
        items={Object.keys(PERMISSIONS || {}).map(pkey => {
          const currentPermission = (permissions as any)[pkey];
          return {
            key: `${pkey}`,
            label: (PERMISSION_NAMES as any)[pkey],
            children: (
              <div className="flex flex-col gap-2">
                {Object.entries((PERMISSIONS as any)[pkey] || {})?.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Typography.Text>{(PERMISSION_NAMES as any)[key]}</Typography.Text>
                    <Switch
                      value={currentPermission?.[key]}
                      onChange={newValue => {
                        onPermissionsChange(prev => {
                          return {
                            ...prev,
                            [pkey]: {
                              ...prev[pkey],
                              [key]: newValue,
                            },
                          };
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            ),
          };
        })}
      />
    </div>
  );
};

export default Permissions;
