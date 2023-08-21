import React, {
  Fragment,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SheetApproverCard from './approval-cards';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTab,
  EuiTabs,
} from '@elastic/eui';

export type Props = {
  sheetData: SheetGeneration[];
  rejectedSheets: SheetGeneration[];
  approvedSheets: SheetGeneration[];
};

const SheetApproval: FunctionComponent<Props> = ({
  sheetData,
  rejectedSheets,
  approvedSheets,
}) => {
  const [rejectedSheetData, setRejectedSheetData] =
    useState<SheetGeneration[]>(rejectedSheets);
  const [approvedSheetData, setApprovedSheetData] =
    useState<SheetGeneration[]>(approvedSheets);
  const [pendingApprovedSheets, setPendingApprovedSheets] =
    useState<SheetGeneration[]>(sheetData);
  // const [loadingOnRefresh, setLoadingOnRefresh] = useState(false);
  const sheetGenTabs = [
    {
      id: 'pending',
      name: 'Pending',
      content: (
        <Fragment>
          <EuiSpacer />
          {/* {loadingOnRefresh && <Spinner show={loadingOnRefresh} />} */}
          {Array.isArray(pendingApprovedSheets) &&
          pendingApprovedSheets?.length > 0 ? (
            pendingApprovedSheets.map(item => (
              <SheetApproverCard key={item.key} data={item} />
            ))
          ) : (
            <EuiEmptyPrompt
              hasShadow
              iconType="documents"
              iconColor="#000"
              title={<h2>Sheet Generation Approval</h2>}
              body={<p>There are no new sheets pending for approval.</p>}
            />
          )}
        </Fragment>
      ),
    },
    {
      id: 'approved',
      name: 'Approved',
      content: (
        <Fragment>
          <EuiSpacer />
          {/* {isLoading && <SpinnerEmbed show={isLoading} />} */}
          {Array.isArray(approvedSheetData) && approvedSheetData?.length > 0 ? (
            approvedSheetData.map(item => (
              <SheetApproverCard key={item.key} data={item} approved={true} />
            ))
          ) : (
            <EuiEmptyPrompt
              hasShadow
              iconType="documents"
              iconColor="#000"
              title={<h2>Sheet Generation Approval</h2>}
              body={<p>There are no new approved sheets.</p>}
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
          {/* {isLoading && <SpinnerEmbed show={isLoading} />} */}
          {Array.isArray(rejectedSheetData) && rejectedSheetData?.length > 0 ? (
            rejectedSheetData.map(item => (
              <SheetApproverCard key={item.key} data={item} rejected={true} />
            ))
          ) : (
            <EuiEmptyPrompt
              hasShadow
              iconType="documents"
              iconColor="#000"
              title={<h2>Sheet Generation Approval</h2>}
              body={<p>There are no new rejected sheets.</p>}
            />
          )}
        </Fragment>
      ),
    },
  ];

  useEffect(() => {
    setPendingApprovedSheets(sheetData);
    setApprovedSheetData(approvedSheets);
    setRejectedSheetData(rejectedSheets);
  }, [approvedSheets, rejectedSheets, sheetData]);

  const [selectedTabId, setSelectedTabId] = useState('pending');
  const selectedTabContent = useMemo(() => {
    return sheetGenTabs.find(i => i.id === selectedTabId)?.content;
  }, [selectedTabId]);

  const onSelectedTabChanged = id => {
    setSelectedTabId(id);
  };

  const renderSheetGenTabName = () => {
    return sheetGenTabs.map((tab, index) => (
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
          <EuiTabs size="l">{renderSheetGenTabName()}</EuiTabs>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          {' '}
          {/* <EuiButtonIcon
            display="base"
            size="s"
            iconType="refresh"
            aria-label="Refresh"
            onClick={handleRefreshClick}
          /> */}
        </EuiFlexItem>
      </EuiFlexGroup>
      {selectedTabContent}
    </>
  );
};

export default SheetApproval;
