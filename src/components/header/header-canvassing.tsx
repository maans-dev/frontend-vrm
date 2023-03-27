import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiHeader } from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { FunctionComponent, useContext } from 'react';

export const HeaderCanvassing: FunctionComponent = () => {
  const { campaign, canvassingType } = useContext(CanvassingContext);
  return (
    <EuiHeader
      position="fixed"
      color="#ffcc00"
      css={{
        top: '90px !important',
        height: '36px !important',
      }}
      sections={[
        {
          items: [
            <EuiFlexGroup
              key="1"
              direction="row"
              responsive={false}
              gutterSize="s"
              css={{ marginInline: '8px' }}>
              <EuiFlexItem grow={false}>
                <EuiBadge key="1" color="default" css={{ maxWidth: '250px' }}>
                  {campaign?.name}
                </EuiBadge>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiBadge key="2" color="default">
                  {canvassingType?.name}
                </EuiBadge>
              </EuiFlexItem>
            </EuiFlexGroup>,
          ],
          borders: 'right',
        },
      ]}
    />
  );
};
