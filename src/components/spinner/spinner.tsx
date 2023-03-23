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
        width: '100vw',
        height: '100vh',
        background: '#ffffff80',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        position: 'fixed',
      }}>
      <EuiLoadingChart mono size="xl" />
    </div>
  );
};

export default Spinner;
