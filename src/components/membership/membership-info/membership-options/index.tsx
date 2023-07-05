import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';
import DaAbroadOption from './da-abroad';
import DaYouthOption from './da-youth';
import DawnOptOutOption from './dawn-optout';
import BranchOverrideOption from './branch-override';
import { MembershipContext } from '@components/membership/membership.context';

const MembershipOptions: FunctionComponent = () => {
  const { person } = useContext(MembershipContext);

  return (
    <>
      {!person?.pubRep && (
        <EuiFlexGrid columns={2} gutterSize="s">
          <EuiFlexItem>
            <DaYouthOption />
          </EuiFlexItem>
          <EuiFlexItem>
            <DawnOptOutOption />
          </EuiFlexItem>
          <EuiFlexItem>
            <DaAbroadOption />
          </EuiFlexItem>
          <EuiFlexItem>
            <BranchOverrideOption />
          </EuiFlexItem>
        </EuiFlexGrid>
      )}
    </>
  );
};

export default MembershipOptions;
