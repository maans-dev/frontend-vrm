import { FunctionComponent } from 'react';
import { EuiLoadingChart } from '@elastic/eui';

export type Props = {
  show: boolean;
};

const Spinner: FunctionComponent<Props> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        // backdropFilter: 'blur(3px)',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        position: 'absolute',
      }}>
      {/* <EuiLoadingSpinner size="xxl" /> */}
      <EuiLoadingChart mono size="xl" />
    </div>
  );
};

export default Spinner;
