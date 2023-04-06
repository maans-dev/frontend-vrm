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
  .euiPageTemplate {
    background: #f5f1f1;
  }
  fieldset {
    background: #ffffff95;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    border-radius: 5px;
  }
  .euiFormLegend:not(.euiFormLegend-isHidden) {
    background: #1261a0;
    color: white;
    border-radius: 5px;
    padding: 2px 10px;
  }
  .euiTable {
    background-color: transparent;
  }
  .euiEmptyPrompt {
    background-color: white;
  }
`;
