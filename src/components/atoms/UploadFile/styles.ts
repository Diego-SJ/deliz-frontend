import styled from 'styled-components';

export const ContainerRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2.2rem;
  margin-bottom: 2.8rem;

  & .MuiTypography-h2 {
    font-size: 1.5rem;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.danger};
    margin: 0;
  }
`;
export const LabelRoot = styled.label`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & span.MuiButtonBase-root {
    width: 23rem;
    max-width: 100%;
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 3rem;
    color: ${({ theme }) => theme.colors.background.primary};
    font-size: 2rem;
    position: absolute;
  }

  & span.MuiButtonBase-root:hover {
    background-color: rgba(132, 137, 190, 0.83);
  }

  & span.MuiIconButton-label {
    font-size: 1.6rem;
    line-height: 1.3;
    font-weight: 600 !important;
    column-gap: 0.5rem;
  }
`;

export const InputRoot = styled.input`
  & .MuiInputBase-input {
    width: 100%;
    display: none;
  }
`;

// export const IconButtonRoot = styled(IconButton)`
//   &.MuiIconButton-root {
//     width: 18rem;
//     max-width: 100%;
//     height: 5rem;
//     background-color: rgba(132, 137, 190, 1);
//     border-radius: 3rem;
//     color: ${({ theme }) => theme.colors.white};
//     font-size: 2rem;
//     font-weight: 400;
//   }
// `;
