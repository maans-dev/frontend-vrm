import PersonSearch from '@components/person-search';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiDatePicker,
  EuiFieldText,
  EuiFormFieldset,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSelect,
} from '@elastic/eui';
import { MembershipPayment, Person } from '@lib/domain/person';
import moment from 'moment';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { MembershipContext } from '../membership.context';
import { MembershipPaymentOptions } from '../utils';

const ActivationModal: FunctionComponent = () => {
  const {
    person,
    isActivationModalVisible,
    setIsActivationModalVisible,
    payment,
    onSavePayment,
    setUpdateType,
  } = useContext(MembershipContext);
  const [idNumber, setIdNumber] = useState('');
  const [membershipNumber, setMembershipNumber] = useState<string>(
    payment?.membershipNumber || ''
  );
  const [years, setYears] = useState<number>(payment?.years || 1);
  const [amount, setAmount] = useState<number>(payment?.amount || 10);
  const [type, setType] = useState<string>(payment?.type || 'cash');
  const [date, setDate] = useState(
    payment?.date ? moment(payment.date) : moment()
  );
  const [referenceNumber, setReferenceNumber] = useState<string>(
    payment?.referenceNumber || ''
  );
  const [recruitedBy, setRecruitedBy] = useState<Partial<Person>>(
    (payment?.recruitedBy as Partial<Person>) || undefined
  );
  const [formValid, setFormValid] = useState(false);

  const handleClose = () => {
    setIsActivationModalVisible(false);
    handleReset();
  };

  const handleReset = () => {
    setMembershipNumber('');
    setReferenceNumber('');
    setRecruitedBy(null);
    setDate(moment());
    setAmount(10);
    setYears(1);
    setType('cash');
  };

  const handleSave = () => {
    const payload: Partial<MembershipPayment> = {
      recruitedBy: recruitedBy,
      membershipNumber,
      years,
      amount,
      type,
      date: date.format('YYYY-DD-MM'),
      referenceNumber,
      receiptNumber: referenceNumber,
    };
    if (payload) {
      onSavePayment(payload);
      setUpdateType('membership-new');
      setIsActivationModalVisible(false);
      handleReset();
    }
  };

  useEffect(() => {
    if (!payment) return;
    setRecruitedBy(payment.recruitedBy as Partial<Person>);
    setMembershipNumber(payment.membershipNumber);
    setReferenceNumber(payment.referenceNumber);
    setDate(moment(payment.date));
    setAmount(payment.amount);
    setYears(payment.years);
    setType(payment.type);
  }, [payment]);

  useEffect(() => {
    const isRecruitedByValid =
      recruitedBy !== undefined && recruitedBy?.key?.toString().length === 8;
    const isReferenceNumberValid = !!referenceNumber;
    const isDateValid = date.isValid();
    const isTypeValid = !!type;

    const isValid =
      isRecruitedByValid &&
      isReferenceNumberValid &&
      isDateValid &&
      membershipNumber &&
      isTypeValid;

    setFormValid(isValid);
  }, [recruitedBy, type, referenceNumber, date, membershipNumber]);

  if (!isActivationModalVisible) return <></>;

  return (
    <EuiOverlayMask>
      <EuiModal onClose={handleClose} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="m">
            Activate membership{' '}
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiFormFieldset>
            <EuiFormRow
              label="ID Number"
              display="rowCompressed"
              isInvalid={!person?.idNumber && idNumber.length !== 13}
              error={
                idNumber.length === 13
                  ? null
                  : 'A 13 digit ID number is required'
              }>
              <EuiFieldText
                name="id-number"
                compressed
                disabled={person?.idNumber ? true : false}
                value={person?.idNumber || idNumber}
                onChange={e => setIdNumber(e.target.value)}
                maxLength={13}
              />
            </EuiFormRow>

            <EuiFormRow label="Membership Number" display="rowCompressed">
              <EuiFieldText
                name="first"
                compressed
                autoComplete="off"
                value={membershipNumber}
                onChange={e => setMembershipNumber(e.target.value)}
              />
            </EuiFormRow>

            <EuiFormRow label="Years / Amount" display="rowCompressed">
              <EuiSelect
                options={MembershipPaymentOptions.map(option => ({
                  value: option.value,
                  text: option.text,
                }))}
                value={
                  MembershipPaymentOptions.find(
                    option => option.years === years
                  )?.value
                }
                compressed
                onChange={e => {
                  const selectedOption = MembershipPaymentOptions.find(
                    option => option.value === e.target.value
                  );
                  if (selectedOption) {
                    setYears(selectedOption.years);
                    setAmount(selectedOption.amount);
                  }
                }}
              />
            </EuiFormRow>

            <EuiFormRow display="rowCompressed" label="Payment Date">
              <EuiDatePicker
                name="dob"
                autoComplete="off"
                dateFormat={['D MMM YYYY']}
                maxDate={moment()}
                yearDropdownItemNumber={5}
                value={date.format('YYYY-MM-DD')}
                onChange={selectedDate => {
                  const today = moment();

                  if (selectedDate.isSameOrBefore(today)) {
                    setDate(selectedDate);
                  }
                }}
              />
            </EuiFormRow>

            <EuiFormRow label="Payment Type" display="rowCompressed">
              <EuiSelect
                options={[
                  { value: 'Cash', text: 'Cash' },
                  { value: 'EFT', text: 'EFT' },
                  { value: 'Credit Card', text: 'Credit Card' },
                  { value: 'Debit Card', text: 'Debit Card' },
                  { value: 'Cheque', text: 'Cheque' },
                  { value: 'Debit Order', text: 'Debit Order' },
                  { value: 'Mobile', text: 'Mobile Payment' },
                ]}
                compressed
                onChange={e => setType(e.target.value)}
              />
            </EuiFormRow>

            <EuiFormRow label="Payment Reference" display="rowCompressed">
              <EuiFieldText
                name="payment-reference"
                compressed
                value={referenceNumber}
                onChange={e => {
                  const value = e.target.value;
                  setReferenceNumber(value);
                }}
              />
            </EuiFormRow>

            <EuiFormRow label="Recruited By" display="rowCompressed">
              <PersonSearch
                handleRecruitedByChange={({
                  key,
                  firstName,
                  givenName,
                  surname,
                }) => setRecruitedBy({ key, firstName, givenName, surname })}
                // setRecruitedBy={setRecruitedBy}
                recruitedBy={recruitedBy?.key}
              />
            </EuiFormRow>
          </EuiFormFieldset>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={handleReset}>Reset</EuiButtonEmpty>

          <EuiButton onClick={handleSave} disabled={!formValid} fill>
            Add payment information
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export default ActivationModal;
