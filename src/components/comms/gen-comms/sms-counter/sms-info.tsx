import React, { FunctionComponent, useRef, useState } from 'react';
import { SmsInfoType } from '.';
import {
  EuiButtonIcon,
  EuiCallOut,
  EuiSpacer,
  EuiToolTip,
  copyToClipboard,
} from '@elastic/eui';

const specialCharacters = [
  '{',
  '}',
  '[',
  ']',
  '|',
  '\\',
  '~',
  '^',
  '“',
  '”',
  '‘',
  '’',
  '€',
  '£',
  '`',
  '¥',
  '@',
  '!',
  '?',
  '$',
  '&',
  '%',
  '^',
  '#',
  '*',
  '=',
  '+',
  '-',
  '~',
  '<',
  '>',
  ';',
  '.',
  ':',
  '_',
];

export type Props = {
  smsInfo: SmsInfoType;
  messages: string[];
};

const SmsInfo: FunctionComponent<Props> = ({ messages, smsInfo }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isTextCopied, setTextCopied] = useState(false);

  const onClick = () => {
    if (buttonRef.current) {
      buttonRef.current.focus();
      copyToClipboard(messages.toString());
      setTextCopied(true);
    }
  };

  const onBlur = () => {
    setTextCopied(false);
  };

  function containsSpecialCharacters(messages) {
    for (const message of messages) {
      for (const char of specialCharacters) {
        if (message.includes(char)) {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <>
      {containsSpecialCharacters(messages) && (
        <>
          <EuiSpacer size="m" />
          <EuiCallOut
            size="s"
            color="warning"
            title="Highlighted characters decrease the number of characters per sms allowed"
            iconType="warning"
          />
          <EuiSpacer size="xs" />
        </>
      )}

      <div
        style={{
          ...(smsInfo.inCurrentMessage > 0 && {
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
          }),
        }}>
        {messages?.map((message, messageIndex) => {
          const parts = [];
          for (
            let i = 0;
            i < message.length;
            i += smsInfo.characterPerMessage
          ) {
            parts.push(message.substring(i, i + smsInfo.characterPerMessage));
          }

          return (
            <div key={messageIndex}>
              {parts.map((part, partIndex) => (
                <div key={partIndex}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <div>
                      SMS {smsInfo.messages - parts.length + partIndex + 1}
                    </div>
                    <EuiToolTip
                      content={isTextCopied ? 'Text copied' : 'Copy text'}>
                      <EuiButtonIcon
                        buttonRef={buttonRef}
                        aria-label="Copy text to clipboard"
                        color="text"
                        iconType="copy"
                        onClick={onClick}
                        onBlur={onBlur}
                      />
                    </EuiToolTip>
                  </div>
                  <EuiSpacer size="xs" />
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '2px',
                    }}>
                    {part.split('').map((char, charIndex) => (
                      <div
                        key={charIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: specialCharacters.includes(char)
                            ? '#FFDADA'
                            : 'transparent',
                          padding: '1px',
                          border: specialCharacters.includes(char)
                            ? '1px solid #a0a0a0'
                            : '1px solid #d3d3d3',
                          borderRadius: '2px',
                          fontWeight: 'bold',
                          color: specialCharacters.includes(char)
                            ? //   ? '#155fa2'
                              '#inherit'
                            : 'inherit',
                          width: '18px',
                          height: '18px',
                          fontSize: '12px',
                        }}>
                        {char}
                      </div>
                    ))}
                  </div>
                  <EuiSpacer size="xs" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SmsInfo;
