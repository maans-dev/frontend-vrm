import { EuiFlexGrid, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';
import moment from 'moment';
import { FunctionComponent } from 'react';

export interface Props {
  membershipNumber: string;
  renewalDate: string;
  joinDate: string;
  expiryDate: string;
}

const InfoGrid: FunctionComponent<Props> = ({
  membershipNumber,
  renewalDate,
  joinDate,
  expiryDate,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return moment(dateString).format('D MMM YYYY');
  };

  return (
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
            <strong>{membershipNumber || 'Unknown'}</strong>
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
              {formatDate(renewalDate)}
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
            <strong>{formatDate(joinDate)}</strong>
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
            <strong style={{ whiteSpace: 'nowrap' }}>
              {formatDate(expiryDate)}
            </strong>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexGrid>
  );
};

export default InfoGrid;
