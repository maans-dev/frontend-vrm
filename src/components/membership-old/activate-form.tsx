import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiFormFieldset,
  EuiFormRow,
  EuiFieldText,
  EuiSelect,
  EuiDatePicker,
  EuiSpacer,
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiOverlayMask,
  EuiText,
} from '@elastic/eui';
import moment from 'moment';
import PersonSearch from '@components/person-search';
import { Membership, MembershipPayment, Person } from '@lib/domain/person';
import { useSession } from 'next-auth/react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';

export interface Props {
  id_number: string;
  status: string;
  handleRecruitedPerson: (person: Partial<Person>) => void;
  isActivationModalVisible: boolean;
  setIsActivationModalVisible: (value: boolean) => void;
  handleMembershipActivation: (update) => void;
}

const MembershipActivationForm: FunctionComponent<Props> = ({
  id_number,
  status,
  handleRecruitedPerson,
  isActivationModalVisible,
  setIsActivationModalVisible,
  handleMembershipActivation,
}) => {
  const [idNumber, setIdNumber] = useState('');
  const [membershipNumber, setMembershipNumber] = useState<string>('');
  const [years, setYears] = useState<number>(1);
  const [amount, setAmount] = useState<number>(10);
  const [type, setType] = useState<string>('cash');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [recruitedBy, setRecruitedBy] = useState<number>();
  const [formValid, setFormValid] = useState(false);
  const { data: session } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);

  const handleIdNumberChange = e => {
    setIdNumber(e.target.value);
  };

  const MAX_ID_NUMBER_LENGTH = 13;

  const handleYearsAmountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
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

  const handleRecruitedByChange = (person: Partial<Person>) => {
    handleRecruitedPerson(person as Partial<Person>);
    setRecruitedBy(person.key);
  };

  const handlePaymentInformation = () => {
    const payload: Partial<Membership> = {
      payment: {
        recruitedBy: recruitedBy,
        membershipNumber,
        years,
        amount,
        type,
        date,
        referenceNumber,
        receiptNumber,
      },
    };
    if (payload) {
      handleMembershipActivation(payload as MembershipPayment);
      setIsActivationModalVisible(false);
    }
  };

  const resetForm = () => {
    setRecruitedBy(null);
    setMembershipNumber('');
    setReferenceNumber('');
    setReceiptNumber('');
  };

  const closeModal = () => setIsActivationModalVisible(false);

  let displayDate = moment().format('D MMMM YYYY');
  if (date) {
    displayDate = moment(date).format('D MMMM YYYY');
  }

  const paymentForm = (
    <>
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
            value={years === 1 ? 'option_one' : 'option_two'}
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
          <PersonSearch
            handleRecruitedByChange={handleRecruitedByChange}
            setRecruitedBy={setRecruitedBy}
            recruitedBy={recruitedBy}
          />
        </EuiFormRow>
      </EuiFormFieldset>
    </>
  );

  let modal;

  if (isActivationModalVisible) {
    modal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
          <EuiSpacer size="m" />
          <EuiModalBody>{paymentForm}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={resetForm}>Reset</EuiButtonEmpty>
            <EuiButton
              onClick={handlePaymentInformation}
              fill
              disabled={!formValid}>
              Add Payment Information
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  const ActiveButton = ({ text, onClick, disabled }) => {
    return (
      <EuiButton
        onClick={onClick}
        disabled={disabled}
        size="s"
        color="primary"
        fill
        style={{ height: '25px' }}>
        <EuiText size="xs">{text}</EuiText>
      </EuiButton>
    );
  };

  function renderMembershipButton(
    status: string,
    hasRole: (role: string) => boolean
  ) {
    if (status === 'Resigned' || status === 'Terminated') {
      if (hasRole(Roles.MembershipAdmin)) {
        return (
          <ActiveButton
            text="Activate"
            disabled={false}
            onClick={() =>
              setIsActivationModalVisible(!isActivationModalVisible)
            }
          />
        );
      } else {
        return (
          <>
            <EuiText color="subdued" textAlign="center" size="xs">
              Please contact your Provincial Director or the Federal Membership
              office to re-activate this member.
            </EuiText>
            <ActiveButton
              text="Activate"
              disabled={false}
              onClick={() => null}
            />
          </>
        );
      }
    } else if (status === 'NotAMember') {
      return (
        <ActiveButton
          text="Activate"
          disabled={false}
          onClick={() => setIsActivationModalVisible(!isActivationModalVisible)}
        />
      );
    } else if (status === 'Expired' || status === 'Active') {
      return (
        <ActiveButton
          text="Renew"
          disabled={false}
          onClick={() => setIsActivationModalVisible(!isActivationModalVisible)}
        />
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    const isRecruitedByValid =
      recruitedBy !== undefined && recruitedBy?.toString().length === 8;
    const isReceiptNumberValid = !!receiptNumber;
    const isReferenceNumberValid = !!referenceNumber;
    const isDateValid = moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid();
    const isTypeValid = !!type;

    const isValid =
      isRecruitedByValid &&
      isReceiptNumberValid &&
      isReferenceNumberValid &&
      isDateValid &&
      membershipNumber &&
      isTypeValid;

    setFormValid(isValid);
  }, [
    recruitedBy,
    receiptNumber,
    type,
    referenceNumber,
    date,
    membershipNumber,
  ]);

  return (
    <>
      {renderMembershipButton(status, hasRole)}
      {modal}
    </>
  );
};

export default MembershipActivationForm;
