import { MembershipContext } from '@components/membership/membership.context';
import { EuiCheckableCard, htmlIdGenerator } from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';

const DaYouthOption: FunctionComponent = () => {
  const {
    personAge,
    isDaYouthSelected,
    setIsDaYouthSelected,
    onChange,
    membership,
  } = useContext(MembershipContext);

  const handleChange = () => {
    setIsDaYouthSelected(!isDaYouthSelected);

    if (membership.daYouth != !isDaYouthSelected) {
      onChange({
        field: 'membership',
        data: {
          daYouth: !isDaYouthSelected,
        },
      });
    }
  };

  return (
    <>
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="DA Youth"
        checkableType="checkbox"
        aria-label="DA Youth"
        disabled={personAge > 31}
        checked={personAge <= 31 && isDaYouthSelected}
        onChange={handleChange}
      />
    </>
  );
};

export default DaYouthOption;
