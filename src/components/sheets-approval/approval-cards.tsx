import { FunctionComponent, useEffect, useState } from 'react';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiFormRow,
  EuiButtonEmpty,
  EuiBadge,
} from '@elastic/eui';
import { renderName } from '@lib/person/utils';
import router from 'next/router';

export type Props = {
  data: SheetGeneration;
  key: string;
  approved?: boolean;
  rejected?: boolean;
};

const SheetApproverCard: FunctionComponent<Props> = ({
  data,
  key,
  approved,
  rejected,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const [sheetData, setSheetData] = useState<SheetGeneration>(data);

  const handleShowFullText = () => {
    setShowFullText(true);
  };

  const handleCloseFullText = () => {
    setShowFullText(false);
  };

  const maxTextLength = 100;
  const truncatedText = sheetData?.requestReason?.slice(0, maxTextLength);
  const hasTruncatedText = sheetData?.requestReason?.length > maxTextLength;
  const hasTruncatedRejectedReason =
    sheetData?.rejectedReason?.length > maxTextLength;
  const truncatedRejectedReason = sheetData?.rejectedReason?.slice(
    0,
    maxTextLength
  );

  const handleSubmit = () => {
    const { key } = data;
    const status = 'approve';
    const url = `/sheet-gen-approval/approvals/${key}?status=${status}`;
    router.push(url);
  };

  const handleReject = () => {
    const { key } = data;
    const status = 'reject';
    const url = `/sheet-gen-approval/approvals/${key}?status=${status}`;
    router.push(url);
  };

  useEffect(() => {
    if (data) {
      setSheetData(data);
    }
  }, [data]);

  return (
    <>
      <EuiPanel key={key}>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={2}>
            <EuiText size="m">
              <strong>{sheetData?.name}</strong>
            </EuiText>
            <EuiSpacer size="s" />
            <>
              <EuiText size="s">{sheetData.structures[0]?.formatted}</EuiText>
            </>
            <EuiSpacer size="s" />
            <EuiFormRow
              label={
                <EuiText size="s">
                  <strong>Reason for request:</strong>
                </EuiText>
              }
              fullWidth>
              <EuiText size="m">
                {hasTruncatedText && !showFullText ? (
                  <>
                    <span style={{ color: 'var(--euiColorPrimary)' }}>
                      {truncatedText}...
                    </span>
                    <EuiButtonEmpty
                      size="xs"
                      onClick={handleShowFullText}
                      style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                      Show More
                    </EuiButtonEmpty>
                  </>
                ) : (
                  <>
                    {sheetData?.requestReason}{' '}
                    {hasTruncatedText && (
                      <EuiButtonEmpty
                        size="s"
                        onClick={handleCloseFullText}
                        style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                        Show Less
                      </EuiButtonEmpty>
                    )}
                  </>
                )}
              </EuiText>
            </EuiFormRow>
            <EuiFormRow
              label={
                sheetData?.rejectedReason ? (
                  <EuiText size="s">
                    <strong>Rejection reason:</strong>
                  </EuiText>
                ) : null
              }
              fullWidth>
              <EuiText size="m">
                {hasTruncatedRejectedReason && !showFullText ? (
                  <>
                    <span style={{ color: 'var(--euiColorPrimary)' }}>
                      {truncatedRejectedReason}
                    </span>
                    <EuiButtonEmpty
                      size="xs"
                      onClick={handleShowFullText}
                      style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                      ...Show More
                    </EuiButtonEmpty>
                  </>
                ) : (
                  <>
                    {sheetData?.rejectedReason}{' '}
                    {hasTruncatedRejectedReason && (
                      <EuiButtonEmpty
                        size="s"
                        onClick={handleCloseFullText}
                        style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                        Show Less
                      </EuiButtonEmpty>
                    )}
                  </>
                )}
              </EuiText>
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem grow={1}>
            <EuiFlexItem grow={false}>
              <>
                <EuiText size="s">
                  <strong>Requested by:</strong>{' '}
                  {renderName(sheetData?.createdBy)}
                </EuiText>
                <EuiSpacer size="xs" />
                <EuiText size="s" style={{ marginBottom: '-15px' }}>
                  <strong>Voters requested:</strong>{' '}
                  {sheetData?.results_number
                    ? sheetData?.results_number
                    : 'Unknown'}
                </EuiText>
              </>
              <EuiSpacer />
            </EuiFlexItem>
            <EuiFlexGroup alignItems="center" justifyContent="flexEnd">
              {approved || rejected ? (
                <>
                  {
                    <EuiText style={{ width: '200px' }} size="s">
                      <strong>Status: </strong>
                      <EuiBadge
                        color={
                          sheetData?.status === 'REJECTED'
                            ? 'warning'
                            : sheetData?.status === 'DONE'
                            ? 'primary'
                            : 'default'
                        }>
                        {sheetData?.status}
                      </EuiBadge>
                    </EuiText>
                  }
                </>
              ) : (
                <>
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      iconType="check"
                      size="s"
                      color="primary"
                      onClick={handleSubmit}
                      aria-label="Approve"
                      fill>
                      Approve
                    </EuiButton>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      iconType="cross"
                      size="s"
                      aria-label="Reject"
                      onClick={handleReject}>
                      Reject
                    </EuiButton>
                  </EuiFlexItem>
                </>
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer />
    </>
  );
};

export default SheetApproverCard;
