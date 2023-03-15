import { FunctionComponent, useState } from 'react';
import { EuiCheckableCard, useGeneratedHtmlId } from '@elastic/eui';
import { Field } from '@lib/domain/person';

export type Props = {
  field: Partial<Field>;
  onChange?: () => void;
};

const CanvassingTag: FunctionComponent<Props> = ({ field, onChange }) => {
  const [isSelected, setIsSelected] = useState<boolean>(field.value as boolean);
  const checkboxCardId = useGeneratedHtmlId({ prefix: 'checkboxCard' });

  return (
    <EuiCheckableCard
      id={checkboxCardId}
      label={field.field.name}
      checkableType="checkbox"
      checked={isSelected}
      onChange={() => {
        setIsSelected(!isSelected);
        onChange();
      }}
    />
  );
};

export default CanvassingTag;
