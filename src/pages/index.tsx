import { FunctionComponent } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiCard, EuiIcon } from '@elastic/eui';
import MainLayout from '../layouts/main';
import { useRouter } from 'next/router';

const Index: FunctionComponent = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <EuiFlexGroup gutterSize="l">
        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="layers" />}
            title="Canvassing"
            description="Canvass a person in person or over the phone"
            onClick={() => router.push('/canvass')}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="dashboardApp" />}
            title="Capture"
            description="Capture a previously done canvass."
            onClick={() => router.push('/capture')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="advancedSettingsApp" />}
            title="Membership"
            description="Membership edit."
            onClick={() => router.push('/membership')}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default Index;
