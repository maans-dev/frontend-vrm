// import { FunctionComponent } from 'react';
// import { EuiFlexGrid, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';
// import { ITags } from './types';
// import CanvassingTag from './canvassing-tag';

// export type Props = {
//   fields: ITags;
//   onTagClick?: (tag: ITags) => void;
// };

// const presetTags: ITags = {
//   fields: [
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'WR',
//         description: 'Will Register',
//         active: false,
//       },
//     },
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'ASTREG',
//         description: 'Assisted to register',
//         active: false,
//       },
//     },
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'DR',
//         description: 'Did register',
//         active: false,
//       },
//     },
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'WV',
//         description: "Won't vote",
//         active: false,
//       },
//     },
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'CV',
//         description: "Can't vote",
//         active: false,
//       },
//     },
//     {
//       field: {
//         category: 'Canvassing',
//         code: 'M',
//         description: 'Moved',
//         active: false,
//       },
//     },
//   ],
// };

// const CanvassingTags: FunctionComponent<Props> = ({ fields, onTagClick }) => {
//   const isMobile = useIsWithinBreakpoints(['xs', 's']);

//   // extract the fields array from the fields object
//   const tagFields = fields?.fields || [];

//   return (
//     <EuiFlexGrid
//       columns={isMobile ? 1 : 3}
//       direction="row"
//       gutterSize="s"
//       responsive={true}>
//       {tagFields.map((tag: ITags, i) => {
//         return (
//           <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
//             <CanvassingTag
//               tag={tag}
//               selected={tag.active}
//               onChange={() => {
//                 const updatedTag = { ...tag, enabled: !tag.enabled };
//                 onTagClick && onTagClick(updatedTag);
//               }}
//             />
//           </EuiFlexItem>
//         );
//       })}
//     </EuiFlexGrid>
//   );
// };

// export default CanvassingTags;
