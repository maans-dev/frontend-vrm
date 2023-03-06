import { FunctionComponent } from 'react';
import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from '@elastic/eui';
import { EmailTypes } from './types';

export type Props = {
  i?: EmailTypes;
  onUpdate?: (i: EmailTypes) => void;
};

const AddEditEmail: FunctionComponent<Props> = ({ i, onUpdate }) => {
  return (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem>
        <EuiFormRow display="rowCompressed">
          <EuiFieldText
            compressed
            placeholder="dave@example.com"
            value={i ? i.email : null}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow display="rowCompressed">
          <EuiButtonEmpty
            size="s"
            css={{ minWidth: '50px' }}
            onClick={() => (i ? onUpdate(i) : null)}>
            {i ? 'Save' : 'Add'}
          </EuiButtonEmpty>
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default AddEditEmail;
