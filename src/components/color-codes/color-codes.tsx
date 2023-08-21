import React, { FunctionComponent, useState } from 'react';
import {
  EuiBadge,
  EuiBasicTable,
  EuiButton,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiSpacer,
  useGeneratedHtmlId,
} from '@elastic/eui';

export const colorCodes = [
  { code: '2FA44B', description: 'Registered correctly' },
  { code: 'FDC334', description: 'Registered in wrong VD' },
  { code: 'F75D2B', description: 'Registered in wrong ward' },
  {
    code: '742870',
    description:
      'Registered in wrong ward and living more than 10km from voting station',
  },
  { code: '0D5899', description: 'Registered in wrong municipality' },
  { code: 'F595BB', description: 'Registered in wrong province' },
  { code: '754129', description: 'Registered, address insufficient' },
  { code: 'FFFFFF', description: 'Unregistered, address insufficient' },
  { code: 'D61228', description: 'Unregistered, address known' },
  { code: '58595B', description: 'Uneligible voters' },
];

export interface ColorCode {
  code: string;
  description: string;
}

interface ColorCodesFlyoutProps {
  isOpen?: boolean;
  onClose?: () => void;
  colorCodes?: ColorCode[];
}

const ColorCodesFlyout: FunctionComponent<ColorCodesFlyoutProps> = ({
  isOpen,
  onClose,
  colorCodes,
}) => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(isOpen);
  const complicatedFlyoutTitleId = useGeneratedHtmlId({
    prefix: 'complicatedFlyoutTitle',
  });

  const columns = [
    {
      field: 'description',
      name: 'Description',
      truncateText: true,
      render: description => {
        const colorCodeEntry = colorCodes.find(
          entry => entry.description === description
        );
        if (colorCodeEntry) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EuiBadge
                color={`#${colorCodeEntry.code}`}
                style={{ marginRight: '8px' }}
              />
              {description}
            </div>
          );
        }
        return description;
      },
    },
  ];

  const flyoutContent = (
    <>
      <EuiBasicTable items={colorCodes} columns={columns} />
      <EuiSpacer size="m" />
      <EuiButton color="primary" style={{ backgroundColor: '#fff' }}>
        <a
          href="https://static.da-io.net/canvass-documents/voter-colour-codes.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download>
          PDF for download
        </a>
      </EuiButton>
    </>
  );

  return (
    <>
      {isFlyoutVisible ||
        (isOpen && (
          <EuiFlyout
            size="550px"
            ownFocus
            style={{ backgroundColor: '#fff' }}
            onClose={onClose}
            aria-labelledby={complicatedFlyoutTitleId}>
            <EuiFlyoutHeader hasBorder>
              <EuiTitle size="m" css={{ color: '#000' }}>
                <h2 id={complicatedFlyoutTitleId}>Voter Colour Codes</h2>
              </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>{flyoutContent}</EuiFlyoutBody>
            <EuiFlyoutFooter style={{ backgroundColor: '#fff' }}>
              <EuiFlexGroup justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    iconType="cross"
                    onClick={onClose}
                    flush="left">
                    Close
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlyoutFooter>
          </EuiFlyout>
        ))}
    </>
  );
};

export default ColorCodesFlyout;
