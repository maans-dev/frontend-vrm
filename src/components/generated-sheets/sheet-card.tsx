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
};

const SheetCard: FunctionComponent<Props> = ({ data, sheetGenMutate }) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  function formatDate(dateString: string): string {
    return moment(dateString).fromNow();
  }

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
      <EuiPanel>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={2}>
            <EuiText size="m">
              <strong>{data.campaign.name}</strong>
            </EuiText>
            <EuiSpacer size="s" />
            {data?.structures?.[0]?.formatted ? (
              <>
                <EuiText size="s">{data?.structures?.[0]?.formatted}</EuiText>
                {/* <EuiText size="s">
                  Voting District, {data?.structures?.[0]?.province}
                </EuiText> */}
              </>
            ) : (
              <EuiText size="s" color="warning">
                Unknown structure
              </EuiText>
            )}
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            <EuiFlexGroup alignItems="center" justifyContent="flexEnd">
              <EuiFlexItem grow={false}>
                {['PROCESSING', 'PENDING'].includes(data.status) && (
                  <>
                    <EuiText size="s">
                      <strong>Requested by:</strong>{' '}
                      {renderName(data?.createdBy)}
                    </EuiText>
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
                    <EuiText style={{ width: '200px' }}>
                      <strong>Status:</strong>{' '}
                      <EuiBadge>{data?.status}</EuiBadge>
                    </EuiText>
                  )}
                  {data.status === 'DONE' && data.files.length === 1 && (
                    <>
                      <EuiButton
                        style={{ width: '200px' }}
                        href={data.files[0]}
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
