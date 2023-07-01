import { Card } from 'antd';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  min-width: 100vw;
  max-width: 100vw;
  overflow: auto;
  display: flex;
  justify-content: center;
  gap: 20px;
  scroll-behavior: smooth;
  padding: 20px;

  @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}) {
    justify-content: flex-start;
  }
`;

export const CategoryContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  .ant-avatar {
    margin-bottom: 10px;
    padding: 8px;
    background-color: transparent;
    border: 1px dashed ${({ theme }) => theme.colors.tertiary};
    transition: all 0.2s ease-in-out;
    min-width: 80px;
    max-width: 80px;
    min-height: 80px;
    max-height: 80px;
    z-index: 1;

    img {
      transition: all 0.2s ease-in-out;
    }

    @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}) {
      min-width: 60px;
      max-width: 60px;
      min-height: 60px;
      max-height: 60px;
    }

    &:before {
      transition: all 0.4s ease-in-out;
    }
  }

  .ant-typography {
    text-align: center;
    line-height: 1.2;
    max-width: 12ch;
    transition: all 0.2s ease-in-out;
    color: ${({ theme }) => theme.colors.tertiary};

    @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}) {
      font-size: 10px;
    }
  }

  &:hover,
  &.active {
    .ant-avatar {
      border: 1px dashed ${({ theme }) => theme.colors.primary};

      img {
        filter: drop-shadow(0 1px 5px rgba(0, 0, 0, 0.3)) !important;
      }
    }

    .ant-typography {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &.active {
    .ant-avatar {
      border: 1px solid ${({ theme }) => theme.colors.primary};

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: ${({ theme }) => theme.colors.primary};
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.1;
      }
    }
  }
`;

export const ProductCard = styled(Card)`
  &.ant-card {
    padding: 0;

    .ant-card-body {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .ant-avatar {
        padding: 10px;

        img {
          filter: drop-shadow(0 1px 5px rgba(0, 0, 0, 0.4)) !important;
        }
      }

      .product-card-details {
        align-self: flex-start;
        margin: 10px 0 10px 10px;
        width: 65%;

        .ant-typography {
          &.title {
            @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}) {
              font-size: 13px;
            }
          }
        }
      }

      .ant-btn {
        position: absolute;
        top: 160px;
        right: 10px;
      }
    }
  }
`;

export const ProductsContainer = styled.div`
  padding: 20px;
  margin-bottom: 180px;
  max-width: 1000px;
  margin: 0 auto 200px;
`;

export const FloattingMessage = styled.span`
  position: fixed;
  bottom: 90px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #ffffff;
  border-radius: 40px;
  padding: 5px 10px;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-weight: 300;
`;
