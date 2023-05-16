import { FunctionComponent, useState } from 'react';
import {
  EuiFlexGroup,
  EuiTabbedContent,
  EuiTabbedContentTab,
  EuiButton,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { css } from '@emotion/react';
import MembershipActivationForm from './activate-form';
import CancelMembershipForm from './cancel-form';
import { hasRole as hasRoleUtil } from '@lib/auth/utils';
import { Roles } from '@lib/domain/auth';
import { useSession } from 'next-auth/react';

interface Props {
  status: string;
  id_number: string;
  handleMembershipStatus: (update) => void;
  handleCancelForm: (update) => void;
}

const MemberManagementButtons: FunctionComponent<Props> = ({
  status,
  id_number,
  handleMembershipStatus,
  handleCancelForm,
}) => {
  const [selectedTab, setSelectedTab] = useState<EuiTabbedContentTab>(
    {} as EuiTabbedContentTab
  );
  const { data: session } = useSession();
  const hasRole = (role: string) => hasRoleUtil(role, session?.user?.roles);

  const tabs: EuiTabbedContentTab[] =
    (status === 'Resigned' || status === 'Terminated') &&
    hasRole(Roles.MembershipAdmin)
      ? [
          {
            id: 'membership-form',
            name: (
              <>
                <EuiButton
                  fullWidth
                  fill={selectedTab.id === 'membership-form'}
                  onClick={() => setSelectedTab(tabs[0])}>
                  Activate
                </EuiButton>
              </>
            ),
            content: (
              <>
                <EuiSpacer size="m" />
                <MembershipActivationForm
                  id_number={id_number}
                  handleMembershipStatus={handleMembershipStatus}
                />
              </>
            ),
          },
        ]
      : status === 'NotAMember'
      ? [
          {
            id: 'membership-form',
            name: (
              <EuiButton
                fullWidth
                fill={selectedTab.id === 'membership-form'}
                onClick={() => setSelectedTab(tabs[0])}>
                Activate
              </EuiButton>
            ),
            content: (
              <>
                <EuiSpacer size="m" />
                <MembershipActivationForm
                  id_number={id_number}
                  handleMembershipStatus={handleMembershipStatus}
                />
              </>
            ),
          },
        ]
      : status === 'Resigned' || status === 'Terminated'
      ? [
          {
            id: 'membership-form',
            name: (
              <>
                <EuiButton
                  fullWidth
                  disabled
                  onClick={() => setSelectedTab(tabs[0])}>
                  Activate
                </EuiButton>
                <EuiText color="subdued" textAlign="center" size="s">
                  Please contact your Provincial Director, or the Federal
                  Membership office to re-activate this member.
                </EuiText>
              </>
            ),
            content: <></>,
          },
        ]
      : status === 'Active'
      ? [
          {
            id: 'membership-form',
            name: (
              <EuiButton
                fullWidth
                fill={selectedTab.id === 'membership-form'}
                onClick={() => setSelectedTab(tabs[0])}>
                Renew
              </EuiButton>
            ),
            content: (
              <>
                <EuiSpacer size="m" />
                <MembershipActivationForm
                  id_number={id_number}
                  handleMembershipStatus={handleMembershipStatus}
                />
              </>
            ),
          },
          {
            id: 'cancel-form',
            name: (
              <EuiButton
                fullWidth
                fill={selectedTab.id === 'cancel-form'}
                onClick={() => setSelectedTab(tabs[1])}>
                Cancel
              </EuiButton>
            ),
            content: (
              <>
                <EuiSpacer size="m" />
                <CancelMembershipForm handleCancelForm={handleCancelForm} />
              </>
            ),
          },
        ]
      : [
          {
            id: 'membership-form',
            name: (
              <EuiButton
                fullWidth
                fill={selectedTab.id === 'membership-form'}
                onClick={() => setSelectedTab(tabs[0])}>
                Renew
              </EuiButton>
            ),
            content: (
              <div css={{ width: '100%' }}>
                <EuiSpacer size="m" />
                <MembershipActivationForm
                  id_number={id_number}
                  handleMembershipStatus={handleMembershipStatus}
                />
              </div>
            ),
          },
          {
            id: 'cancel-form',
            name: (
              <EuiButton
                fullWidth
                fill={selectedTab.id === 'cancel-form'}
                onClick={() => setSelectedTab(tabs[1])}>
                Cancel
              </EuiButton>
            ),
            content: (
              <>
                <EuiSpacer size="m" />
                <CancelMembershipForm handleCancelForm={handleCancelForm} />
              </>
            ),
          },
        ];

  const handleTabClick = (tab: EuiTabbedContentTab) => {
    if (tab.id === selectedTab.id) {
      setSelectedTab({} as EuiTabbedContentTab);
    } else {
      setSelectedTab(tab);
    }
  };

  return (
    <EuiTabbedContent
      expand
      css={css`
        .euiTab__content {
          width: 100%;
        }
        .euiTab {
          box-shadow: none;
        }
        .euiTabs {
          box-shadow: none;
        }
      `}
      tabs={tabs}
      selectedTab={selectedTab}
      onTabClick={handleTabClick}
    />
  );
};

export default MemberManagementButtons;
