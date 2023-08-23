import { FunctionComponent, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCallOut,
  EuiEmptyPrompt,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { css, Global } from '@emotion/react';
import { SortingType } from '@components/sorting-type/type';
import GeneratedSheets from '@components/generated-sheets';
import useSheetGenFetcher from '@lib/fetcher/sheetgen/sheetgen';
import SheetGenerationModal from '@components/generated-sheets/sheet-generation-modal';

const sortingOptions: SortingType[] = [
  { id: 'street', name: 'Order by Street' },
  { id: 'name', name: 'Order by Surname, Name' },
];
import { useRouter } from 'next/router';

const Index: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Home',
      href: '/',
      onClick: e => {
        router.push('/');
        e.preventDefault();
      },
    },
    {
      text: 'Generate Sheets',
    },
  ];

  const {
    generatedSheetData,
    error: sheetGenError,
    isLoading: sheetGenLoading,
    mutate: sheetGenMutate,
  } = useSheetGenFetcher();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const modal = isModalVisible ? (
    <EuiOverlayMask>
      <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle>Generate a new sheet</EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <SheetGenerationModal
            onClose={closeModal}
            sortingOptions={sortingOptions}
            sheetGenMutate={sheetGenMutate}
          />
        </EuiModalBody>
      </EuiModal>
    </EuiOverlayMask>
  ) : null;

  if (sheetGenLoading) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        showSpinner={sheetGenLoading}></MainLayout>
    );
  }

  const generatedData = generatedSheetData?.filter(
    item => item.status !== 'DELETED'
  );

  // Empty prompt when user has no previously generated sheets
  if (!generatedData || generatedData?.length === 0) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        showSpinner={sheetGenLoading}>
        {sheetGenError && (
          <EuiCallOut
            title="Sheet Generation Error"
            color="danger"
            iconType="alert">
            {sheetGenError.message}
          </EuiCallOut>
        )}
        <EuiEmptyPrompt
          iconType="documents"
          iconColor="#000"
          title={<h2>Start generating sheets</h2>}
          body={
            <p>
              You have not generated any sheets yet. <br />
              Start generating a sheet below
            </p>
          }
          actions={
            <EuiButton color="primary" fill onClick={showModal}>
              Generate a sheet
            </EuiButton>
          }
        />
        {modal}
      </MainLayout>
    );
  }

  // Display previously generated/pending sheets
  return (
    <MainLayout
      breadcrumb={breadcrumb}
      panelled={false}
      showSpinner={sheetGenLoading}>
      <Global
        styles={css`
          li.euiSelectableListItem[aria-checked='true'] {
            background: #155fa220;
          }
          li.euiSelectableListItem {
            font-weight: 600;
          }
        `}
      />
      <div style={{ textAlign: 'right' }}>
        <EuiButton
          iconType="plusInCircle"
          iconSide="right"
          size="m"
          fill
          onClick={showModal}>
          Generate a new sheet
        </EuiButton>
        {modal}
      </div>
      <EuiSpacer />
      {sheetGenError && (
        <EuiCallOut
          title="Sheet Generation Error"
          color="danger"
          iconType="alert">
          {sheetGenError.message}
        </EuiCallOut>
      )}
      <GeneratedSheets
        sheetGenData={generatedSheetData}
        sheetGenMutate={sheetGenMutate}
      />
    </MainLayout>
  );
};

export default Index;
