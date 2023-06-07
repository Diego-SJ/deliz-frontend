import Avatar from '@/components/molecules/Avatar';
import { PROFILE_PIC } from '@/constants/mocks';
import { Divider, Space, Typography } from 'antd';
import { HeaderActions, HeaderRoot } from './styles';
import MenuPopover from '@/components/molecules/MenuPopover';

import { useTheme } from 'styled-components';

const CashierHeader = () => {
  const theme = useTheme();
  return (
    <HeaderRoot>
      <Typography.Title level={4}>Punto de venta</Typography.Title>
      <HeaderActions>
        <Divider type="vertical" />
        <Space size={50}>
          <Avatar avatar={{ src: PROFILE_PIC }} title="Diego Salas" subtitle="Admin" bordered />
          <MenuPopover />
        </Space>
      </HeaderActions>
    </HeaderRoot>
  );
};

export default CashierHeader;
