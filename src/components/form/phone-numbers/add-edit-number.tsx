import { FunctionComponent, useContext, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSuperSelect,
  EuiText,
} from '@elastic/eui';
import {
  FaMobileAlt,
  FaRegQuestionCircle,
  FaHome,
  FaGlobe,
} from 'react-icons/fa';
import { ImUserTie } from 'react-icons/im';
import { PhoneContact } from '@lib/domain/phone-numbers';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  phoneContact?: PhoneContact;
  onUpdate?: (data: PhoneContact) => void;
};

const AddEditNumber: FunctionComponent<Props> = ({
  phoneContact,
  onUpdate,
}) => {
  const phoneTypeOptions = [
    {
      value: 'CELL',
      dropdownDisplay: (
        <EuiText size="s">
          <FaMobileAlt /> Mobile
        </EuiText>
      ),
      inputDisplay: <FaMobileAlt />,
    },
    {
      value: 'WORK',
      dropdownDisplay: (
        <EuiText size="s">
          <ImUserTie /> Work
        </EuiText>
      ),
      inputDisplay: <ImUserTie />,
    },
    {
      value: 'HOME',
      dropdownDisplay: (
        <EuiText size="s">
          <FaHome /> Home
        </EuiText>
      ),
      inputDisplay: <FaHome />,
    },
    {
      value: 'INTERNATIONAL',
      dropdownDisplay: (
        <EuiText size="s">
          <FaGlobe /> International
        </EuiText>
      ),
      inputDisplay: <FaGlobe />,
    },
    {
      value: 'CUSTOM',
      dropdownDisplay: (
        <EuiText size="s">
          <FaRegQuestionCircle /> Other
        </EuiText>
      ),
      inputDisplay: <FaRegQuestionCircle />,
    },
  ];
  const [phoneType, setSelectedPhoneType] = useState(
    phoneContact?.type || phoneTypeOptions[0].value
  );
  const [phoneNumber, setPhoneNumber] = useState(phoneContact?.value || null);
  const [isInvalid, setIsInvalid] = useState(false);
  const { nextId } = useContext(CanvassingContext);

  const onChangePhoneType = value => {
    setSelectedPhoneType(value);
  };

  const handleUpdate = () => {
    // validate
    if (phoneNumber.length !== 10) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);

    if (phoneContact) {
      // do edit
      onUpdate({
        ...phoneContact,
        value: phoneNumber,
        category: 'PHONE',
        type: phoneType,
      });
    } else {
      // do add
      onUpdate({
        key: nextId(),
        value: phoneNumber,
        type: phoneType,
        category: 'PHONE',
        canContact: true,
      });
      setSelectedPhoneType(phoneTypeOptions[0].value);
      setPhoneNumber('');
    }
  };

  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem grow={false} css={{ minWidth: '40px' }}>
        <EuiFormRow display="rowCompressed">
          <EuiSuperSelect
            compressed
            fullWidth
            aria-label="Select phone number type"
            placeholder="Select..."
            options={phoneTypeOptions}
            valueOfSelected={phoneType || phoneTypeOptions[0].value}
            onChange={onChangePhoneType}
            popoverProps={{
              panelStyle: { minWidth: '140px' },
            }}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow
          display="rowCompressed"
          isInvalid={isInvalid}
          error="Enter a valid 10 digit phone number ">
          <EuiFieldText
            compressed
            placeholder="Enter a phone number"
            value={phoneNumber}
            isInvalid={isInvalid}
            inputMode="numeric"
            onChange={e =>
              setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))
            }
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            disabled={!phoneNumber}
            size="s"
            css={{ minWidth: '50px' }}
            onClick={handleUpdate}>
            {phoneContact?.key ? 'Save' : 'Add'}
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditNumber;
