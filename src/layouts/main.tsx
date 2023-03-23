/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent, useEffect, useState } from 'react';

import {
  EuiBreadcrumb,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiText,
  EuiThemeProvider,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { HeaderPrimary } from '@components/header/header-primary';
import { HeaderSecondary } from '@components/header/header-secondary';
import Spinner from '@components/spinner/spinner';

export type Props = {
  breadcrumb?: EuiBreadcrumb[];
  alignment?: 'top' | 'center' | 'horizontalCenter';
  panelled?: boolean;
  restrictWidth?: string | number | boolean;
  pageTitle?: string;
  showSpinner?: boolean;
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

  useEffect(() => {
    setShowSubHeader(router.route !== '/');
  }, [router.route]);

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
        // css={{ minHeight: 'calc(100vh -  96px)' }}
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
        <EuiPageTemplate.BottomBar paddingSize="s">
          <EuiThemeProvider colorMode="light">
            <EuiFlexGroup
              responsive={false}
              justifyContent="center"
              gutterSize="m">
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty color="primary" size="xs">
                  Help
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty color="success" size="xs">
                  Support
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiThemeProvider>
        </EuiPageTemplate.BottomBar>
      </EuiPageTemplate>
    </div>
  );
};

export default MainLayout;
