import { FunctionComponent } from 'react';
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPanel,
} from '@elastic/eui';
import { Phone } from './types';
import PhoneNumberLine from './phone-number';
import AddEditNumber from './add-edit-number';

export type Props = {
  items: Phone[];
};

const PhoneNumbers: FunctionComponent<Props> = ({ items }) => {
  const phoneTypeOptions = [
    { label: 'Mobile' },
    { label: 'Home' },
    { label: 'Work' },
    { label: 'International' },
    { label: 'Other' },
  ];

  return (
    <EuiPanel hasBorder={true} paddingSize="s">
      {items.map((item: Phone, i) => (
        <PhoneNumberLine phone={item} key={i} border={true} />
      ))}
      {/* <EuiButton iconType="plusInCircle" fullWidth size="s" fill>
        Add phone number
      </EuiButton> */}
      <AddEditNumber />
    </EuiPanel>
  );
};

export default PhoneNumbers;
