import { MembershipContext } from '@components/membership/membership.context';
import { EuiCheckableCard, htmlIdGenerator } from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';

const DaAbroadOption: FunctionComponent = () => {
  const {
    isDaAbroadSelected,
    hasDaAbroad,
    onSelectDaAbroad,
    onDeleteDaAbroad,
  } = useContext(MembershipContext);
  return (
    <>
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="DA Abroad"
        checkableType="checkbox"
        aria-label="DA Abroad"
        disabled={!hasDaAbroad}
        checked={isDaAbroadSelected}
        onChange={() =>
          isDaAbroadSelected ? onDeleteDaAbroad() : onSelectDaAbroad()
        }
      />
    </>
  );
};

export default DaAbroadOption;
