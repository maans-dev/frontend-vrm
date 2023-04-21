import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiThemeProvider,
} from '@elastic/eui';
import { FunctionComponent } from 'react';

const Footer: FunctionComponent = () => {
  return (
    <EuiPageTemplate.BottomBar paddingSize="s">
      <EuiThemeProvider colorMode="light">
        <EuiFlexGroup responsive={false} justifyContent="center" gutterSize="m">
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
  );
};

export default Footer;
