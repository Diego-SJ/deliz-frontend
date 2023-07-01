import styled from 'styled-components';

export const HeaderTitleContainer = styled.div`
  display: flex;
  margin: -20px 20px 0px;
  align-items: center;

  & .ant-typography span {
    color: ${({ theme }) => theme.colors.primary} !important;
  }
`;

export const CategoryContainer = styled.div`
  min-width: 100vw;
  max-width: 100vw;
  overflow: auto;
  display: flex;
  gap: 20px;
  scroll-behavior: smooth;
  padding: 20px;
`;

export const CardCategory = styled.div`
  width: 100%;
  min-height: 350px;
  min-width: 280px;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s linear;
  cursor: pointer;

  img {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translate(-63%, 0) rotate(-10deg);
    scale: 0.8;
    transition: all 0.2s linear;
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
  }

  .ant-typography {
    position: absolute;
    bottom: 0;
    color: #ffffff;
    font-size: 18px;
    padding: 20px;
    display: inline-flex;
    width: 100%;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 170px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.005) 25%, rgba(0, 0, 0, 0.4) 100%);
      z-index: -1;
      transition: all 0.2s ease-in-out;
    }
  }

  &:hover {
    box-shadow: 0 0 15px 7px rgba(0, 0, 0, 0.2);

    .ant-typography {
      &::before {
        height: 300px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.003) 25%, rgba(0, 0, 0, 0.5) 100%);
      }
    }

    img {
      transform: translate(-50%, 0) rotate(10deg);
      scale: 1;
    }
  }

  /* @media screen and (max-width: ${({ theme }) => theme.breakPoints.sm}) {
    min-height: 350px;
    min-width: 300px;
  } */
`;

export const CardPopularproduct = styled.div`
  width: 100%;
  min-width: 300px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s linear;
  display: flex;
  cursor: pointer;

  & div.pp-image {
    width: 100px;
    height: 70px;
    border-radius: 10px;

    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
  }

  .pp-name {
    color: #000000;
    font-size: 18px;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
  }

  &:hover {
    box-shadow: 0 0 15px 7px rgba(0, 0, 0, 0.2);

    .ant-typography {
      &::before {
        height: 300px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.003) 25%, rgba(0, 0, 0, 0.5) 100%);
      }
    }

    img {
      transform: translate(-50%, 0) rotate(10deg);
      scale: 1;
    }
  }

  /* @media screen and (max-width: ${({ theme }) => theme.breakPoints.sm}) {
    min-height: 350px;
    min-width: 300px;
  } */
`;
