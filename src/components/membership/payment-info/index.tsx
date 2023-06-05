import {
  EuiButtonIcon,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiText,
} from '@elastic/eui';
import { Person } from '@lib/domain/person';
import { renderName } from '@lib/person/utils';
import moment from 'moment';
import { FunctionComponent, useContext } from 'react';
import { MembershipContext } from '../membership.context';

const PaymentInfo: FunctionComponent = () => {
  const { payment, setPayment, setUpdateType, setIsActivationModalVisible } =
    useContext(MembershipContext);
  return (
    <>
      <EuiFormFieldset legend={{ children: 'Payment Info' }}>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem>
            <EuiFlexGrid columns={2} gutterSize="s">
              <EuiText size="s">Membership Number:</EuiText>
              <strong>{payment.membershipNumber}</strong>
              <EuiText size="s">Date:</EuiText>
              <strong>{moment(payment.date).format('YYYY/MM/DD')}</strong>
              <EuiText size="s">Amount:</EuiText>
              <strong>R {payment.amount}</strong>
              <EuiText size="s">Years:</EuiText>
              <strong>
                {payment.years} {payment.years === 1 ? 'year' : 'years'}
              </strong>
              <EuiText size="s">Type:</EuiText>
              <strong>{payment.type}</strong>

              <EuiText size="s">Recruited By:</EuiText>
              <strong>
                {renderName(payment?.recruitedBy as Partial<Person>)}
              </strong>
            </EuiFlexGrid>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem>
                <EuiButtonIcon
                  iconType="pencil"
                  aria-label="Edit"
                  onClick={() => setIsActivationModalVisible(true)}
                />
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiButtonIcon
                  iconType="trash"
                  aria-label="Delete"
                  color="danger"
                  onClick={() => {
                    setPayment(undefined);
                    setUpdateType('membership-capture');
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormFieldset>
    </>
  );
};

export default PaymentInfo;
