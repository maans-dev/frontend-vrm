import { FunctionComponent, useEffect, useState } from 'react';
import { EuiCheckableCard, useGeneratedHtmlId } from '@elastic/eui';
import { Field } from '@lib/domain/person';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { useSession } from 'next-auth/react';

export type Props = {
  field: Partial<Field>;
  onChange?: (f: Partial<Field>) => void;
};

const CanvassingTag: FunctionComponent<Props> = ({ field, onChange }) => {
  const [isSelected, setIsSelected] = useState<boolean>(field.value as boolean);
  const checkboxCardId = useGeneratedHtmlId({ prefix: 'checkboxCard' });
  const { data: session } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);

  useCanvassFormReset(() => {
    setIsSelected(field.value as boolean);
  });

  useEffect(() => {
    setIsSelected(field.value as boolean);
  }, [field]);

  return (
    <EuiCheckableCard
      id={checkboxCardId}
      label={field?.field?.name}
      checkableType="checkbox"
      checked={isSelected}
      disabled={field.field?.readOnly && !hasRole(Roles.SuperUser)}
      onChange={() => {
        setIsSelected(!isSelected);
        onChange({ ...field, value: !isSelected });
      }}
    />
  );
};

export default CanvassingTag;
