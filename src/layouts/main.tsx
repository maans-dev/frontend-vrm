/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent, useEffect, useState } from 'react';

import {
  EuiBreadcrumb,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiThemeProvider,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { HeaderPrimary } from '@components/header/header-primary';
import { HeaderSecondary } from '@components/header/header-secondary';

export type Props = {
  breadcrumb?: EuiBreadcrumb[];
};

const MainLayout: FunctionComponent<EuiPageTemplateProps & Props> = ({
  children,
  breadcrumb,
  ...rest
}) => {
  const router = useRouter();
  // const { euiTheme } = useEuiTheme();

  const [showSubHeader, setShowSubHeader] = useState(false);

  useEffect(() => {
    setShowSubHeader(router.route !== '/');
  }, [router.route]);

  return (
    <EuiPageTemplate
      style={{
        paddingTop: showSubHeader ? '96px' : '0px',
      }}
      css={{ minHeight: 'calc(100vh -  96px)' }}
      panelled={false}
      restrictWidth={true}
      {...rest}>
      <HeaderPrimary />

      {showSubHeader ? <HeaderSecondary breadcrumb={breadcrumb} /> : null}

      <EuiPageTemplate.Section
        grow={true}
        // color="subdued"
        bottomBorder={false}>
        {children}
      </EuiPageTemplate.Section>
      <EuiPageTemplate.BottomBar paddingSize="s">
        <EuiThemeProvider colorMode="light">
          <EuiFlexGroup
            responsive={false}
            justifyContent="flexEnd"
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
  );
};

export default MainLayout;
