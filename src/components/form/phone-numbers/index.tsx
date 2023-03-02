import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import { Phone } from './types';
import PhoneNumberLine from './phone-number';
import AddEditNumber from './add-edit-number';

export type Props = {
  items: Phone[];
};

const PhoneNumbers: FunctionComponent<Props> = ({ items }) => {
  return (
    <EuiPanel hasBorder={true} paddingSize="s">
      {items.map((item: Phone, i) => (
        <PhoneNumberLine phone={item} key={i} border={true} />
      ))}
      <AddEditNumber />
    </EuiPanel>
  );
};

export default PhoneNumbers;
