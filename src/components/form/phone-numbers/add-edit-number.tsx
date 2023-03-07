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
import { Phone } from './types';
import {
  FaMobileAlt,
  FaRegQuestionCircle,
  FaHome,
  FaGlobe,
} from 'react-icons/fa';
import { ImUserTie } from 'react-icons/im';

export type Props = {
  item?: Phone;
  onUpdate?: (item: Phone) => void;
};

const AddEditNumber: FunctionComponent<Props> = ({ item, onUpdate }) => {
  const phoneTypeOptions = [
    {
      value: 'Mobile',
      dropdownDisplay: (
        <EuiText size="s">
          <FaMobileAlt /> Mobile
        </EuiText>
      ),
      inputDisplay: <FaMobileAlt />,
    },
    {
      value: 'Home',
      dropdownDisplay: (
        <EuiText size="s">
          <FaHome /> Home
        </EuiText>
      ),
      inputDisplay: <FaHome />,
    },
    {
      value: 'Work',
      dropdownDisplay: (
        <EuiText size="s">
          <ImUserTie /> Work
        </EuiText>
      ),
      inputDisplay: <ImUserTie />,
    },
    {
      value: 'International',
      dropdownDisplay: (
        <EuiText size="s">
          <FaGlobe /> International
        </EuiText>
      ),
      inputDisplay: <FaGlobe />,
    },
    {
      value: 'Other',
      dropdownDisplay: (
        <EuiText size="s">
          <FaRegQuestionCircle /> Other
        </EuiText>
      ),
      inputDisplay: <FaRegQuestionCircle />,
    },
  ];

  const [selectedPhoneType, setSelectedPhoneType] = useState(null);

  const onChangePhoneType = value => {
    setSelectedPhoneType(value);
  };

  useEffect(() => {
    if (item) setSelectedPhoneType(item.type);
  }, [item]);

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
            value={item ? item.number : null}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            size="s"
            css={{ minWidth: '50px' }}
            onClick={() => (item ? onUpdate(item) : null)}>
            {item ? 'Save' : 'Add'}
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditNumber;
