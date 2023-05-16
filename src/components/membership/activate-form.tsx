import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  EuiFormFieldset,
  EuiFormRow,
  EuiFieldText,
  EuiSelect,
  EuiDatePicker,
  EuiCallOut,
  EuiSpacer,
} from '@elastic/eui';
import moment from 'moment';
import PersonSearch from '@components/person-search';

export interface Props {
  id_number: string;
  handleMembershipStatus: (update) => void;
}

const MembershipActivationForm: FunctionComponent<Props> = ({
  id_number,
  handleMembershipStatus,
}) => {
  const [idNumber, setIdNumber] = useState('');
  const [membershipNumber, setMembershipNumber] = useState<string>('');
  const [years, setYears] = useState<number>(1);
  const [amount, setAmount] = useState<number>(10);
  const [type, setType] = useState<string>('cash');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [recruitedBy, setRecruitedBy] = useState<string>('');
  const [formCompleted, setFormCompleted] = useState(false);

  const handleIdNumberChange = e => {
    setIdNumber(e.target.value);
  };

  const handleYearsAmountChange = event => {
    const { value } = event.target;
    switch (value) {
      case 'option_one':
        setYears(1);
        setAmount(10);
        break;
      case 'option_two':
        setYears(5);
        setAmount(50);
        break;
    }
  };

  const handleRecruitedByChange = key => {
    setRecruitedBy(key);
  };

  const MAX_ID_NUMBER_LENGTH = 13;

  const payload = useMemo(() => {
    if (
      membershipNumber &&
      years &&
      amount &&
      type &&
      date &&
      referenceNumber &&
      recruitedBy
    ) {
      return {
        payment: {
          recruitedBy: Number(recruitedBy),
          membershipNumber: membershipNumber,
          years: years,
          amount: amount,
          type: type,
          date: date,
          referenceNumber: referenceNumber,
          receiptNumber: receiptNumber,
        },
      };
    }
  }, [
    membershipNumber,
    years,
    amount,
    type,
    date,
    referenceNumber,
    recruitedBy,
    receiptNumber,
  ]);

  useEffect(() => {
    if (payload) {
      setFormCompleted(true);
      handleMembershipStatus(payload);
    } else {
      setFormCompleted(false);
    }
  }, [payload, handleMembershipStatus]);

  let displayDate = moment().format('D MMMM YYYY');
  if (date) {
    displayDate = moment(date).format('D MMMM YYYY');
  }

  return (
    <>
      {!formCompleted && (
        <EuiCallOut color="warning" iconType="alert">
          Please fill out all form fields.
        </EuiCallOut>
      )}
      <EuiSpacer size="m" />
      <EuiFormFieldset
        legend={{
          children: 'Activate or Renew Membership',
        }}>
        <EuiFormRow
          label="ID Number"
          display="rowCompressed"
          isInvalid={!id_number && idNumber.length !== 13}
          error={
            idNumber.length === 13 ? null : 'A 13 digit ID number is required'
          }>
          <EuiFieldText
            name="id-number"
            compressed
            disabled={id_number ? true : false}
            value={id_number || idNumber}
            onChange={handleIdNumberChange}
            maxLength={MAX_ID_NUMBER_LENGTH}
          />
        </EuiFormRow>

        <EuiFormRow label="Membership Number" display="rowCompressed">
          <EuiFieldText
            name="first"
            compressed
            autoComplete="off"
            value={membershipNumber}
            onChange={event => setMembershipNumber(event.target.value)}
          />
        </EuiFormRow>

        <EuiFormRow label="Years / Amount" display="rowCompressed">
          <EuiSelect
            options={[
              { value: 'option_one', text: '1 Year / R10' },
              { value: 'option_two', text: '5 Years / R50' },
            ]}
            compressed
            onChange={handleYearsAmountChange}
          />
        </EuiFormRow>

        <EuiFormRow display="rowCompressed" label="Payment Date">
          <EuiDatePicker
            name="dob"
            autoComplete="off"
            dateFormat={['D MMM YYYY']}
            maxDate={moment()}
            yearDropdownItemNumber={5}
            value={displayDate}
            onChange={selectedDate => {
              const selectedMoment = moment(selectedDate);
              const today = moment();

              if (selectedMoment.isSameOrBefore(today)) {
                setDate(selectedMoment.format('YYYY-MM-DD HH:mm:ss'));
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
              setReceiptNumber(value);
            }}
          />
        </EuiFormRow>

        <EuiFormRow label="Recruited By" display="rowCompressed">
          <PersonSearch handleRecruitedByChange={handleRecruitedByChange} />
        </EuiFormRow>
      </EuiFormFieldset>
    </>
  );
};

export default MembershipActivationForm;
