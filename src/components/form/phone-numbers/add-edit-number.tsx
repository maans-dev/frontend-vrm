import { FunctionComponent, useEffect, useState } from 'react';
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
import { Contact, Contact2 } from '@lib/domain/person';

export type Props = {
  contact?: Contact;
  onUpdate?: (item: Contact2) => void;
};

const AddEditNumber: FunctionComponent<Props> = ({ contact, onUpdate }) => {
  const phoneTypeOptions = [
    {
      value: 'WORK',
      dropdownDisplay: (
        <EuiText size="s">
          <FaMobileAlt /> Mobile
        </EuiText>
      ),
      inputDisplay: <FaMobileAlt />,
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
      value: 'CELL',
      dropdownDisplay: (
        <EuiText size="s">
          <ImUserTie /> Work
        </EuiText>
      ),
      inputDisplay: <ImUserTie />,
    },
  ];

  const [selectedPhoneType, setSelectedPhoneType] = useState(null);

  const onChangePhoneType = value => {
    setSelectedPhoneType(value);
  };

  useEffect(() => {
    if (contact) setSelectedPhoneType(contact.type);
  }, [contact]);

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
            valueOfSelected={selectedPhoneType || phoneTypeOptions[0].value}
            onChange={onChangePhoneType}
            popoverProps={{
              panelStyle: { minWidth: '140px' },
            }}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText
            compressed
            placeholder="012 456 7890"
            value={contact ? contact.contact.value : null}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            size="s"
            css={{ minWidth: '50px' }}
            onClick={() => (contact ? onUpdate(contact) : null)}>
            {contact ? 'Save' : 'Add'}
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditNumber;
