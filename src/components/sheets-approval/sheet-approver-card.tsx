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

export type Props = {
  activityUUID: string | string[];
  data: SheetGeneration;
  approvalStatus: string | string[];
};

const SheetPageApproveCard: FunctionComponent<Props> = ({
  data,
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

  const maxTextLength = 100;
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

  return (
    <>
      <EuiSplitPanel.Outer grow>
        {(activityUUID && approvalStatus && data?.status === 'DONE') ||
        data?.status === 'REJECTED' ? (
          <EuiSplitPanel.Inner grow={false} color="warning" paddingSize="m">
            <EuiText>
              <p>
                This request has already been approved by{' '}
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
          <EuiFlexGroup justifyContent="spaceBetween">
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
                      {data?.requestReason}{' '}
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
                        {data?.rejectedReason}{' '}
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
              )}
            </EuiFlexItem>

            <EuiFlexItem grow={1}>
              <EuiFlexItem grow={false}>
                <EuiFlexItem grow={false}>
                  <>
                    <EuiText size="s">
                      <strong>Requested by:</strong>{' '}
                      {renderName(data?.createdBy)}
                    </EuiText>
                    <EuiSpacer size="xs" />
                    <EuiText size="s" style={{ marginBottom: '-15px' }}>
                      <strong>Voters requested:</strong>{' '}
                      {data?.results_number ? data?.results_number : 'Unknown'}
                    </EuiText>
                  </>
                  <EuiSpacer />
                </EuiFlexItem>
              </EuiFlexItem>
              {(activityUUID && approvalStatus && data?.status === 'DONE') ||
              data?.status === 'REJECTED' ? (
                <EuiText style={{ width: '200px' }} size="s">
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

              <EuiSpacer size="m" />
              <EuiFlexGroup
                alignItems="center"
                justifyContent="flexEnd"></EuiFlexGroup>
              <EuiFlexItem grow={false}>
                {data?.status !== 'REJECTED' && approvalStatus === 'reject' ? (
                  <EuiButton
                    iconType="cross"
                    size="m"
                    aria-label="Delete"
                    color="primary"
                    fill
                    disabled={!rejectReason}
                    isLoading={isLoading}
                    onClick={handleReject}>
                    Reject
                  </EuiButton>
                ) : data?.status !== 'DONE' && data?.status !== 'REJECTED' ? (
                  <EuiButton
                    iconType="check"
                    size="m"
                    color="primary"
                    onClick={handleApprove}
                    aria-label="Approve"
                    isLoading={isLoading}
                    fill>
                    Approve
                  </EuiButton>
                ) : (
                  <EuiButton
                    iconType="arrowLeft"
                    size="m"
                    color="primary"
                    onClick={() => router.push('/sheet-gen-approval')}
                    isLoading={isLoading}
                    fill>
                    Return to Sheet Generation Approvals
                  </EuiButton>
                )}
              </EuiFlexItem>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiSplitPanel.Inner>
      </EuiSplitPanel.Outer>
      <EuiSpacer />
    </>
  );
};

export default SheetPageApproveCard;
