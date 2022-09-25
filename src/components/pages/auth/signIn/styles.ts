import { Card } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import styled from 'styled-components';

export const LayoutContent = styled(Content)`
  min-width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  max-height: 100vh;

  display: grid;
  place-content: center;

  background: url('src/assets/img/backgrounds/sprinkle.svg');
  background-repeat: no-repeat;
  background-size: cover;
`;

export const FormContainer = styled(Card)`
  &.form-container {
    padding: 0;
    width: 100%;
    min-height: 60vh;
    min-width: 800px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.4);
    border: none;

    .ant-card-body {
      padding: 0;
      display: flex;
      height: 100%;

      .ant-form {
        width: 50%;
        height: 100%;
        padding: 50px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        &-item {
          width: 100%;
          margin-bottom: 10px;
        }

        .ant-btn {
          width: 100%;

          &-link {
            width: fit-content;
            padding: 0;
          }
        }

        .ant-typography {
          &.caption {
            width: 100%;
            text-align: center;
            margin: 10px 0 15px;
          }

          &-secondary {
            margin: 0 0 10px;
            text-align: start;
          }
        }
      }
    }
  }
`;

export const FormFigure = styled.div`
  width: 50%;
  height: 100%;
  padding: 50px;
  display: grid;
  place-content: center;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0.3;
  }
`;

export const FormFigureImg = styled.img`
  width: 100%;
`;
