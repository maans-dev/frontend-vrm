import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';
import { FunctionComponent } from 'react';
import DaAbroadOption from './da-abroad';
import DaYouthOption from './da-youth';
import DawnOptOutOption from './dawn-optout';
import BranchOverrideOption from './branch-override';

const MembershipOptions: FunctionComponent = () => {
  return (
    <EuiFlexGrid columns={2} gutterSize={'s'}>
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
  );
};

export default MembershipOptions;
