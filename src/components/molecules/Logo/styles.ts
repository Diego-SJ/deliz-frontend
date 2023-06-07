import styled from 'styled-components';

export const LogoRoot = styled.div`
  width: 100%;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  padding-top: 20px;

  .ant-typography {
    margin: 0;
  }
`;

export const LogoImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  cursor: pointer;
`;
