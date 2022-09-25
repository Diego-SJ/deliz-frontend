import styled from 'styled-components';

export const PopoverBody = styled.ul`
  list-style: none;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 220px;
`;

export const IconItem = styled.div`
  display: flex;
  column-gap: 15px;
  padding: 8px 5px;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.colors.tertiary};
  cursor: pointer;

  .anticon,
  .ant-typography {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.tertiary};
    transition: color 0.2s;
  }

  .ant-typography {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
  }

  &.danger {
    &:hover {
      .anticon,
      .ant-typography {
        color: ${({ theme }) => theme.colors.danger};
      }
    }
  }

  &:hover {
    .anticon,
    .ant-typography {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
