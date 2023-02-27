import { FunctionComponent } from 'react';
import {
  EuiButtonIcon,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui';

const PhoneNumbers: FunctionComponent = () => {
  const phoneTypeOptions = [
    { label: 'Home' },
    { label: 'Work' },
    { label: 'Mobile' },
    { label: 'aaa' },
    { label: 'bbb' },
    { label: 'ccc' },
  ];

  return (
    <EuiFlexGroup gutterSize="xs" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiComboBox
            style={{ minWidth: '100px' }}
            compressed
            isClearable={false}
            aria-label="Select phone number type"
            placeholder="Select..."
            singleSelection={{ asPlainText: true }}
            options={phoneTypeOptions}
            selectedOptions={[]}
            onChange={() => null}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText name="phone" compressed placeholder="012 456 7890" />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon display="base" iconType="check" size="s" />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon display="base" iconType="cross" size="s" />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon display="base" iconType="/icons/dnc.svg" size="s" />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default PhoneNumbers;
