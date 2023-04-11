import { FunctionComponent } from 'react';
import { EuiPageTemplate } from '@elastic/eui';

const PagePlaceholder: FunctionComponent = () => {
  return (
    <EuiPageTemplate.EmptyPrompt
      iconType="alert"
      iconColor="primary"
      paddingSize="l">
      Coming soon ...
    </EuiPageTemplate.EmptyPrompt>
  );
};

export default PagePlaceholder;
