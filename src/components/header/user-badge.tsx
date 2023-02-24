/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
  EuiButtonEmpty,
  EuiContextMenu,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import { FunctionComponent, useState } from 'react';

export const UserBadge: FunctionComponent = () => {
  const [isPopoverOpen, setPopover] = useState(false);

  const closePopover = () => {
    setPopover(false);
  };

  const panels = [
    {
      id: 0,
      // title: 'This is a context menu',
      items: [
        {
          name: 'Sign out',
          icon: 'user',
          onClick: () => {
            closePopover();
          },
        },
      ],
    },
  ];

  const badge = (
    <EuiButtonEmpty
      iconType="arrowDown"
      size="xs"
      color="ghost"
      css={{ padding: '0 6px' }}
      iconSide="right"
      onClick={() => setPopover(true)}>
      <EuiText size="xs">
        <strong>John Smith</strong> (8210105080082)
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
};
