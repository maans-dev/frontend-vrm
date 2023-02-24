import { css } from '@emotion/react';

export const globalStyes = css`
  .euiBottomBar {
    background: white;
  }
  .euiHeader--dark {
    background: #155fa2;
  }
  fieldset {
    min-inline-size: auto;
    border: 1px solid #d3d3d375;
    padding: 10px;
    border-radius: 5px;
  }
  .euiFormLegend:not(.euiFormLegend-isHidden) {
    margin: 0;
    padding: 0 5px;
    text-transform: uppercase;
    font-size: x-small;
  }
`;
