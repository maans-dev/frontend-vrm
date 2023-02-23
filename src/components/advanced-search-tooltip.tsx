import { EuiIconTip, EuiText } from '@elastic/eui';
import { FunctionComponent } from 'react';

export const AdvancedSearchTooltip: FunctionComponent = () => {
  return (
    <EuiIconTip
      color="primary"
      title="Advanced search options"
      content={
        <EuiText size="s">
          <ul>
            <li>
              Start with: <strong>*xyz</strong>
            </li>
            <li>
              End with: <strong>xyz*</strong>
            </li>
            <li>
              Equals: <strong>&quot;xyz&quot;</strong>
            </li>
          </ul>
        </EuiText>
      }
    />
  );
};
