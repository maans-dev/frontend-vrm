import { FunctionComponent } from 'react';
import { EuiFlexGrid, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';
import { ITag } from './types';
import CanvassingTag from './canvassing-tag';

export type Props = {
  tags: ITag[];
};

const CanvassingTags: FunctionComponent<Props> = ({ tags }) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);

  return (
    <EuiFlexGrid
      columns={isMobile ? 1 : 3}
      direction="row"
      gutterSize="s"
      responsive={true}>
      {tags?.map((item: ITag, i) => {
        return (
          <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
            <CanvassingTag tag={item} />
          </EuiFlexItem>
        );
      })}
    </EuiFlexGrid>
  );
};

export default CanvassingTags;
