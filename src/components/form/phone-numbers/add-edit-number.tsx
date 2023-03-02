import { FunctionComponent } from 'react';
import {
  EuiAvatar,
  EuiButton,
  EuiFieldNumber,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiPanel,
} from '@elastic/eui';
import { Phone } from './types';
import PhoneNumberLine from './phone-number';

export type Props = {
  item?: Phone;
};

const AddEditNumber: FunctionComponent<Props> = ({ item }) => {
  const phoneTypeOptions = [
    { label: 'Mobile' },
    { label: 'Home' },
    { label: 'Work' },
    { label: 'International' },
    { label: 'Other' },
  ];

  return (
    <EuiFlexGroup responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiFieldNumber compressed max={10} placeholder="42" />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText compressed placeholder="012 456 7890" />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButton size="s">Save</EuiButton>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditNumber;
