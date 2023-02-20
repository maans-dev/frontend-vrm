import { FunctionComponent } from 'react';
import { MainLayoutStyles } from './main.styles';
import {
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderLogo,
  EuiPageTemplate,
  EuiPageTemplateProps,
  useGeneratedHtmlId,
} from '@elastic/eui';
import ThemeSwitcher from '../components/chrome/theme_switcher';
import { useRouter } from 'next/router';

const MainLayout: FunctionComponent<EuiPageTemplateProps> = ({
  children,
  ...rest
}) => {
  const styles = MainLayoutStyles();
  const router = useRouter();

  return (
    <div css={styles.mainWrapper}>
      <EuiHeader
        // theme="dark"
        position="fixed"
        sections={[
          {
            items: [
              <EuiHeaderLogo
                key="vrm-logo"
                iconType="graphApp"
                onClick={() => router.push('/')}
                style={{ cursor: 'pointer' }}>
                VRM
              </EuiHeaderLogo>,
            ],
            borders: 'right',
          },
          {
            items: [
              // eslint-disable-next-line react/jsx-key
              <EuiHeaderLinks
                hidden={router.route === '/'}
                style={{ display: router.route === '/' ? 'none' : 'block' }}>
                <EuiHeaderLink
                  iconType="layers"
                  isActive={router.route == '/campaigns'}
                  onClick={() => router.push('/campaigns')}>
                  Campaigns
                </EuiHeaderLink>

                <EuiHeaderLink
                  iconType="dashboardApp"
                  isActive={router.route == '/contacts'}
                  onClick={() => router.push('/contacts')}>
                  Contacts
                </EuiHeaderLink>

                <EuiHeaderLink
                  iconType="advancedSettingsApp"
                  isActive={router.route == '/config'}
                  onClick={() => router.push('/config')}>
                  Config
                </EuiHeaderLink>
              </EuiHeaderLinks>,
            ],
          },
          {
            items: [<ThemeSwitcher key={useGeneratedHtmlId()} />],
            borders: 'none',
          },
        ]}></EuiHeader>

      <div css={styles.contentWrapper}>
        <EuiPageTemplate panelled={false} restrictWidth={true} {...rest}>
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
