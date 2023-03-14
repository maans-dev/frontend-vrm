// import { FunctionComponent, useState, useEffect } from 'react';
// import { EuiCheckableCard, useGeneratedHtmlId } from '@elastic/eui';
// import { ITags } from './types';

// export type Props = {
//   tag: ITags;
//   selected: boolean;
//   onChange?: () => void;
// };

// const CanvassingTag: FunctionComponent<Props> = ({
//   tag,
//   selected,
//   onChange,
// }) => {
//   const [isSelected, setIsSelected] = useState(selected);
//   const checkboxCardId = useGeneratedHtmlId({ prefix: 'checkboxCard' });

//   return (
//     <EuiCheckableCard
//       id={checkboxCardId}
//       label={tag.description}
//       checkableType="checkbox"
//       checked={isSelected}
//       onChange={() => {
//         setIsSelected(!isSelected);
//         onChange();
//       }}
//     />
//   );
// };

// export default CanvassingTag;
