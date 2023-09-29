import React, {
  Fragment,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  EuiButtonIcon,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTab,
  EuiTabs,
} from '@elastic/eui';
import CommsApproverCard from './approvals-card';
import { BulkComms } from '@lib/domain/bulk-comms';
import { KeyedMutator } from 'swr';

export type Props = {
  bulkCommsApprovalData?: BulkComms[];
  onSelectedTabChanged: (id: string) => void;
  mutate: KeyedMutator<BulkComms[]>;
  selectedTabId: string;
};

const CommsApproval: FunctionComponent<Props> = ({
  bulkCommsApprovalData,
  mutate,
  selectedTabId,
  onSelectedTabChanged,
}) => {
  const bulkCommsTabs = useMemo(
    () => [
      {
        id: 'pending',
        name: 'Pending',
        content: (
          <Fragment>
            <EuiSpacer />

            {bulkCommsApprovalData?.length > 0 ? (
              bulkCommsApprovalData.map(item => (
                <CommsApproverCard
                  key={item.key}
                  data={item}
                  bulkCommsMutate={mutate}
                />
              ))
            ) : (
              <EuiEmptyPrompt
                style={{
                  padding: '16px',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}
                iconType="aggregate"
                iconColor="#000"
                title={<h2>Bulk Comms Pending</h2>}
                body={<p>There are no new bulk comms pending for approval.</p>}
              />
            )}
          </Fragment>
        ),
      },
      {
        id: 'approvedD',
        name: 'Approved for download',
        content: (
          <Fragment>
            <EuiSpacer />

            {bulkCommsApprovalData?.length > 0 ? (
              bulkCommsApprovalData.map(item => (
                <CommsApproverCard
                  key={item.key}
                  data={item}
                  bulkCommsMutate={mutate}
                />
              ))
            ) : (
              <EuiEmptyPrompt
                style={{
                  padding: '16px',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}
                iconType="aggregate"
                iconColor="#000"
                title={<h2>Bulk Comms Approved for download</h2>}
                body={<p>There are no new approved for download bulk comms</p>}
              />
            )}
          </Fragment>
        ),
      },
      {
        id: 'approvedS',
        name: 'Approved for send',
        content: (
          <Fragment>
            <EuiSpacer />

            {bulkCommsApprovalData?.length > 0 ? (
              bulkCommsApprovalData
                .filter(i => i.status !== 'REJECTED')
                .sort((a, b) => {
                  if (
                    a.status === 'WAITING_TO_SEND' &&
                    b.status !== 'WAITING_TO_SEND'
                  ) {
                    return -1;
                  }
                  if (
                    a.status !== 'WAITING_TO_SEND' &&
                    b.status === 'WAITING_TO_SEND'
                  ) {
                    return 1;
                  }
                  return 0;
                })
                .map(item => (
                  <CommsApproverCard
                    bulkCommsMutate={mutate}
                    key={item.key}
                    data={item}
                    approvedForSend={true}
                  />
                ))
            ) : (
              <EuiEmptyPrompt
                style={{
                  padding: '16px',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}
                iconType="aggregate"
                iconColor="#000"
                title={<h2>Bulk Comms Approved for send</h2>}
                body={<p>There are no new approved for send bulk comms.</p>}
              />
            )}
          </Fragment>
        ),
      },
      {
        id: 'rejected',
        name: 'Rejected',
        content: (
          <Fragment>
            <EuiSpacer />

            {bulkCommsApprovalData && bulkCommsApprovalData?.length > 0 ? (
              bulkCommsApprovalData.map(item => (
                <CommsApproverCard
                  key={item.key}
                  data={item}
                  bulkCommsMutate={mutate}
                />
              ))
            ) : (
              <EuiEmptyPrompt
                style={{
                  padding: '16px',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}
                iconType="aggregate"
                iconColor="#000"
                title={<h2>Bulk Comms Rejected</h2>}
                body={<p>There are no new rejected bulk comms.</p>}
              />
            )}
          </Fragment>
        ),
      },
    ],
    [bulkCommsApprovalData, mutate]
  );

  const selectedTabContent = useMemo(() => {
    return bulkCommsTabs.find(i => i.id === selectedTabId)?.content;
  }, [bulkCommsTabs, selectedTabId]);

  const renderBulkCommsTabName = () => {
    return bulkCommsTabs.map((tab, index) => (
      <EuiTab
        key={index}
        color="primary"
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}>
        {tab.name}
      </EuiTab>
    ));
  };

  return (
    <>
      <EuiFlexGroup justifyContent="center" alignItems="center">
        {' '}
        <EuiFlexItem>
          <EuiTabs size="l">{renderBulkCommsTabName()}</EuiTabs>
        </EuiFlexItem>
      </EuiFlexGroup>
      {selectedTabContent}
    </>
  );
};

export default CommsApproval;
