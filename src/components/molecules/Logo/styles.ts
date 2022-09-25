import styled from 'styled-components';

export const LogoRoot = styled.div`
  height: 64px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;

  .ant-typography {
    margin: 0;
  }
`;

export const LogoImg = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
`;
