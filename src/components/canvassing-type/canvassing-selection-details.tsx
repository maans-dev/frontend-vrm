import { EuiCallOut, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { CanvassingContext } from '@lib/context/canvassing.context';
import moment from 'moment';
import { FunctionComponent, useContext } from 'react';

export const CanvassingSelectionDetails: FunctionComponent = () => {
  const { campaign, canvassingType, canvasser, canvassDate } =
    useContext(CanvassingContext);

  return (
    <EuiCallOut iconType="iInCircle" size="s">
      <EuiFlexGroup
        direction="row"
        responsive={false}
        gutterSize="m"
        justifyContent="spaceEvenly"
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
              {canvasser.givenName} {canvasser?.surname} (
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
    </EuiCallOut>
  );
};
