import {
  EuiButtonEmpty,
  EuiContextMenu,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import { useAnalytics } from '@lib/hooks/useAnalytics';
import { useSession, signOut } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';

export const UserBadge: FunctionComponent = () => {
  const [isPopoverOpen, setPopover] = useState(false);
  const { data: session, status } = useSession();
  const { trackUserLogout } = useAnalytics();

  const closePopover = () => {
    setPopover(false);
  };

  const panels = [
    {
      id: 0,
      items: [
        {
          name: 'Sign out',
          icon: 'user',
          onClick: () => {
            closePopover();
            trackUserLogout();
            signOut({ callbackUrl: 'https://login.voteda.org/logout' });
            // signOut();
          },
        },
      ],
    },
  ];

  if (status === 'authenticated') {
    const badge = (
      <EuiButtonEmpty
        iconType="arrowDown"
        size="xs"
        color="ghost"
        css={{ padding: '0 6px' }}
        iconSide="right"
        onClick={() => setPopover(true)}>
        <EuiText size="xs">
          <strong>{session.user.name}</strong> ({session.user.idNumber})
        </EuiText>
      </EuiButtonEmpty>
    );

    return (
      <EuiPopover
        button={badge}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        anchorPosition="downRight">
        <EuiContextMenu initialPanelId={0} panels={panels} size="s" />
      </EuiPopover>
    );
  }

  return null;
};
