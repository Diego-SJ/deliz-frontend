import React, { useMemo, useState } from 'react';
import { Checkbox, Button } from 'antd';
import { PERMISSION_NAMES, PermissionsType } from './data-and-types';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
const { Group: CheckboxGroup } = Checkbox;

type Props = {
  value: PermissionsType;
  onPermissionsChange: React.Dispatch<React.SetStateAction<PermissionsType>>;
};

const PermissionsGrouped: React.FC<Props> = ({
  value,
  onPermissionsChange,
}) => {
  // Derivamos los ítems seleccionados del prop 'value'
  const checkedItems = useMemo(() => {
    const result: { [key: string]: string[] } = {};
    for (const category in value) {
      const subPermissions = value[category];
      const checkedSubPermissions = Object.keys(subPermissions).filter(
        (subPermission) => subPermissions[subPermission].value,
      );
      result[category] = checkedSubPermissions;
    }
    return result;
  }, [value]);

  // Estado para manejar la expansión/colapso de categorías
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    for (const category in value) {
      initialExpanded[category] = true; // Por defecto, todas expandidas
    }
    return initialExpanded;
  });

  // Computar si todas las categorías están expandidas o colapsadas
  const allExpanded = Object.values(expandedCategories).every(Boolean);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAllCategories = () => {
    const newExpandedState = !allExpanded;
    const newExpandedCategories: { [key: string]: boolean } = {};
    for (const category in value) {
      newExpandedCategories[category] = newExpandedState;
    }
    setExpandedCategories(newExpandedCategories);
  };

  const handleGroupChange = (category: string, list: string[]) => {
    // Actualizamos el objeto de permisos
    const newPermissions = { ...value };
    const subPermissions = newPermissions[category];

    const newSubPermissions: { [key: string]: { value: boolean } } = {};

    for (const subPermission in subPermissions) {
      newSubPermissions[subPermission] = {
        ...subPermissions[subPermission],
        value: list.includes(subPermission),
      };
    }

    newPermissions[category] = newSubPermissions;
    onPermissionsChange(newPermissions);
  };

  const handleCheckAllChange = (category: string, e: CheckboxChangeEvent) => {
    const newPermissions = { ...value };
    const subPermissions = newPermissions[category];

    const checkAll = e.target.checked;

    const newSubPermissions: { [key: string]: { value: boolean } } = {};

    for (const subPermission in subPermissions) {
      newSubPermissions[subPermission] = {
        ...subPermissions[subPermission],
        value: checkAll,
      };
    }

    newPermissions[category] = newSubPermissions;
    onPermissionsChange(newPermissions);
  };

  return (
    <>
      <div className="flex justify-end p-2">
        <Button onClick={toggleAllCategories}>
          {allExpanded ? 'Colapsar' : 'Expandir'}
        </Button>
      </div>
      <div className="border rounded-xl overflow-hidden">
        {/* Botón para colapsar o expandir todas las categorías */}

        {Object.keys(value).map((category, index) => {
          const subPermissions = value[category];
          const options = Object.keys(subPermissions).map((key) => ({
            label:
              PERMISSION_NAMES[key as keyof typeof PERMISSION_NAMES] || key,
            value: key,
          }));

          const checkedList = checkedItems[category] || [];
          const checkAll = options.length === checkedList.length;
          const indeterminate =
            checkedList.length > 0 && checkedList.length < options.length;

          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="w-full">
              <div
                className={`flex gap-5 cursor-pointer bg-gray-50 hover:bg-gray-100 items-center justify-between pl-5 ${isExpanded ? 'border-b' : ''} ${
                  index === 0 ? '' : 'border-t'
                }`}
              >
                <Checkbox
                  indeterminate={indeterminate}
                  className="min-w-fit select-none"
                  onChange={(e) => handleCheckAllChange(category, e)}
                  checked={checkAll}
                >
                  {PERMISSION_NAMES[category as keyof typeof PERMISSION_NAMES]}
                </Checkbox>
                <div
                  className="flex items-center justify-end gap-2 py-4 pr-5 w-full select-none"
                  onClick={() => toggleCategory(category)}
                >
                  <span>{isExpanded ? '−' : '+'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5">
                  <CheckboxGroup
                    options={options}
                    className="grid grid-cols-2"
                    value={checkedList}
                    onChange={(list) =>
                      handleGroupChange(category, list as string[])
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PermissionsGrouped;
