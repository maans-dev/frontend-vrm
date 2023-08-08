import { FunctionComponent, useState } from 'react';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiButtonIcon,
  EuiBadge,
  EuiFormRow,
  EuiButtonEmpty,
} from '@elastic/eui';
import Download from './download';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { appsignal } from '@lib/appsignal';
import { renderName } from '@lib/person/utils';
import { KeyedMutator } from 'swr';

export type Props = {
  data: SheetGeneration;
  sheetGenMutate: KeyedMutator<SheetGeneration[]>;
  key: string;
};

const SheetCard: FunctionComponent<Props> = ({ data, sheetGenMutate, key }) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handleShowFullText = () => {
    setShowFullText(true);
  };

  const handleCloseFullText = () => {
    setShowFullText(false);
  };

  const maxTextLength = 50;
  const truncatedRejectedReason = data?.rejectedReason?.slice(0, maxTextLength);
  const truncatedRequestReason = data?.requestReason?.slice(0, maxTextLength);
  const hasTruncatedRejectedReason =
    data?.rejectedReason?.length > maxTextLength;
  const hasTruncatedRequestReason = data?.requestReason?.length > maxTextLength;

  function formatDate(dateString: string): string {
    return moment(dateString).fromNow();
  }
  const prettifyStatus = status => {
    if (status === 'PENDING_APPROVAL') {
      return status.replace('_', ' ');
    }
    return status;
  };
  const statusText = data?.status ? prettifyStatus(data.status) : 'Unknown';

  const handleDelete = async (actvityKey: string) => {
    setIsDeleting(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        key: actvityKey,
        status: 'DELETED',
      }),
    });

    if (!response.ok) {
      const errJson = JSON.parse(await response.clone().text());
      appsignal.sendError(
        new Error(`Unable to delete activity: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            actvityKey,
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      setIsDeleting(false);
      return;
    }

    const respPayload = await response.json();
    await sheetGenMutate();
    setIsDeleting(false);
  };

  return (
    <>
      <EuiPanel key={key}>
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="flexStart">
          <EuiFlexItem grow={2}>
            <EuiText size="m">
              <strong>{data.campaign.name}</strong>
            </EuiText>
            <EuiSpacer size="s" />
            {data?.structures?.[0]?.formatted ? (
              <>
                <EuiText size="s">{data?.structures?.[0]?.formatted}</EuiText>
              </>
            ) : (
              <EuiText size="s" color="warning">
                Unknown structure
              </EuiText>
            )}
            <EuiSpacer size="s" />
            <EuiFormRow
              label={
                <EuiText size="s">
                  <strong>Reason for request:</strong>
                </EuiText>
              }
              fullWidth>
              <EuiText size="m">
                {hasTruncatedRequestReason && !showFullText ? (
                  <>
                    <div
                      style={{
                        minWidth: '1%',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        color: 'var(--euiColorPrimary)',
                      }}>
                      {truncatedRequestReason}...
                    </div>
                    <EuiButtonEmpty
                      flush="left"
                      size="xs"
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
                      {data?.requestReason}{' '}
                    </div>
                    {hasTruncatedRequestReason && (
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
            <EuiSpacer size="xs" />
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
                      }}>
                      {truncatedRejectedReason}...
                    </div>

                    <EuiButtonEmpty
                      flush="left"
                      size="xs"
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
                      {data?.rejectedReason}{' '}
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
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            <EuiFlexGroup alignItems="center" justifyContent="flexEnd">
              <EuiFlexItem grow={false}>
                {['PROCESSING', 'PENDING', 'PENDING_APPROVAL'].includes(
                  data.status
                ) && (
                  <>
                    <EuiText size="s">
                      <strong>Requested by:</strong>{' '}
                      {renderName(data?.createdBy)}
                    </EuiText>
                    <EuiSpacer size="xs" />
                    <EuiText size="s" style={{ marginBottom: '-15px' }}>
                      <strong>Requested:</strong>{' '}
                      {formatDate(data?.createdBy?.date)}
                    </EuiText>
                  </>
                )}
                {data.status === 'DONE' && (
                  <>
                    <EuiText size="s">
                      <strong>Generated by:</strong>{' '}
                      {renderName(data?.createdBy)}
                    </EuiText>
                    <EuiText size="s" style={{ marginBottom: '-15px' }}>
                      <strong>Generated:</strong>{' '}
                      {formatDate(data?.createdBy?.date)}
                    </EuiText>
                  </>
                )}
                <EuiSpacer />
                <EuiFlexGroup alignItems="center">
                  {data.status !== 'DONE' && (
                    <EuiText style={{ width: '200px' }} size="s">
                      <strong>Status: </strong>
                      <EuiBadge
                        color={
                          data?.status === 'REJECTED'
                            ? 'warning'
                            : data?.status === 'PENDING_APPROVAL'
                            ? 'primary'
                            : 'default'
                        }>
                        {statusText}
                      </EuiBadge>
                    </EuiText>
                  )}
                  {data.status === 'DONE' && data.files.length === 1 && (
                    <>
                      <EuiButton
                        style={{ width: '200px' }}
                        href={`/api/download/${data.files[0].key}`}
                        target="_blank">
                        Download
                      </EuiButton>
                    </>
                  )}
                  {data.status === 'DONE' && data.files.length > 1 && (
                    <EuiFlexGroup alignItems="center">
                      <Download files={data.files} />
                    </EuiFlexGroup>
                  )}
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  size="m"
                  color="primary"
                  aria-label="Delete"
                  isLoading={isDeleting}
                  onClick={() => handleDelete(data?.key)}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer />
    </>
  );
};

export default SheetCard;
