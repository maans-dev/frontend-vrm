import { MembershipContext } from '@components/membership/membership.context';
import { EuiCheckableCard, htmlIdGenerator } from '@elastic/eui';
import { Roles } from '@lib/domain/auth';
import { FunctionComponent, useContext } from 'react';

const BranchOverrideOption: FunctionComponent = () => {
  const {
    hasBranchOverride,
    isBranchOverrideSelected,
    onSelectBranchOverride,
    onDeleteBranchOverride,
    hasRole,
  } = useContext(MembershipContext);

  return (
    <>
      <EuiCheckableCard
        css={{ height: '50px' }}
        id={htmlIdGenerator()()}
        label="Permission to have a different branch given"
        checkableType="checkbox"
        aria-label="Permission to have a different branch given"
        disabled={!hasBranchOverride || !hasRole(Roles.MembershipAdmin)}
        checked={isBranchOverrideSelected}
        onChange={() =>
          isBranchOverrideSelected
            ? onDeleteBranchOverride()
            : onSelectBranchOverride()
        }
      />
    </>
  );
};

export default BranchOverrideOption;
