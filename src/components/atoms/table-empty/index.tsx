import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';

type TableEmptyProps = {
  title?: string;
  onAddNew?: () => void;
  margin?: 'small' | 'medium' | 'large';
};

const TableEmpty = ({ onAddNew, title, margin = 'large' }: TableEmptyProps) => {
  return (
    <Empty
      description={title || 'No hay datos para mostrar'}
      className={margin === 'large' ? 'mt-20 mb-28' : 'mt-10 mb-14'}
    >
      {onAddNew && (
        <Button onClick={() => onAddNew()} icon={<PlusCircleOutlined />}>
          Agregar nuevo
        </Button>
      )}
    </Empty>
  );
};

export default TableEmpty;
