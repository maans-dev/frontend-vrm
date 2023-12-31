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
import moment from 'moment';

export type Props = {
  data: SheetGeneration;
  key: string;
  approved?: boolean;
  rejected?: boolean;
};

const SheetApproverCard: FunctionComponent<Props> = ({ data, key }) => {
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

  const approvedRejectedDate = moment(sheetData?.modifiedBy.date).format(
    'DD MMM YYYY'
  );
  const approvedRejectedDaysAgo = moment(sheetData?.modifiedBy.date).fromNow(
    true
  );
  const requestedDate = moment(sheetData?.createdBy.date).format('DD MMM YYYY');
  const requestedDaysAgo = moment(sheetData?.createdBy.date).fromNow(true);

  useEffect(() => {
    if (data) {
      setSheetData(data);
    }
  }, [data]);

  return (
    <>
      <EuiPanel key={key}>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem grow={2}>
            <EuiText size="m">
              <strong>{sheetData?.name}</strong>
            </EuiText>
            <EuiSpacer size="s" />
            <>
              <EuiText size="s">{sheetData?.structures[0]?.formatted}</EuiText>
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
                    <div
                      style={{
                        minWidth: '1%',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        color: 'var(--euiColorPrimary)',
                      }}>
                      {truncatedText}...
                    </div>

                    <EuiButtonEmpty
                      size="xs"
                      flush="left"
                      onClick={handleShowFullText}
                      style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                      Show More
                    </EuiButtonEmpty>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        minWidth: '1%',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                      }}>
                      {sheetData?.requestReason}
                    </div>

                    {hasTruncatedText && (
                      <EuiButtonEmpty
                        size="xs"
                        onClick={handleCloseFullText}
                        flush="left"
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
                    <div
                      style={{
                        minWidth: '1%',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        color: 'var(--euiColorPrimary)',
                      }}>
                      {truncatedRejectedReason}...
                    </div>

                    <EuiButtonEmpty
                      size="xs"
                      flush="left"
                      onClick={handleShowFullText}
                      style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                      Show More
                    </EuiButtonEmpty>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        minWidth: '1%',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        color: 'var(--euiColorPrimary)',
                      }}>
                      {data?.rejectedReason}
                    </div>
                    {hasTruncatedRejectedReason && (
                      <EuiButtonEmpty
                        size="xs"
                        flush="left"
                        onClick={handleCloseFullText}
                        style={{ paddingLeft: 0, paddingBottom: '4px' }}>
                        Show Less
                      </EuiButtonEmpty>
                    )}
                  </>
                )}
              </EuiText>
            </EuiFormRow>
            <EuiSpacer size="s" />
            <EuiText size="s">
              <strong>Requested by:</strong> {renderName(sheetData?.createdBy)}{' '}
              on {requestedDate} ({requestedDaysAgo} ago)
            </EuiText>

            <EuiFlexItem grow={false}>
              <>
                <EuiSpacer size="xs" />
                {!(sheetData?.status === 'PENDING_APPROVAL') && (
                  <EuiText size="s">
                    <strong>
                      {sheetData?.status === 'DONE'
                        ? 'Approved by:'
                        : sheetData?.status === 'REJECTED'
                        ? 'Rejected by:'
                        : null}
                    </strong>{' '}
                    {renderName(sheetData?.modifiedBy)} on{' '}
                    {approvedRejectedDate} ({approvedRejectedDaysAgo} ago)
                  </EuiText>
                )}
              </>
            </EuiFlexItem>
          </EuiFlexItem>

          <EuiFlexItem grow={1}>
            <EuiText size="s">
              <strong>Voters requested:</strong>{' '}
              {sheetData?.results_number
                ? sheetData?.results_number
                : 'Unknown'}
            </EuiText>
            <EuiSpacer size="xs" />
            {!(sheetData?.status === 'PENDING_APPROVAL') ? (
              <EuiText size="s">
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
            ) : null}
          </EuiFlexItem>
        </EuiFlexGroup>
        {sheetData?.status === 'PENDING_APPROVAL' ? (
          <>
            <EuiFlexGroup gutterSize="m" justifyContent="flexEnd">
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
            </EuiFlexGroup>
          </>
        ) : null}
      </EuiPanel>
      <EuiSpacer />
    </>
  );
};

export default SheetApproverCard;
