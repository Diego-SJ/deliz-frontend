import styled from 'styled-components';

export const PopoverItemRoot = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;
