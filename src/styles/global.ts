import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  // ---------------------------------------------
  // global styles
  // ---------------------------------------------

  *,
	*::after,
	*::before {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
		font-family: 'Manrope', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
		'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		scroll-behavior: smooth;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;
  }

	*::-webkit-scrollbar {
		display: none;
	}

  #root{
    margin: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  // ---------------------------------------------
  // override ant styles
  // ---------------------------------------------

  .app-custom-popover.nopadding {
    .ant-popover-content {
      .ant-popover-inner {
        .ant-popover-inner-content {
          padding: 0;
        }
      }
    }
  }

  .ant-tag {
    border-radius: 15px;
  }
`;
