import styled from 'styled-components';

export const PopoverHeader = styled.div`
  height: 40px;
  min-width: 400px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};

  .ant-typography {
    margin: 0;
  }

  span.ant-typography {
    font-weight: 500;
  }

  a.ant-typography {
    font-weight: 300;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PopoverBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  overflow: auto;
`;

export const PopoverFooter = styled.div`
  height: 40px;
  min-width: 400px;
  display: flex;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.background.secondary};

  a.ant-typography {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.secondary};

    &:hover {
      text-decoration: underline;
    }
  }
`;
