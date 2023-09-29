import React, { FunctionComponent } from 'react';
import {
  EuiCheckableCard,
  EuiFormFieldset,
  EuiFormRow,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';
import { IBulkCommsOwnSendType } from '.';

export type Props = {
  sendByOption: string;
  handleSendByChange: (option: string) => void;
};

const SendBySelection: FunctionComponent<Props> = ({
  sendByOption,
  handleSendByChange,
}) => {
  const BulkCommsOwnSendTypes: IBulkCommsOwnSendType[] = [
    { id: 'FHO', name: 'I want the above message to be sent by FHO' },
    { id: 'MYSELF', name: 'I want to download a list to send myself' },
  ];
  return (
    <EuiFormFieldset
      legend={{ children: 'By whom do you want this message to be sent?' }}>
      <EuiFormRow fullWidth display="rowCompressed">
        <div>
          {BulkCommsOwnSendTypes.map((item: IBulkCommsOwnSendType) => (
            <EuiFlexItem key={item.id} grow={false} style={{ minWidth: 100 }}>
              <EuiSpacer size="xs" />
              <EuiCheckableCard
                id={item.id}
                label={item.name}
                value={item.name}
                checked={sendByOption === item.name}
                onChange={() => handleSendByChange(item.name)}
              />
              <EuiSpacer size="xs" />
            </EuiFlexItem>
          ))}
        </div>
      </EuiFormRow>
    </EuiFormFieldset>
  );
};

export default SendBySelection;
