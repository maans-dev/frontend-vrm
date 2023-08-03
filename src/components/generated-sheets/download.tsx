import { EuiPopover, EuiButton, EuiListGroup } from '@elastic/eui';
import { FunctionComponent, useState } from 'react';
import { BsFilePdf } from 'react-icons/bs';
import type { SheetGenFile } from '@lib/domain/sheet-generation';

export type Props = {
  files: SheetGenFile[];
};

const Download: FunctionComponent<Props> = ({ files }) => {
  const filesListItems = files
    .map(file => ({
      label: file.name_text,
      iconType: BsFilePdf,
      showToolTip: false,
      toolTipText: '',
      href: `/api/download/${file.key}`,
      target: '_blank',
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
