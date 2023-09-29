import React, { Fragment, FunctionComponent } from 'react';
import { EuiSpacer } from '@elastic/eui';
import SmsInfo from './sms-info';

export type Props = {
  smsInfo: SmsInfoType;
  smsText: string;
};

export interface SmsInfoType {
  encoding: string;
  length: number;
  characterPerMessage: number;
  inCurrentMessage: number;
  remaining: number;
  messages: number;
}

const SmsMessage: FunctionComponent<Props> = ({ smsInfo, smsText }) => {
  const renderHighlightedText = () => {
    const messages = smsText?.split('\n');

    return <SmsInfo messages={messages} smsInfo={smsInfo} />;
  };

  return (
    <>
      {renderHighlightedText()}
      <EuiSpacer size="m" />
    </>
  );
};

export default SmsMessage;
