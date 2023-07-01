import styled from 'styled-components';

export const BottomMenuRoot = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 95%;
  min-width: max-content;
  height: 50px;
  transition: all 0.2s ease-in-out;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;

  padding: 30px 20px;
  border-radius: 35px;
  box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 99999999;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.background.primary};
  }

  & .ant-btn {
    transition: all 0.09s linear;
    position: relative;

    &.active {
      &::before {
        content: '';
        width: 5px;
        height: 5px;
        background-color: ${({ theme }) => theme.colors.primary};
        border-radius: 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        opacity: 1;
        transition: all 0.2s ease-in-out;
      }
    }

    &:hover {
      transform: scale(1.5);

      &.active {
        &::before {
          opacity: 0;
        }
      }
    }
  }

  &:hover {
    opacity: 1;
  }
`;
