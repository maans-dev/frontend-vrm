import { EuiPopover, EuiButton, EuiListGroup } from '@elastic/eui';
import { FunctionComponent, useState } from 'react';
import { BsFilePdf } from 'react-icons/bs';

export type Props = {
  files: string[];
};

const Download: FunctionComponent<Props> = ({ files }) => {
  const filesListItems = files
    .map(file => ({
      label: file.split('/').pop().split('#')[0].split('?')[0],
      href: file,
      target: 'blank',
      iconType: BsFilePdf,
      showToolTip: false,
      toolTipText: '',
    }))
    .flat();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onButtonClick = () => setIsPopoverOpen(isPopoverOpen => !isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  const button = (
    <EuiButton
      iconType="arrowDown"
      iconSide="right"
      style={{ width: '200px' }}
      onClick={onButtonClick}>
      Download
    </EuiButton>
  );

  return (
    <EuiPopover
      panelPaddingSize="xs"
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}>
      <EuiListGroup
        size="s"
        listItems={filesListItems}
        // wrapText={false}
        gutterSize="s"
        flush
        showToolTips={false}
        maxWidth={false}
      />
    </EuiPopover>
  );
};

export default Download;