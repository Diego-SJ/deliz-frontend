import { Card, Tabs } from 'antd';
import styled from 'styled-components';

export const ProductsContainer = styled(Card)`
  &.ant-card {
    height: 100%;
    background: #e2e2e2;
    padding: 0;
    border-color: transparent;
    border-radius: 0;
    max-height: calc(100dvh - 64px);
    overflow-y: auto;

    .ant-card-body {
      padding: 10px;
    }
  }
`;

export const ProductsCheckout = styled(Card)`
  &.ant-card {
    background: ${({ theme }) => theme.colors.background.primary};
    padding: 0 10px;
    border-color: transparent;
    border-radius: 0;

    & > .ant-card-body {
      min-height: calc(100vh - 67px);
      padding: 0;
      display: flex;
      flex-direction: column;

      & div.cashier-search {
        display: flex;
        column-gap: 10px;
        height: 55px;
        padding-top: 10px;
      }

      & div.cashier-items {
        min-height: calc(100vh - 380px);
        max-height: calc(100vh - 380px);
      }

      & div.cashier-actions {
        height: 255px;
      }
    }
  }
`;

export const SalePrices = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;

  span.ant-typography {
    font-size: 16px;

    span {
      min-width: 150px;
      display: inline-block;
      text-align: end;
    }
  }

  h3.ant-typography {
    margin: 0;
  }

  span.ant-typography,
  h3.ant-typography {
    span {
      min-width: 150px;
      display: inline-block;
      text-align: end;
    }
  }
`;

export const CustomTabs = styled(Tabs)`
  &.ant-tabs {
    .ant-tabs-nav-list {
      .ant-tabs-tab {
        .ant-tabs-tab-btn {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
      .ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`;

export const CardBtn = styled(Card)`
  &.ant-card {
    transition: all 0.2s ease-in-out;
    background: ${({ theme }) => theme.colors.background.secondary};
    border-color: transparent;
    overflow: hidden;
    width: 100%;
    height: 130px;
    min-height: 130px;

    .ant-card-body {
      padding: 15px 10px;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
      transition: all 0.2s ease-in-out;

      .ant-typography {
        color: ${({ theme }) => theme.colors.secondary};
        font-size: 10px;
        transition: all 0.2s ease-in-out;
        margin-top: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0;
        background-color: #fff;
        width: 100%;
        padding: 5px;
        text-align: center;
        transition: all 0.2s ease-in-out;
      }
    }

    &.no-image {
      .ant-card-body {
        background-position: center 23%;
        background-size: 70%;
        position: relative;
      }
    }

    &:hover {
      transform: scale(1.02);

      .ant-card-body {
        .ant-avatar {
          scale: 1.4;
        }

        .ant-typography {
          color: ${({ theme }) => theme.colors.primary};
        }
      }

      &.no-image {
        .ant-card-body {
          background-position: center;
        }
      }
    }

    @media screen and (max-width: ${({ theme }) => theme.breakPoints.md}) {
      .ant-card-body {
        padding: 10px;
      }
    }
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardProduct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  width: 100%;
  background: #fff;
  aspect-ratio: 1/1;
  padding: 1rem;
  transition: all 0.22ms linear;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.2);
  }

  .card-product-image {
    height: 8rem;
    width: 8rem;
  }

  .card-product-tags {
    display: flex;
  }
`;
