/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { EuiHeader, EuiHeaderSectionItem, EuiText } from '@elastic/eui';
import router from 'next/router';
import { FunctionComponent } from 'react';
import { UserBadge } from './user-badge';

export const HeaderPrimary: FunctionComponent = () => {
  return (
    <EuiHeader
      theme="dark"
      position="fixed"
      className="main-header"
      sections={[
        {
          items: [
            <EuiHeaderSectionItem key="da-logo">
              <img
                onClick={() => router.push('/')}
                style={{ cursor: 'pointer' }}
                src="/images/logo-with-white-text.svg"
                alt="DA Logo"
                width="70px"
              />{' '}
            </EuiHeaderSectionItem>,
            <EuiText
              key="app-title"
              size="m"
              color="white"
              css={{
                marginLeft: '10px',
                paddingLeft: '10px',
                opacity: 0.6,
                borderLeft: '1px solid #ffffff50',
              }}>
              <strong> VRM</strong>
            </EuiText>,
          ],
        },
        {
          items: [<UserBadge key="user-badge" />],
        },
      ]}></EuiHeader>
  );
};
