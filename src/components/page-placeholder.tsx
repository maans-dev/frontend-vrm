import { FunctionComponent } from 'react';
import { EuiPageTemplate } from '@elastic/eui';

const PagePlaceholder: FunctionComponent = () => {
  return (
    <EuiPageTemplate.EmptyPrompt
      iconType="alert"
      iconColor="primary"
      title={<span>Page placeholder</span>}
      footer={<span>Coming soon ...</span>}></EuiPageTemplate.EmptyPrompt>
  );
};

export default PagePlaceholder;
