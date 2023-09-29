import React, { FunctionComponent } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiStat,
  EuiSpacer,
  EuiFlexGrid,
} from '@elastic/eui';
import { CommsFetchResponse } from '@lib/hooks/useCountAndCost';
import { SmsInfoType } from '.';

export type Props = {
  smsInfo: SmsInfoType;
  mode: string;
  countCost: CommsFetchResponse;
  smsCost: string;
};

const SMSStats: FunctionComponent<Props> = ({
  smsInfo,
  mode,
  countCost,
  smsCost,
}) => {
  return (
    <div>
      <EuiFlexGroup>
        {mode === 'sms' && (
          <>
            <EuiFlexItem>
              <EuiStat
                titleSize="xs"
                title={`${smsInfo.length}`}
                description="Characters"
                textAlign="center"
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiStat
                titleSize="xs"
                title={`${smsInfo.remaining}`}
                description="Remaining"
                textAlign="center"
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiStat
                titleSize="xs"
                title={`${smsInfo.messages}`}
                description="SMS per Msg"
                textAlign="center"
              />
            </EuiFlexItem>
            <EuiSpacer size="m" />
          </>
        )}
      </EuiFlexGroup>
      <EuiFlexGrid columns={mode === 'sms' ? 2 : 4}>
        <EuiFlexItem>
          <EuiStat
            title={countCost ? countCost?.count : 'Unknown'}
            description={
              mode === 'sms'
                ? 'Number of phone numbers'
                : 'Number of email addresses'
            }
            titleSize="xxs"
            textAlign="center"
          />
        </EuiFlexItem>
        {mode === 'sms' && (
          <EuiFlexItem>
            <EuiStat
              textAlign="center"
              title={smsCost ? `${smsCost}` : 'Unknown'}
              description="Total Cost"
              titleSize="xxs"
            />
          </EuiFlexItem>
        )}
      </EuiFlexGrid>
      <EuiSpacer size="s" />
    </div>
  );
};

export default SMSStats;
