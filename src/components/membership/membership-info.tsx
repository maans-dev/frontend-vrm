import { FunctionComponent } from 'react';
import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import moment from 'moment';

export interface Props {
  status: string;
  expired: string;
  initialJoin: string;
  newRenewal: string;
  membershipNumber: string;
}

const MembershipInfo: FunctionComponent<Props> = ({
  status,
  expired,
  initialJoin,
  newRenewal,
  membershipNumber,
}) => {
  let color: string;
  switch (status) {
    case null:
    case 'NotAMember':
      color = 'subdued';
      break;
    case 'Resigned':
    case 'Terminated':
      color = 'warning';
      break;
    case 'Expired':
      color = 'danger';
      break;
    case 'Active':
      color = 'success';
      break;
  }
  return (
    <>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiText size="s">
            <p>Status:</p>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiHealth color={color}>
            <EuiText size="s">
              <strong>{status}</strong>
            </EuiText>
          </EuiHealth>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="xs" />

      <EuiFlexGrid columns={4} gutterSize="s">
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p style={{ whiteSpace: 'nowrap' }}>Membership Number:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong>{membershipNumber ? membershipNumber : 'Unknown'}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Renewal date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong style={{ whiteSpace: 'nowrap' }}>
                {moment(newRenewal).format('YYYY-MM-DD')}
              </strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Initial Join Date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong>{initialJoin}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Expiry date:</p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiText size="s">
              <strong style={{ whiteSpace: 'nowrap' }}>{expired}</strong>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGrid>
    </>
  );
};

export default MembershipInfo;
