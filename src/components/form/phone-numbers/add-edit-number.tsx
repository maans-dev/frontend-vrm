import { FunctionComponent, useState } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFieldNumber,
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
};

const AddEditNumber: FunctionComponent<Props> = ({ item }) => {
  const [selectedPhoneType, setSelectedPhoneType] = useState(null);

  const onChangePhoneType = value => {
    setSelectedPhoneType(value);
  };

  const phoneTypeOptions = [
    { value: 'Mobile', inputDisplay: <FaMobileAlt /> },
    { value: 'Home', inputDisplay: <FaHome /> },
    { value: 'Work', inputDisplay: <ImUserTie /> },
    { value: 'International', inputDisplay: <FaGlobe /> },
    { value: 'Other', inputDisplay: <FaRegQuestionCircle /> },
  ];

  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem grow={false} css={{ minWidth: '50px' }}>
        <EuiFormRow display="rowCompressed">
          <EuiSuperSelect
            compressed
            aria-label="Select phone number type"
            placeholder="Select..."
            options={phoneTypeOptions}
            valueOfSelected={selectedPhoneType}
            onChange={onChangePhoneType}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText compressed placeholder="012 456 7890" />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            // iconType="plus"
            // iconSize="s"
            size="s"
            css={{ minWidth: '50px' }}>
            Add
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditNumber;
