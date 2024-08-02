import styled from 'styled-components';
import Avatar from 'antd/lib/avatar/avatar';

export const AvatarShape = styled(Avatar)`
  &.ant-avatar {
    &.bordered {
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const AvatarInfo = styled.div`
  display: flex;
  flex-direction: column;

  .ant-typography {
    &.avatar-title {
      margin: 0;
      line-height: 1;
      margin-bottom: 5px;
      color: ${({ theme }) => theme.colors.secondary};
    }

    &.avatar-subtitle {
      line-height: initial;
      color: ${({ theme }) => theme.colors.tertiary};
    }
  }
`;
