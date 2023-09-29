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
  EuiIcon,
  EuiPanel,
  EuiDescriptionList,
} from '@elastic/eui';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import { renderName } from '@lib/person/utils';
import { appsignal } from '@lib/appsignal';
import moment from 'moment';
import { BulkComms } from '@lib/domain/bulk-comms';
import { IoMdMail } from 'react-icons/io';
import { renderStructureOption } from '../generated-bulk-comms/comms-card';

export type Props = {
  activityUUID: string | string[];
  data: BulkComms;
  approvalStatus: string | string[];
};

const CommsPageApproveCard: FunctionComponent<Props> = ({
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

  const maxTextLength = 50;
  const truncatedText = data?.requestReason?.slice(0, maxTextLength);
  const hasTruncatedText = data?.requestReason?.length > maxTextLength;
  const hasTruncatedRejectedReason =
    data?.rejectedReason?.length > maxTextLength;
  const truncatedRejectedReason = data?.rejectedReason?.slice(0, maxTextLength);
  const truncatedMessageReason = data?.message?.slice(0, maxTextLength);
  const hasTruncatedMessageReason = data?.message?.length > maxTextLength;

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
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify(reqPayload),
    });

    setIsLoading(false);

    if (!response.ok) {
      return;
    }

    const respPayload = await response.clone().json();
    router.push('/comms-approval');
  };

  const handleApprove = async () => {
    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/`;
    const reqPayload = {
      key: data?.key,
      status: data?.sender === 'FHO' ? 'WAITING_TO_SEND' : 'DONE',
    };
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify(reqPayload),
    });

    setIsLoading(false);

    if (!response.ok) {
      const errJson = await response.clone().text();
      appsignal.sendError(
        new Error(`Unable to approve activity: ${errJson}`),
        span => {
          span.setAction('api-call:/activity');
          span.setParams({
            route: url,
          });
          span.setTags({ user_darn: session.user?.darn?.toString() });
        }
      );
      return;
    }
    router.push('/comms-approval');
  };

  const formattedDate = moment(data?.modifiedBy.date).format('DD MMM YYYY');
  const daysAgo = moment(data?.modifiedBy.date).fromNow(true);
  const createdByDate = moment(data?.createdBy.date).format('DD MMM YYYY');
  const createdByDaysAgo = moment(data?.createdBy.date).fromNow(true);
  const requestType = data?.type?.name === 'sms' ? 'SMS' : 'EMAIL';
  const requestedDate = moment(data?.createdBy.date).format('DD MMM YYYY');
  const requestedDaysAgo = moment(data?.createdBy.date).fromNow(true);

  const cardInfo = [
    {
      title: 'Reason for request:',
      description: `${data?.requestReason}`,
    },
    {
      title: 'Message:',
      description: `${data?.message}`,
    },
    {
      title: 'Message cost:',
      description: data?.cost ? `R ${data?.cost}` : 'Unknown',
    },
    {
      title: 'Sender',
      description: `${data?.metaData?.sender}`,
    },
    {
      title: 'Requested By',
      description: `${renderName(data?.createdBy)}
      on ${requestedDate} (${requestedDaysAgo} ago)`,
    },
  ];

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
              <EuiFlexGroup alignItems="center" justifyContent="flexStart">
                <EuiFlexItem grow={false}>
                  <EuiBadge
                    color="primary"
                    style={{ height: '23px', width: '35px' }}>
                    {requestType === 'SMS' ? (
                      <EuiIcon type="mobile" />
                    ) : (
                      <IoMdMail />
                    )}
                  </EuiBadge>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiText size="m">
                    <strong>{data?.name}</strong>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiSpacer size="s" />
              <>
                <EuiFlexGroup
                  justifyContent="flexStart"
                  alignItems="flexStart"
                  wrap
                  gutterSize="xs">
                  {data?.structures?.length > 0 ? (
                    data.structures.map((structure, index) => (
                      <EuiPanel
                        grow={false}
                        key={index}
                        paddingSize="s"
                        css={{
                          borderColor: '#155FA2',
                        }}
                        hasBorder={true}
                        hasShadow={false}>
                        <EuiFlexGroup responsive={false}>
                          <EuiFlexItem>
                            {renderStructureOption(structure)}
                          </EuiFlexItem>
                        </EuiFlexGroup>
                      </EuiPanel>
                    ))
                  ) : (
                    <EuiText size="s" color="warning">
                      Unknown structure
                    </EuiText>
                  )}
                </EuiFlexGroup>
              </>

              <EuiSpacer size="s" />

              <EuiDescriptionList
                listItems={cardInfo}
                compressed
                gutterSize="s"
              />

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
              <EuiFlexItem grow={false}>
                <EuiText size="s">
                  <strong>
                    Number of{' '}
                    {requestType === 'EMAIL'
                      ? 'email addresses'
                      : 'phone numbers'}
                    :
                  </strong>{' '}
                  {data?.results_number ? data?.results_number : 'Unknown'}
                </EuiText>
              </EuiFlexItem>
              <EuiFlexGroup
                direction="column"
                alignItems="center"
                justifyContent="center">
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
                    onClick={() => router.push('/comms-approval')}
                    isLoading={isLoading}
                    fill>
                    Return to Bulk Comms Approvals
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

export default CommsPageApproveCard;
