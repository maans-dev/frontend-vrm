import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiText,
  EuiThemeProvider,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

const Footer: FunctionComponent = () => {
  const router = useRouter();
  return (
    <EuiPageTemplate.BottomBar paddingSize="s" style={{ position: 'relative' }}>
      <EuiThemeProvider colorMode="light">
        <EuiFlexGroup responsive={false} justifyContent="center" gutterSize="m">
          {/* <EuiFlexItem grow={false}>
            <EuiButtonEmpty color="primary" size="xs">
              Help
            </EuiButtonEmpty>
          </EuiFlexItem> */}
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              color="success"
              size="xs"
              onClick={() => router.push('/support')}>
              Support
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiThemeProvider>
      {process.env.NEXT_PUBLIC_VERSION && (
        <EuiText
          css={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            padding: '10px',
          }}
          size="xs"
          color="#999"
          textAlign="right">
          {process.env.NEXT_PUBLIC_VERSION}
        </EuiText>
      )}
    </EuiPageTemplate.BottomBar>
  );
};

export default Footer;
