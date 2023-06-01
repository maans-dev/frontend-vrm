import { FunctionComponent } from 'react';
import { EuiFlexItem, EuiCard, EuiIcon, EuiFlexGrid } from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { TbActivityHeartbeat, TbReport, TbReportSearch } from 'react-icons/tb';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);

  return (
    <MainLayout
      alignment="top"
      panelled={false}
      restrictWidth={false}
      showSpinner={status === 'loading'}>
      <EuiFlexGrid gutterSize="l" columns={2}>
        {hasRole(Roles.Canvass) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="inputOutput" />}
              layout="horizontal"
              title="Canvassing"
              description="I want to canvass a voter who is present or on the phone."
              onClick={() => router.push('/canvass/canvassing-type')}
            />
          </EuiFlexItem>
        )}

        {hasRole(Roles.Canvass) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="importAction" />}
              layout="horizontal"
              title="Capture"
              description="Capture a previously done canvass."
              onClick={() => router.push('/capture/capturing-type')}
            />
          </EuiFlexItem>
        )}

        {hasRole(Roles.VoterEdit) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="tableDensityExpanded" />}
              layout="horizontal"
              title="Data Cleanup"
              description="Non-canvass edit of voter & membership data."
              onClick={() => router.push('/cleanup/voter-search')}
            />
          </EuiFlexItem>
        )}

        {(hasRole(Roles.Membership) || hasRole(Roles.MembershipAdmin)) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="users" />}
              layout="horizontal"
              title="Membership"
              description="Membership edit."
              onClick={() => router.push('/membership/voter-search')}
            />
          </EuiFlexItem>
        )}

        {hasRole(Roles.SheetGen) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="documents" />}
              layout="horizontal"
              title="Generate Sheets"
              description="Generation of canvassing sheets."
              onClick={() => router.push('/sheets')}
            />
          </EuiFlexItem>
        )}
        {/* 
        {/* {hasRole(Roles.BulkComms) && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="timeline" />}
              layout="horizontal"
              title="Bulk Comms"
              description="Manage bulk comms requests."
              onClick={() => router.push('/comms')}
            />
          </EuiFlexItem>
        )} */}

        {session && (
          <EuiFlexItem>
            <EuiCard
              icon={<TbReport size="42px" />}
              layout="horizontal"
              title="My Activity"
              description="My VRM history of canvassing, capturing & voter edits"
              onClick={() => router.push('/my-activity')}
            />
          </EuiFlexItem>
        )}
        {hasRole(Roles.ActivityReport) && (
          <EuiFlexItem>
            <EuiCard
              icon={<TbReportSearch size="42px" />}
              layout="horizontal"
              title="Activity Reports"
              description="VRM history of canvassing, capturing & voter edits"
              onClick={() => router.push('/activity-reports/voter-search')}
            />
          </EuiFlexItem>
        )}
      </EuiFlexGrid>
    </MainLayout>
  );
};

export default Index;
