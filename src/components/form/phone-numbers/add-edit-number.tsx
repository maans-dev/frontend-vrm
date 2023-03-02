import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSuperSelect,
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
    { value: 'Mobile', inputDisplay: <FaMobileAlt /> },
    { value: 'Home', inputDisplay: <FaHome /> },
    { value: 'Work', inputDisplay: <ImUserTie /> },
    { value: 'International', inputDisplay: <FaGlobe /> },
    { value: 'Other', inputDisplay: <FaRegQuestionCircle /> },
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
            aria-label="Select phone number type"
            placeholder="Select..."
            options={phoneTypeOptions}
            valueOfSelected={selectedPhoneType || phoneTypeOptions[0].value}
            onChange={onChangePhoneType}
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
