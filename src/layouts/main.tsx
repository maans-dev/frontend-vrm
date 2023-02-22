/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, useEffect, useState } from 'react';
import { MainLayoutStyles } from './main.styles';
import {
  EuiBadge,
  EuiBreadcrumb,
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
  // const { euiTheme } = useEuiTheme();

  const header: EuiPageHeaderProps = {
    pageTitle: pageTitle,
    description: pageDescription,
    paddingSize: 's',
  };

  const breadcrumbs: EuiBreadcrumb[] = [
    {
      text: 'Canvassing',
      href: '#',
      onClick: e => {
        e.preventDefault();
      },
    },
    {
      text: 'Search',
    },
  ];

  const [showSubHeader, setShowSubHeader] = useState(false);

  useEffect(() => {
    setShowSubHeader(router.route !== '/');
  }, [router.route]);

  return (
    <div
      css={styles.mainWrapper}
      style={{ paddingTop: showSubHeader ? '55px' : '0px' }}>
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
      {showSubHeader ? (
        <EuiHeader
          position="fixed"
          sections={[
            {
              breadcrumbs: breadcrumbs,
              borders: 'right',
            },
          ]}
        />
      ) : null}
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
