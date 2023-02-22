/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import { MainLayoutStyles } from './main.styles';
import {
  EuiHeader,
  EuiHeaderSectionItem,
  EuiPageHeaderProps,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiText,
} from '@elastic/eui';
import { useRouter } from 'next/router';
// import DALogo from '/images/logo-with-text.svg';

export type Props = {
  pageTitle?: string;
  pageDescription?: string;
};

const MainLayout: FunctionComponent<EuiPageTemplateProps & Props> = ({
  children,
  pageTitle,
  pageDescription,
  ...rest
}) => {
  const styles = MainLayoutStyles();
  const router = useRouter();

  const header: EuiPageHeaderProps = {
    pageTitle: pageTitle,
    description: pageDescription,
    paddingSize: 's',
  };

  return (
    <div css={styles.mainWrapper}>
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
              // eslint-disable-next-line react/jsx-key
              // <EuiHeaderLinks
              //   hidden={router.route === '/'}
              //   style={{ display: router.route === '/' ? 'none' : 'block' }}>
              //   <EuiHeaderLink
              //     iconType="layers"
              //     isActive={router.route == '/campaigns'}
              //     onClick={() => router.push('/campaigns')}>
              //     Campaigns
              //   </EuiHeaderLink>
              //   <EuiHeaderLink
              //     iconType="dashboardApp"
              //     isActive={router.route == '/contacts'}
              //     onClick={() => router.push('/contacts')}>
              //     Contacts
              //   </EuiHeaderLink>
              //   <EuiHeaderLink
              //     iconType="advancedSettingsApp"
              //     isActive={router.route == '/config'}
              //     onClick={() => router.push('/config')}>
              //     Config
              //   </EuiHeaderLink>
              // </EuiHeaderLinks>,
            ],
          },
        ]}></EuiHeader>

      <div css={styles.contentWrapper}>
        <EuiPageTemplate panelled={false} restrictWidth={true} {...rest}>
          ({pageTitle ? <EuiPageTemplate.Header {...header} /> : null})
          <EuiPageTemplate.Section
            grow={false}
            // color="subdued"
            bottomBorder={false}>
            {children}
          </EuiPageTemplate.Section>
        </EuiPageTemplate>
      </div>
    </div>
  );
};

export default MainLayout;
