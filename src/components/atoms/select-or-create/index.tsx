import functions from '@/utils/functions';
import { LoadingOutlined } from '@ant-design/icons';
import { Select, SelectProps } from 'antd';
import { Plus } from 'lucide-react';
import { FC, memo, useState } from 'react';

interface Props extends SelectProps {
  onCreate?: (value: string) => Promise<void>;
}

const SelectOrCreate: FC<Props> = ({ onCreate, ...props }) => {
  const [hasNoResults, setHasNoResults] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (onCreate && !loading) {
      setLoading(true);
      try {
        await onCreate(searchValue);
        setSearchValue('');
        setHasNoResults(false);
      } catch (error) {
        console.error(error);
        // Optionally, handle the error state
      } finally {
        setLoading(false);
      }
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    const matches = props.options?.filter((option) => functions.includes(option?.label?.toString(), value));
    setHasNoResults(!matches || matches.length === 0);
  };

  const renderDropdown = (menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => {
    if (hasNoResults) {
      return (
        <button
          className="w-full flex py-1 px-3 justify-between hover:bg-slate-100 cursor-pointer"
          onClick={handleCreate}
        >
          <span>{searchValue}</span>
          {loading ? <LoadingOutlined /> : <Plus className="w-4" />}
        </button>
      );
    }
    return menu;
  };

  return (
    <Select
      {...props}
      dropdownRender={(menu) => renderDropdown(menu)}
      showSearch
      optionFilterProp="children"
      virtual={false}
      onSearch={onSearch}
      filterOption={(input, option) => functions.includes(option?.label?.toString(), input)}
    />
  );
};

export default memo(SelectOrCreate);
