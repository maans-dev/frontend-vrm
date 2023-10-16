/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent, useEffect, useState } from 'react';

import {
  EuiBreadcrumb,
  EuiHorizontalRule,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiSpacer,
  EuiText,
  euiPaletteForStatus,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { HeaderPrimary } from '@components/header/header-primary';
import { HeaderSecondary } from '@components/header/header-secondary';
import Spinner from '@components/spinner/spinner';
import Announcement from '@components/announcement';
import { Roles } from '@lib/domain/auth';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

const DisclosureNoticeModal = dynamic(
  () => import('@components/disclosure-notice/disclosure-modal'),
  {
    ssr: false,
  }
);

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

  const [showSubHeader, setShowSubHeader] = useState(false);
  // const [showCanvassHeader, setShowCanvassHeader] = useState(false);
  const { data: session } = useSession();
  const hasFeature = (feature: string) => session?.features.includes(feature);

  useEffect(() => {
    setShowSubHeader(
      router.route !== '/' &&
        router.route !== '/403' &&
        !router.route.startsWith('/auth')
    );
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

  const palette = euiPaletteForStatus(5);

  return (
    <div css={{ position: 'relative' }}>
      <DisclosureNoticeModal />
      <Spinner show={showSpinner} />
      <EuiPageTemplate
        style={{
          paddingTop: showSubHeader ? `${96}px` : '0px',
        }}
        panelled={panelled}
        restrictWidth={true}
        responsive={[]}
        {...rest}>
        <HeaderPrimary />

        {showSubHeader ? <HeaderSecondary breadcrumb={breadcrumb} /> : null}

        {hasFeature('announce-error') && session.announceError && (
          <div
            style={{
              position: 'sticky',
              top: showSubHeader ? '96px' : '48px',
              zIndex: 999,
            }}>
            <Announcement
              backgroundColor={palette[4]}
              textColor="white"
              message={session.announceError}
            />
          </div>
        )}

        {hasFeature('announce-warning') && session.announceWarning && (
          <Announcement
            backgroundColor={palette[2]}
            textColor="black"
            message={session.announceWarning}
          />
        )}

        {hasFeature('announce-info') && session.announceInfo && (
          <Announcement
            backgroundColor={palette[1]}
            textColor="black"
            message={session.announceInfo}
          />
        )}

        <EuiSpacer size="s" />

        <EuiPageTemplate.Section
          grow={true}
          paddingSize="m"
          restrictWidth={restrictWidth === undefined ? 800 : restrictWidth}
          alignment={alignment || 'top'}
          contentProps={{ css: { flexGrow: 1 } }}
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
