import { MembershipContext } from '@components/membership/membership.context';
import { EuiCheckableCard, htmlIdGenerator } from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';

const DawnOptOutOption: FunctionComponent = () => {
  const {
    person,
    isDawnOptOutSelected,
    setIsDawnOptOutSelected,
    membership,
    onChange,
  } = useContext(MembershipContext);

  const handleChange = () => {
    setIsDawnOptOutSelected(!isDawnOptOutSelected);

    if (membership.dawnOptOut != !isDawnOptOutSelected) {
      onChange({
        field: 'membership',
        data: {
          dawnOptOut: !isDawnOptOutSelected,
        },
      });
    }
  };

  return (
    <>
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="DAWN Opt-out"
        checkableType="checkbox"
        aria-label="DAWN Opt-out"
        disabled={person?.gender === 'M'}
        checked={isDawnOptOutSelected}
        onChange={handleChange}
      />
    </>
  );
};

export default DawnOptOutOption;
