import { FunctionComponent } from 'react';
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from '@elastic/eui';
import { Contact2 } from '@lib/domain/person';

export type Props = {
  contact?: Contact2;
  onUpdate?: (item: Contact2) => void;
};

const AddEditEmail: FunctionComponent<Props> = ({ contact, onUpdate }) => {
  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText
            compressed
            placeholder="dave@example.com"
            value={contact ? contact?.value : null}
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

export default AddEditEmail;
