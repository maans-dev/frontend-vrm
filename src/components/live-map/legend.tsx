import Image from 'next/image';
import { imageLoader } from '@lib/loader';
import { eventIcons } from './icons';
import type { FunctionComponent } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer } from '@elastic/eui';

const order = [
  'canvass',
  'datacleanup',
  'membership',
  'vr-api-ad-hoc',
  'admin',
  'user-agreement',
  'default',
];

export const Legend: FunctionComponent = () => {
  return (
    <>
      <EuiText>
        Each pin that drops represents one activity recorded on VRM. The pin
        drops onto the voting district 5 seconds after the activity is recorded,
        and fades out after 1 minute.
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFlexGroup wrap responsive={false}>
        {order.map(key => {
          const icon = eventIcons[key];
          return (
            <EuiFlexItem key={key} grow={false}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                }}>
                <Image
                  loader={imageLoader}
                  src={icon.image}
                  alt={icon.alt}
                  width={22}
                  height={40}
                />
                <span style={{ flexGrow: 1, padding: '3px 5px' }}>
                  {icon.label}
                </span>
              </div>
            </EuiFlexItem>
          );
        })}
      </EuiFlexGroup>
    </>
  );
};
