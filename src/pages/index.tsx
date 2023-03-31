import { FunctionComponent } from 'react';
import { EuiFlexItem, EuiCard, EuiIcon, EuiFlexGrid } from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';

const Index: FunctionComponent = () => {
  const router = useRouter();

  return (
    <MainLayout alignment="top" panelled={false} restrictWidth={false}>
      <EuiFlexGrid gutterSize="l" columns={2}>
        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="inputOutput" />}
            layout="horizontal"
            title="Canvassing"
            description="I want to canvass a voter who is present or on the phone."
            onClick={() => router.push('/canvass/canvassing-type')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="importAction" />}
            layout="horizontal"
            title="Capture"
            description="Capture a previously done canvass."
            onClick={() => router.push('/capture/capturing-type')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="users" />}
            layout="horizontal"
            title="Membership"
            description="Membership edit."
            onClick={() => router.push('/membership')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="documents" />}
            layout="horizontal"
            title="Generate Sheets"
            description="Generation of canvassing sheets."
            onClick={() => router.push('/sheets')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="timeline" />}
            layout="horizontal"
            title="Bulk Comms"
            description="Manage bulk comms requests."
            onClick={() => router.push('/comms')}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiCard
            icon={<EuiIcon size="xxl" type="tableDensityExpanded" />}
            layout="horizontal"
            title="Data Cleanup"
            description="Non-canvass edit of voter & membership data."
            onClick={() => router.push('/cleanup')}
          />
        </EuiFlexItem>
      </EuiFlexGrid>
    </MainLayout>
  );
};

export default Index;
