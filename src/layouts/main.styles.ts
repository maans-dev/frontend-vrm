import { css } from '@emotion/react';

export const MainLayoutStyles = () => ({
  mainWrapper: css`
    //padding-top: 96px; // two top navs
    min-height: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100vh;
  `,
  contentWrapper: css`
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    z-index: 0;
    position: relative;
    min-height: 100vh;
  `,
});
