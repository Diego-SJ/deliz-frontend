import { Menu } from 'antd';
import styled from 'styled-components';

export const MenuRoot = styled(Menu)`
  &.ant-menu {
    padding: 15px 20px 0;
    border-right: none;

    &.bottom {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 20px 20px 80px;
    }

    li.ant-menu-item {
      padding: 0 16px !important;
      border-radius: 10px;
      color: ${({ theme }) => theme.colors.tertiary};
      transition: border-color 0.3s, background 0.3s, box-shadow 0.4s, padding 0.1s cubic-bezier(0.215, 0.61, 0.355, 1) !important;

      .anticon {
        font-size: 20px;
      }

      .ant-menu-title-content {
        margin-left: 20px;
        font-size: 16px;
      }

      &.ant-menu-item-selected {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.background.primary};
        box-shadow: 0 0 13px 0px #776afb;
      }

      ::after {
        content: unset;
      }
    }
  }
`;
