import { FunctionComponent } from 'react';
import { EuiLoadingChart } from '@elastic/eui';

export type Props = {
  show: boolean;
};

const SpinnerEmbed: FunctionComponent<Props> = ({ show }) => {
  if (!show) return <></>;

  return (
    <div
      style={{
        backdropFilter: 'grayscale(100%)',
        width: '100%',
        height: '100%',
        background: '#ffffff99',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        position: 'absolute',
      }}>
      <EuiLoadingChart mono size="xl" />
    </div>
  );
};

export default SpinnerEmbed;
