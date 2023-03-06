import { FunctionComponent, useState } from 'react';
import { EuiCheckableCard, useGeneratedHtmlId } from '@elastic/eui';
import { ITag } from './types';

export type Props = {
  tag: ITag;
};

const CanvassingTag: FunctionComponent<Props> = ({ tag }) => {
  const [isSelected, setIsSelected] = useState(false);
  const checkboxCardId = useGeneratedHtmlId({ prefix: 'checkboxCard' });

  return (
    <EuiCheckableCard
      id={checkboxCardId}
      label={tag.description}
      checkableType="checkbox"
      checked={isSelected}
      onChange={() => setIsSelected(!isSelected)}
    />
  );
};

export default CanvassingTag;
