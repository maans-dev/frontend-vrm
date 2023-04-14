import { EuiCheckableCard, EuiFlexItem } from '@elastic/eui';
import { FunctionComponent } from 'react';

export type Props = {
  label?: string;
  isNew?: boolean;
  onDelete?: (label: string) => void;
};

const Tag: FunctionComponent<Props> = ({ label, isNew, onDelete }) => {
  return (
    <EuiFlexItem>
      <EuiCheckableCard
        css={{
          borderColor: isNew ? '#155FA2' : '#cecece',
          filter: isNew ? null : 'grayscale(1)',
        }}
        id={label}
        label={label}
        checkableType="checkbox"
        checked={true}
        onChange={() => {
          onDelete(label);
        }}
      />
    </EuiFlexItem>
  );
};

export default Tag;
