import { FunctionComponent } from 'react';
import { EuiPanel } from '@elastic/eui';
import { EmailTypes } from './types';
import EmailAddressLine from './emaill-address';
import AddEditEmail from './add-edit-email';

export type Props = {
  items: EmailTypes[];
};

const EmailAddress: FunctionComponent<Props> = ({ items }) => {
  return (
    <EuiPanel hasBorder={true} paddingSize="s">
      {items.map((item: EmailTypes, i) => (
        <EmailAddressLine email={item} key={i} border={true} />
      ))}
      <AddEditEmail />
    </EuiPanel>
  );
};

export default EmailAddress;
