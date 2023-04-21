/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent, useEffect, useState } from 'react';

import {
  EuiBreadcrumb,
  EuiHorizontalRule,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiText,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { HeaderPrimary } from '@components/header/header-primary';
import { HeaderSecondary } from '@components/header/header-secondary';
import Spinner from '@components/spinner/spinner';
import { Roles } from '@lib/domain/auth';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@components/footer/footer'), {
  ssr: false,
});

export type Props = {
  breadcrumb?: EuiBreadcrumb[];
  alignment?: 'top' | 'center' | 'horizontalCenter';
  panelled?: boolean;
  restrictWidth?: string | number | boolean;
  pageTitle?: string;
  showSpinner?: boolean;
  role?: Roles;
};

const MainLayout: FunctionComponent<EuiPageTemplateProps & Props> = ({
  children,
  breadcrumb,
  pageTitle,
  alignment,
  panelled,
  restrictWidth,
  showSpinner,
  ...rest
}) => {
  const router = useRouter();
  // const { euiTheme } = useEuiTheme();

  const [showSubHeader, setShowSubHeader] = useState(false);
  // const [showCanvassHeader, setShowCanvassHeader] = useState(false);

  useEffect(() => {
    setShowSubHeader(router.route !== '/' && router.route !== '/403');
    // eslint-disable-next-line prettier/prettier
    // setShowCanvassHeader(router.route === '/canvass/voter-search' || router.route === '/canvass/voter/[voterKey]' || router.route === '/capture/voter-capture/[voterKey]' || router.route === '/capture/capturing-search' );
  }, [router, router.route]);

  const renderPageTitle = (
    <>
      <EuiText size="xs">
        <h2>{pageTitle}</h2>
      </EuiText>
      <EuiHorizontalRule margin="m" color="lightgray" />
    </>
  );

  return (
    <div css={{ position: 'relative' }}>
      <Spinner show={showSpinner} />
      <EuiPageTemplate
        style={{
          paddingTop: showSubHeader ? '96px' : '0px',
        }}
        panelled={panelled}
        restrictWidth={true}
        {...rest}>
        <HeaderPrimary />

        {showSubHeader ? <HeaderSecondary breadcrumb={breadcrumb} /> : null}

        <EuiPageTemplate.Section
          grow={true}
          paddingSize="m"
          restrictWidth={restrictWidth === undefined ? 800 : restrictWidth}
          alignment={alignment || 'top'}
          bottomBorder={false}>
          {pageTitle ? renderPageTitle : null}
          {children}
        </EuiPageTemplate.Section>
        <Footer />
      </EuiPageTemplate>
    </div>
  );
};

export default MainLayout;
