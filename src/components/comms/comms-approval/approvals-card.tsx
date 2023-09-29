import { FunctionComponent, useEffect, useRef, useState } from 'react';
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
  EuiSwitch,
  copyToClipboard,
  EuiIcon,
  EuiDescriptionList,
} from '@elastic/eui';
import { renderName } from '@lib/person/utils';
import router from 'next/router';
import moment from 'moment';
import { BulkComms } from '@lib/domain/bulk-comms';
import { IoMdMail } from 'react-icons/io';
import { renderStructureOption } from '../generated-bulk-comms/comms-card';
import { useSession } from 'next-auth/react';
import { KeyedMutator } from 'swr';

export type Props = {
  data: BulkComms;
  key?: string;
  approvedForSend?: boolean;
  bulkCommsMutate: KeyedMutator<BulkComms[]>;
};

const CommsApproverCard: FunctionComponent<Props> = ({
  data,
  key,
  approvedForSend,
  bulkCommsMutate,
}) => {
  const requestType = data?.type?.name === 'sms' ? 'SMS' : 'EMAIL';
  const [commsData, setCommsData] = useState<BulkComms>(data);

  const [showFullText, setShowFullText] = useState(false);
  const [checked, setChecked] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isTextCopied, setTextCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    if (buttonRef.current) {
      buttonRef.current.focus();
      copyToClipboard(data?.message?.toString());
      setTextCopied(true);
    }
  };

  const onBlur = () => {
    setTextCopied(false);
  };

  const onChange = e => {
    setChecked(e.target.checked);
  };

  const handleShowFullText = () => {
    setShowFullText(true);
  };

  const handleCloseFullText = () => {
    setShowFullText(false);
  };

  const maxTextLength = 100;
  const truncatedText = commsData?.requestReason?.slice(0, maxTextLength);
  const hasTruncatedText = commsData?.requestReason?.length > maxTextLength;
  const hasTruncatedRejectedReason =
    commsData?.rejectedReason?.length > maxTextLength;
  const truncatedRejectedReason = commsData?.rejectedReason?.slice(
    0,
    maxTextLength
  );
  const truncatedMessageReason = data?.message?.slice(0, maxTextLength);
  const hasTruncatedMessageReason = data?.message?.length > maxTextLength;
  const { data: session } = useSession();

  const handleSubmit = () => {
    const { key } = data;
    const status = 'approve';
    const url = `/comms-approval/approvals/${key}?status=${status}`;
    router.push(url);
  };

  const handleReject = () => {
    const { key } = data;
    const status = 'reject';
    const url = `/comms-approval/approvals/${key}?status=${status}`;
    router.push(url);
  };

  const handleSent = async () => {
    try {
      const { key } = data;
      setIsLoading(true);

      const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/`;
      const requestData = {
        key: key,
        status: data.status === 'DONE' ? 'WAITING_TO_SEND' : 'DONE',
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      await bulkCommsMutate();
      if (response.ok) {
        console.log('Activity status updated successfully.');
      } else {
        const errorText = await response.text();
        console.error('Error:', errorText);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred while updating activity status:', error);
      setIsLoading(false);
    }
  };

  const approvedRejectedDate = moment(commsData?.modifiedBy.date).format(
    'DD MMM YYYY'
  );
  const approvedRejectedDaysAgo = moment(commsData?.modifiedBy.date).fromNow(
    true
  );
  const requestedDate = moment(commsData?.createdBy.date).format('DD MMM YYYY');
  const requestedDaysAgo = moment(commsData?.createdBy.date).fromNow(true);

  const cardInfo = [
    {
      title: 'Reason for request:',
      description: data?.requestReason || 'Unknown',
    },
    {
      title: 'Message:',
      description: data?.message || 'Unknown',
    },
    {
      title: 'Message cost:',
      description: data?.cost ? `R ${data?.cost}` : 'Unknown',
    },
    {
      title: 'Sender:',
      description: data?.metaData?.sender || 'Unknown',
    },
    {
      title: 'Requested By:',
      description: renderName(commsData?.createdBy)
        ? `${renderName(
            commsData.createdBy
          )} on ${requestedDate} (${requestedDaysAgo} ago)`
        : 'Unknown',
    },
    {
      title: `${data.status === 'DONE' ? 'Approved By:' : ''} `,
      description:
        renderName(commsData?.modifiedBy) && data.status === 'DONE'
          ? `${renderName(
              commsData.modifiedBy
            )} on ${requestedDate} (${requestedDaysAgo} ago)`
          : '',
    },
    {
      title: `${data.status === 'REJECTED' ? 'Rejected By:' : ''} `,
      description:
        renderName(commsData?.modifiedBy) && data.status === 'REJECTED'
          ? `${renderName(
              commsData.modifiedBy
            )} on ${requestedDate} (${requestedDaysAgo} ago)`
          : '',
    },
  ];

  useEffect(() => {
    setCommsData(data);
    console.log({ data });
  }, [data]);

  return (
    <>
      <EuiPanel key={key}>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
          <EuiFlexItem grow={false}>
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
                  <strong>{commsData?.name}</strong>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexGroup alignItems="flexEnd" justifyContent="flexEnd">
            {true ? (
              <EuiText size="s">
                <strong>Status: </strong>
                <EuiBadge
                  color={
                    commsData?.status === 'REJECTED'
                      ? 'warning'
                      : commsData?.status === 'DONE'
                      ? 'primary'
                      : 'default'
                  }>
                  {data?.status.replace(/_/g, ' ')}
                </EuiBadge>
              </EuiText>
            ) : null}
          </EuiFlexGroup>
        </EuiFlexGroup>

        <EuiSpacer size="s" />

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
                  <EuiFlexItem>{renderStructureOption(structure)}</EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            ))
          ) : (
            <EuiText size="s" color="warning">
              Unknown structure
            </EuiText>
          )}
        </EuiFlexGroup>

        <EuiSpacer size="s" />

        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem grow={2}>
            <EuiDescriptionList
              listItems={cardInfo}
              compressed
              gutterSize="s"
            />

            <EuiSpacer size="s" />

            <EuiFormRow
              label={
                commsData?.rejectedReason ? (
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
                      <EuiText size="s">{truncatedRejectedReason}...</EuiText>
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
                      <EuiText size="s">{data?.rejectedReason}</EuiText>
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
          </EuiFlexItem>

          <EuiFlexItem grow={1}>
            <EuiText size="s">
              <strong>
                Number of{' '}
                {requestType === 'EMAIL' ? 'email addresses' : 'phone numbers'}:
              </strong>{' '}
              {commsData?.results_number
                ? commsData?.results_number
                : 'Unknown'}
            </EuiText>
            <EuiSpacer size="xs" />
            {approvedForSend && (
              <>
                <EuiSpacer size="s" />
                <EuiSwitch
                  label={<strong>Has been sent</strong>}
                  checked={data.status === 'DONE' ? true : false}
                  disabled={isLoading}
                  onChange={handleSent}
                />
              </>
            )}
            <EuiSpacer size="m" />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup alignItems="flexEnd" justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            {data.status !== 'REJECTED' &&
              data.status !== 'PENDING_APPROVAL' &&
              data.status !== 'WAITING_TO_SEND' && (
                <EuiButton style={{ width: '200px' }} target="_blank">
                  Download
                </EuiButton>
              )}
          </EuiFlexItem>
        </EuiFlexGroup>

        {data?.status === 'PENDING_APPROVAL' ? (
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

export default CommsApproverCard;
