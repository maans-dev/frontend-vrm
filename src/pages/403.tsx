import { FunctionComponent } from 'react';
import { EuiEmptyPrompt, EuiPageTemplate } from '@elastic/eui';
import { MdSecurity } from 'react-icons/md';
import MainLayout from '@layouts/main';

const NotFoundPage: FunctionComponent = () => {
  return (
    <MainLayout panelled={false}>
      <EuiPageTemplate.EmptyPrompt>
        <EuiEmptyPrompt
          // actions={actions}
          body={
            <p>
              You don&apos;t have permission to access this page. Please contact
              support for assistance.
            </p>
          }
          iconType={MdSecurity}
          layout="vertical"
          title={<h2>Access Denied</h2>}
          titleSize="m"
        />
      </EuiPageTemplate.EmptyPrompt>
    </MainLayout>
  );
};

export default NotFoundPage;
