import React, { ChangeEvent, FunctionComponent } from 'react';
import {
  EuiFormFieldset,
  EuiFormRow,
  EuiTextArea,
  EuiSpacer,
  EuiFlexItem,
} from '@elastic/eui';
import SMSStats from './sms-counter/sms-stats';
import SmsMessage, { SmsInfoType } from './sms-counter';
import { CommsFetchResponse } from '@lib/hooks/useCountAndCost';
interface Props {
  mode?: string;
  handleTextChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  smsInfo?: SmsInfoType;
  smsText?: string;
  purpose?: string;
  onPurposeChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  countCost?: CommsFetchResponse;
  smsCost?: string;
}

const SmsPurposeFieldset: FunctionComponent<Props> = ({
  onPurposeChange,
  purpose,
}) => (
  <EuiFormFieldset
    legend={{ children: 'What is the purpose of your message?' }}>
    <EuiFormRow fullWidth display="rowCompressed">
      <EuiTextArea
        maxLength={1000}
        compressed
        fullWidth
        onChange={onPurposeChange}
        value={purpose}
      />
    </EuiFormRow>
  </EuiFormFieldset>
);

const SmsMessageFieldset: FunctionComponent<Props> = ({
  handleTextChange,
  smsInfo,
  smsText,
  countCost,
  smsCost,
}) => (
  <>
    <EuiSpacer size="m" />
    <EuiFormFieldset legend={{ children: 'What is your message?' }}>
      <EuiFormRow fullWidth display="rowCompressed">
        <EuiFlexItem>
          <EuiTextArea
            fullWidth
            contentEditable
            onChange={handleTextChange}
            maxLength={640}
            value={smsText}
          />
          <SmsMessage smsInfo={smsInfo} smsText={smsText} />
        </EuiFlexItem>
      </EuiFormRow>
      <SMSStats
        smsInfo={smsInfo}
        mode="sms"
        countCost={countCost}
        smsCost={smsCost}
      />
    </EuiFormFieldset>
  </>
);

const EmailMessageFieldset: FunctionComponent<Props> = ({
  smsInfo,
  onPurposeChange,
  purpose,
  countCost,
  smsCost,
}) => (
  <>
    <SmsPurposeFieldset onPurposeChange={onPurposeChange} purpose={purpose} />
    <EuiSpacer size="m" />
    <EuiFormFieldset legend={{ children: 'Message Info' }}>
      <SMSStats
        smsInfo={smsInfo}
        mode="email"
        countCost={countCost}
        smsCost={smsCost}
      />
    </EuiFormFieldset>
  </>
);

const MessageSection: FunctionComponent<Props> = ({
  mode,
  handleTextChange,
  smsInfo,
  smsText,
  purpose,
  onPurposeChange,
  countCost,
  smsCost,
}) => {
  if (mode === 'sms') {
    return (
      <>
        <SmsPurposeFieldset
          purpose={purpose}
          onPurposeChange={onPurposeChange}
        />
        <SmsMessageFieldset
          smsCost={smsCost}
          handleTextChange={handleTextChange}
          smsInfo={smsInfo}
          smsText={smsText}
          countCost={countCost}
        />
      </>
    );
  } else if (mode === 'email') {
    return (
      <EmailMessageFieldset
        smsCost={smsCost}
        smsInfo={smsInfo}
        purpose={purpose}
        countCost={countCost}
        onPurposeChange={onPurposeChange}
      />
    );
  }

  return null;
};

export default MessageSection;
