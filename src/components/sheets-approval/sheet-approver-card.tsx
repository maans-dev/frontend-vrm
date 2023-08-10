import { ChangeEventHandler, FunctionComponent, useState } from 'react';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiTextArea,
  EuiFormRow,
  EuiButtonEmpty,
  EuiSplitPanel,
  EuiBadge,
} from '@elastic/eui';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import { renderName } from '@lib/person/utils';
import { appsignal } from '@lib/appsignal';
import moment from 'moment';
import { KeyedMutator } from 'swr';

export type Props = {
  activityUUID: string | string[];
  data: SheetGeneration;
  sheetGenMutate: KeyedMutator<SheetGeneration[]>;
  approvalStatus: string | string[];
};

const SheetPageApproveCard: FunctionComponent<Props> = ({
  data,
  sheetGenMutate,
  activityUUID,
  approvalStatus,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showFullText, setShowFullText] = useState(false);

  const handleShowFullText = () => {
    setShowFullText(true);
  };

  const handleCloseFullText = () => {
    setShowFullText(false);
  };

  const maxTextLength = 50;
  const truncatedText = data?.requestReason.slice(0, maxTextLength);
  const hasTruncatedText = data?.requestReason.length > maxTextLength;
  const hasTruncatedRejectedReason =
    data?.rejectedReason?.length > maxTextLength;
  const truncatedRejectedReason = data?.rejectedReason?.slice(0, maxTextLength);

  const handleRejectReasonChange: ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    setRejectReason(e.target.value);
  };

  const handleReject = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/`;
    const reqPayload = {
      key: activityUUID,
      status: 'REJECTED',
      rejectedReason: rejectReason,
    };
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify(reqPayload),
    });

    setIsLoading(false);
    await sheetGenMutate();

    if (!response.ok) {
      return;
    }

    const respPayload = await response.clone().json();
    router.push('/sheet-gen-approval');
  };

  const handleApprove = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/`;
    const reqPayload = {
      key: data?.key,
      status: 'DONE',
    };
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify(reqPayload),
    });

    setIsLoading(false);
    await sheetGenMutate();

    if (!response.ok) {
      const errJson = JSON.parse(await response.clone().text());
      appsignal.sendError(
        new Error(`Unable to approve activity: ${errJson.message}`),
        span => {
          span.setAction('api-call:/activity');
          span.setParams({
            route: url,
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }
    router.push('/sheet-gen-approval');
  };

  const formattedDate = moment(data?.modifiedBy.date).format('DD MMM YYYY');
  const daysAgo = moment(data?.modifiedBy.date).fromNow(true);
  const createdByDate = moment(data?.createdBy.date).format('DD MMM YYYY');
  const createdByDaysAgo = moment(data?.createdBy.date).fromNow(true);

  return (
    <>
      <EuiSplitPanel.Outer grow>
        {(activityUUID && approvalStatus && data?.status === 'DONE') ||
        data?.status === 'REJECTED' ? (
          <EuiSplitPanel.Inner grow={false} color="warning" paddingSize="m">
            <EuiText>
              <p>
                This request has already been{' '}
                {data?.status === 'DONE' ? 'approved' : 'rejected'} by{' '}
                {data?.modifiedBy ? (
                  <>
                    <strong>{`${renderName(data?.modifiedBy)}`} </strong>
                    on {formattedDate} ({daysAgo} ago)
                  </>
                ) : (
                  'Unknown'
                )}
              </p>
            </EuiText>
          </EuiSplitPanel.Inner>
        ) : (
          <></>
        )}

        <EuiSplitPanel.Inner>
          <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
            <EuiFlexItem grow={2}>
              <EuiText size="m">
                <strong>{data?.name}</strong>
              </EuiText>
              <EuiSpacer size="s" />
              <>
                <EuiText size="s">
                  {data?.structures[0]?.formatted
                    ? data?.structures[0]?.formatted
                    : 'Unknown'}
                </EuiText>
              </>
              <EuiSpacer size="m" />
              <EuiText size="s">
                <strong>Requested by:</strong> {renderName(data?.createdBy)} on{' '}
                {createdByDate} ({createdByDaysAgo} ago)
              </EuiText>
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
                          color: 'var(--euiColorPrimary)',
                        }}>
                        {data?.requestReason}
                      </div>
                      {hasTruncatedText && (
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
              <EuiSpacer size="m" />

              <EuiFlexItem grow={false}>
                <>
                  <EuiSpacer size="xs" />
                  {!(data?.status === 'PENDING_APPROVAL') && (
                    <EuiText size="s">
                      <strong>
                        {data?.status === 'DONE'
                          ? 'Approved by:'
                          : data?.status === 'REJECTED'
                          ? 'Rejected by:'
                          : null}
                      </strong>{' '}
                      {renderName(data?.modifiedBy)} on {formattedDate} (
                      {daysAgo} ago)
                    </EuiText>
                  )}
                </>
                <EuiSpacer size="s" />
              </EuiFlexItem>
              {!(data?.status === 'DONE' || data?.status === 'REJECTED') &&
              approvalStatus === 'reject' ? (
                <EuiFormRow
                  label={
                    approvalStatus === 'reject' && (
                      <EuiText size="s">
                        <strong>Rejection reason:</strong>
                      </EuiText>
                    )
                  }
                  fullWidth>
                  {approvalStatus === 'reject' && (
                    <EuiTextArea
                      maxLength={50000}
                      aria-label="Rejection reason"
                      value={rejectReason}
                      onChange={handleRejectReasonChange}
                    />
                  )}
                </EuiFormRow>
              ) : (
                <EuiFormRow
                  label={
                    data?.rejectedReason ? (
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
              )}
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
              <EuiFlexItem grow={false}></EuiFlexItem>
              <EuiFlexGroup
                direction="column"
                alignItems="center"
                justifyContent="center">
                <EuiText size="s">
                  <strong>Voters requested:</strong>{' '}
                  {data?.results_number ? data?.results_number : 'Unknown'}
                </EuiText>
                {(activityUUID && approvalStatus && data?.status === 'DONE') ||
                data?.status === 'REJECTED' ? (
                  <EuiText size="s">
                    <strong>Status: </strong>
                    <EuiBadge
                      color={
                        data?.status === 'REJECTED'
                          ? 'warning'
                          : data?.status === 'DONE'
                          ? 'primary'
                          : 'default'
                      }>
                      {data?.status}
                    </EuiBadge>
                  </EuiText>
                ) : null}
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup style={{ marginTop: '-25px' }} justifyContent="flexEnd">
            {data?.status !== 'REJECTED' && approvalStatus === 'reject' ? (
              <EuiFlexGroup
                direction="column"
                justifyContent="flexEnd"
                alignItems="flexEnd">
                <EuiFlexItem>
                  <EuiSpacer />
                  <EuiButton
                    iconType="cross"
                    size="m"
                    style={{ width: '170px' }}
                    aria-label="Delete"
                    color="primary"
                    fill
                    disabled={!rejectReason}
                    isLoading={isLoading}
                    onClick={handleReject}>
                    Reject
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            ) : data?.status !== 'DONE' && data?.status !== 'REJECTED' ? (
              <EuiFlexGroup
                direction="column"
                justifyContent="flexEnd"
                alignItems="flexEnd">
                <EuiFlexItem>
                  <EuiSpacer />
                  <EuiButton
                    iconType="check"
                    size="m"
                    style={{ width: '170px' }}
                    color="primary"
                    onClick={handleApprove}
                    aria-label="Approve"
                    isLoading={isLoading}
                    fill>
                    Approve
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            ) : (
              <EuiFlexGroup
                direction="column"
                justifyContent="flexEnd"
                alignItems="flexEnd">
                <EuiFlexItem>
                  <EuiSpacer />
                  <EuiButton
                    iconType="arrowLeft"
                    size="m"
                    style={{ width: '290px' }}
                    color="primary"
                    onClick={() => router.push('/sheet-gen-approval')}
                    isLoading={isLoading}
                    fill>
                    Return to Sheet Generation Approvals
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            )}
          </EuiFlexGroup>
        </EuiSplitPanel.Inner>
      </EuiSplitPanel.Outer>
      <EuiSpacer />
    </>
  );
};

export default SheetPageApproveCard;
