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
    --primary: ${({ theme }) => theme.colors.primary};
  }

  body {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  html, body {
    overscroll-behavior: none;
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

  .ant-select.xl-select .ant-select-selector .ant-select-selection-search .ant-select-selection-search-input {
    height: 100%;
  }

  .search-products-input.ant-input-group-wrapper.ant-input-group-wrapper-lg.ant-input-group-wrapper-outlined 
  .ant-input-wrapper.ant-input-group .ant-input-affix-wrapper.ant-input-affix-wrapper-lg,
  .search-products-input.ant-input-group-wrapper.ant-input-group-wrapper-lg.ant-input-group-wrapper-outlined 
  .ant-input-wrapper.ant-input-group .ant-input-group-addon .ant-btn {
    border-color: rgb(209 213 219 / var(--tw-border-opacity));
  }

  .search-products-input.ant-input-group-wrapper.ant-input-group-wrapper-lg.ant-input-group-wrapper-outlined
  .ant-input-wrapper.ant-input-group .ant-input-affix-wrapper.ant-input-affix-wrapper-lg.ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;
