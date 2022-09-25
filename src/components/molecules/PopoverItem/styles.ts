import styled from 'styled-components';

export const PopoverItemRoot = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 32px;
  padding: 10px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};

  .ant-typography {
    &.avatar-subtitle {
      width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.time-distance {
      color: ${({ theme }) => theme.colors.tertiary};
      align-self: flex-start;
      opacity: 0.7;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;
