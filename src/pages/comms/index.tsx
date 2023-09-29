import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import router from 'next/router';
import GeneratedBulkComms from '@components/comms/generated-bulk-comms';
import useBulkCommsFetcher from '@lib/fetcher/comms/bulk-comms';

const Index: FunctionComponent = () => {
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Home',
      href: '/',
      onClick: e => {
        router.push('/');
        e.preventDefault();
      },
    },
    {
      text: 'Bulk Comms',
    },
  ];

  const { generatedBulkCommsData, isLoading, error } = useBulkCommsFetcher();

  const handleRequestEmailClick = () => {
    const request = 'email';
    router.push(`/comms/gen-comms/?request=${request}`);
  };

  const handleRequestSmsClick = () => {
    const request = 'sms';
    router.push(`/comms/gen-comms/?request=${request}`);
  };

  const formActions = (
    <EuiPanel
      style={{
        padding: '16px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
      <h1 style={{ marginBottom: '8px' }}>
        <EuiIcon size="l" type="inputOutput" /> Bulk Comms
      </h1>
      <EuiText size="s" style={{ marginBottom: '16px' }}>
        Request an sms or email
      </EuiText>
      <EuiFlexGroup
        direction="row"
        responsive={false}
        justifyContent="flexEnd"
        gutterSize="m">
        <EuiFlexItem>
          <EuiButton
            iconType="plusInCircle"
            iconSide="right"
            color="primary"
            size="s"
            fill
            onClick={handleRequestSmsClick}>
            Request an SMS
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton
            iconType="plusInCircle"
            iconSide="right"
            color="primary"
            size="s"
            fill
            onClick={handleRequestEmailClick}>
            Request an Email
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      {formActions}
      <EuiSpacer />
      <GeneratedBulkComms bulkCommsData={generatedBulkCommsData} />
    </MainLayout>
  );
};

export default Index;
