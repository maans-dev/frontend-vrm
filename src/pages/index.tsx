import { FunctionComponent } from 'react';
import {
  EuiFlexItem,
  EuiCard,
  EuiIcon,
  EuiFlexGrid,
  EuiEmptyPrompt,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { TbReport, TbReportSearch } from 'react-icons/tb';
import { GrHostMaintenance } from 'react-icons/gr';
import { useAnalytics } from '@lib/hooks/useAnalytics';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { trackPageClick } = useAnalytics();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);
  const hasFeature = (feature: string) => session?.features.includes(feature);

  if (hasFeature('maintenance-mode')) {
    return (
      <MainLayout
        alignment="top"
        panelled={false}
        restrictWidth={false}
        showSpinner={status === 'loading'}>
        <EuiEmptyPrompt
          iconType={GrHostMaintenance}
          color="danger"
          title={<h2>Temporarily down for maintenance.</h2>}
          body={
            <p>
              {session?.maintenanceMessage
                ? session.maintenanceMessage
                : 'We will be back up soon ...'}
            </p>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      alignment="top"
      panelled={false}
      restrictWidth={false}
      showSpinner={status === 'loading'}>
      <EuiFlexGrid gutterSize="l" columns={2}>
        {hasRole(Roles.Canvass) && hasFeature('canvass-module') && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="inputOutput" />}
              layout="horizontal"
              title="Canvassing"
              description="I want to canvass a voter who is present or on the phone."
              onClick={() => {
                trackPageClick('/canvass/canvassing-type');

                router.push('/canvass/canvassing-type');
              }}
            />
          </EuiFlexItem>
        )}

        {hasRole(Roles.Canvass) && hasFeature('capture-module') && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="importAction" />}
              layout="horizontal"
              title="Capture"
              description="Capture a previously done canvass."
              onClick={() => {
                trackPageClick('/capture/capturing-type');

                router.push('/capture/capturing-type');
              }}
            />
          </EuiFlexItem>
        )}

        {hasRole(Roles.VoterEdit) && hasFeature('cleanup-module') && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="tableDensityExpanded" />}
              layout="horizontal"
              title="Data Cleanup"
              description="Non-canvass edit of voter & membership data."
              onClick={() => {
                trackPageClick('/cleanup/voter-search');

                router.push('/cleanup/voter-search');
              }}
            />
          </EuiFlexItem>
        )}

        {(hasRole(Roles.Membership) || hasRole(Roles.MembershipAdmin)) &&
          hasFeature('membership-module') && (
            <EuiFlexItem>
              <EuiCard
                icon={<EuiIcon size="xxl" type="users" />}
                layout="horizontal"
                title="Membership"
                description="Membership edit."
                onClick={() => {
                  trackPageClick('/membership/voter-search');

                  router.push('/membership/voter-search');
                }}
              />
            </EuiFlexItem>
          )}

        {hasRole(Roles.SheetGen) && hasFeature('sheet-gen-module') && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="documents" />}
              layout="horizontal"
              title="Generate Sheets"
              description="Generation of canvassing sheets."
              onClick={() => {
                trackPageClick('/sheets');

                router.push('/sheets');
              }}
            />
          </EuiFlexItem>
        )}
        {hasRole(Roles.SheetGen) &&
          hasFeature('sheet-gen-coming-soon') &&
          !hasFeature('sheet-gen-module') && (
            <EuiFlexItem>
              <EuiCard
                isDisabled={true}
                icon={<EuiIcon size="xxl" type="documents" />}
                layout="horizontal"
                title="Generate Sheets (Coming later this month)"
                description="Generation of canvassing sheets."
                onClick={() => {
                  trackPageClick('/sheets');
                  router.push('/sheets');
                }}
              />
            </EuiFlexItem>
          )}
        {hasRole(Roles.SheetGenAdmin) && hasFeature('sheet-gen-approvals') && (
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="inputOutput" />}
              layout="horizontal"
              title="Sheet Generation Approval"
              description="Approval of generated sheets."
              onClick={() => {
                trackPageClick('/sheet-gen-approval');
                router.push('/sheet-gen-approval');
              }}
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

        {hasRole(Roles.ActivityReport) &&
          hasFeature('activity-reports-module') && (
            <EuiFlexItem>
              <EuiCard
                icon={<TbReportSearch size="42px" />}
                layout="horizontal"
                title="Activity Reports"
                description="VRM history of canvassing, capturing & voter edits"
                onClick={() => {
                  trackPageClick('/activity-reports/voter-search');

                  router.push('/activity-reports/voter-search');
                }}
              />
            </EuiFlexItem>
          )}

        {session && hasFeature('my-activity-module') && (
          <EuiFlexItem>
            <EuiCard
              icon={<TbReport size="42px" />}
              layout="horizontal"
              title="My Activity"
              description="My VRM history of canvassing, capturing & voter edits"
              onClick={() => {
                trackPageClick('/activity-report');

                router.push('/my-activity');
              }}
            />
          </EuiFlexItem>
        )}
      </EuiFlexGrid>
    </MainLayout>
  );
};

export default Index;
