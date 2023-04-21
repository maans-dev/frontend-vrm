import { FunctionComponent } from 'react';
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';

export type Props = {
  show: boolean;
};

const Spinner: FunctionComponent<Props> = ({ show }) => {
  if (!show) return null;

  return (
    <EuiEmptyPrompt
      body={
        <p>
          Sorry, we you don&apos;t have sufficient permission to view this page.
        </p>
      }
      iconType="securityApp"
      layout="vertical"
      title={<h2>Access Denied</h2>}
      titleSize="m"
    />
  );
};

export default Spinner;
