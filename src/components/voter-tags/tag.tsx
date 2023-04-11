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
      {/* <EuiBadge
        css={{
          '.euiBadge__text': {
            borderLeft: '1px solid #CBD2D9',
            paddingLeft: '5px',
          },
        }}
        color={isNew ? '#155fa2' : 'hollow'}
        iconType={FaTimesCircle}
        iconSide="left"
        iconOnClick={() => onDelete(label)}
        iconOnClickAriaLabel={`Remove tag "${label}"`}>
        {label}
      </EuiBadge> */}
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
