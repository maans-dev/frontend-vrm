/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  EuiBadge,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiText,
} from '@elastic/eui';
import router from 'next/router';
import { FunctionComponent } from 'react';

export const HeaderPrimary: FunctionComponent = ({ children }) => {
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
          items: [
            <EuiBadge
              key="user"
              color="primary"
              iconType="arrowDown"
              iconSide="right">
              {/* <EuiAvatar name="John Smith" size="s" />{' '} */}
              <strong>John Smith</strong> (8210105080082)
            </EuiBadge>,
          ],
        },
      ]}></EuiHeader>
  );
};
