import ColorCodesFlyout, {
  colorCodes,
} from '@components/color-codes/color-codes';
import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiText,
  EuiThemeProvider,
} from '@elastic/eui';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';

const Footer: FunctionComponent = () => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);

  const openFlyout = () => {
    setIsFlyoutVisible(true);
  };

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
  };
  const router = useRouter();

  return (
    <>
      <EuiPageTemplate.BottomBar
        paddingSize="s"
        style={{ position: 'relative' }}>
        <EuiThemeProvider colorMode="light">
          <EuiFlexGroup
            responsive={false}
            justifyContent="center"
            gutterSize="xs">
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
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty color="primary" size="xs" onClick={openFlyout}>
                Voter Colour Codes
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
      <ColorCodesFlyout
        colorCodes={colorCodes}
        isOpen={isFlyoutVisible}
        onClose={closeFlyout}
      />
    </>
  );
};

export default Footer;
