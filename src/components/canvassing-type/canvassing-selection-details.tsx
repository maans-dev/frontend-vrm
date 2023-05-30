import { EuiFlexGroup, EuiFlexItem, EuiPanel } from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { renderName } from '@lib/person/utils';
import moment from 'moment';
import { FunctionComponent, useContext } from 'react';

export const CanvassingSelectionDetails: FunctionComponent = () => {
  const { campaign, canvassingType, canvasser, canvassDate } =
    useContext(CanvassingContext);

  return (
    <EuiPanel
      hasShadow={false}
      hasBorder={true}
      paddingSize="s"
      css={{ background: '#D0DFEC' }}>
      <EuiFlexGroup
        direction="row"
        responsive={false}
        gutterSize="m"
        justifyContent="spaceBetween"
        css={{ marginInline: '8px' }}
        wrap={false}>
        <EuiFlexItem grow={false}>
          Campaign
          <strong>{campaign?.name}</strong>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          Type
          <strong>{canvassingType?.name}</strong>
        </EuiFlexItem>
        {canvasser && (
          <EuiFlexItem grow={false}>
            Canvasser
            <strong>
              {renderName(canvasser)} (
              {moment().diff(canvasser.dob, 'years', false)})
            </strong>
          </EuiFlexItem>
        )}
        {canvassDate && (
          <EuiFlexItem grow={false}>
            Date
            <strong>{canvassDate.format('YYYY-DD-MM')}</strong>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </EuiPanel>
  );
};
