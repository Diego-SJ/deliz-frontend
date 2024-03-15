import styled from 'styled-components';

export const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  padding: 10px;
  transition: all 0.2s ease-in-out;

  .ant-typography {
    font-size: 12px;
    margin-top: 5px;
  }

  &:hover {
    box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.2);
    border: 1px solid ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

export const ContainerItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  .total-products {
    margin-top: 15px;
    padding-left: 8px;
    width: 100%;
    text-align: left;
    font-weight: 700;
  }
`;
