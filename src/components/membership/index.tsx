import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiSpacer,
} from '@elastic/eui';
import { FunctionComponent, useContext } from 'react';

import Comments from '@components/comments';
import MembershipEvents from '@components/membership-history';
import BranchInfo from './branch-info';
import MembershipInfo from './membership-info';
import { MembershipContext } from './membership.context';
import BranchOverrideModal from './modals/branch-override.modal';
import DaAbroadModal from './modals/da-abroad.modal';
import PaymentInfo from './payment-info';
import ActivationModal from './modals/activation.modal';
import RenewModal from './modals/renew.modal';
import CancelModal from './modals/cancel.modal';
import CancellationInfo from './cancellation-info';

const Membership: FunctionComponent = () => {
  const { person, showMembershipInfo, payment, cancellationInfo, onChange } =
    useContext(MembershipContext);

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem grow={2}>
          <EuiFlexGroup direction="column">
            <EuiFlexItem>
              <MembershipInfo />
              <EuiSpacer size="l" />

              {(showMembershipInfo || payment) && (
                <>
                  <BranchInfo />
                  <EuiSpacer size="l" />
                </>
              )}

              {payment && <PaymentInfo />}

              {cancellationInfo && <CancellationInfo />}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFlexGroup>
            <EuiFlexItem grow={1}>
              <EuiFormFieldset legend={{ children: 'Membership Events' }}>
                <MembershipEvents personKey={person?.key} />
              </EuiFormFieldset>

              <EuiSpacer size="m" />

              <EuiFormFieldset legend={{ children: 'Membership Comments' }}>
                <Comments
                  comments={person?.comments}
                  onMembershipCommentChange={onChange}
                />
              </EuiFormFieldset>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <DaAbroadModal />
      <BranchOverrideModal />
      <ActivationModal />
      <RenewModal />
      <CancelModal />
    </>
  );
};

export default Membership;
