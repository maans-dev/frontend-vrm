import { FunctionComponent, useEffect, useState } from 'react';
import { MainLayoutStyles } from './main.styles';
import {
  EuiBreadcrumb,
  EuiPageTemplate,
  EuiPageTemplateProps,
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
  const styles = MainLayoutStyles();
  const router = useRouter();
  // const { euiTheme } = useEuiTheme();

  const [showSubHeader, setShowSubHeader] = useState(false);

  useEffect(() => {
    setShowSubHeader(router.route !== '/');
  }, [router.route]);

  return (
    <div
      css={styles.mainWrapper}
      style={{ paddingTop: showSubHeader ? '55px' : '0px' }}>
      <HeaderPrimary />

      {showSubHeader ? <HeaderSecondary breadcrumb={breadcrumb} /> : null}

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
