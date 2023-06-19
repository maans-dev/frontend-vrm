import CampaignSelect from '@components/canvassing-type/campaign-select';
import SortingTypeSelect from '@components/sorting-type/sorting-type-select';
import { SortingType } from '@components/sorting-type/type';
import Structres from '@components/structure-search';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiLoadingChart,
  EuiModalFooter,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { appsignal, redactObject } from '@lib/appsignal';
import { Campaign, Structure } from '@lib/domain/person';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import useCampaignSheetGenFetcher from '@lib/fetcher/campaign-sheetgen/campaign';
import { useSession } from 'next-auth/react';
import { FunctionComponent, useState } from 'react';
import { KeyedMutator } from 'swr';

export type Props = {
  onClose: () => void;
  sortingOptions: SortingType[];
  sheetGenMutate: KeyedMutator<SheetGeneration[]>;
};

const SheetGenerationModal: FunctionComponent<Props> = ({
  onClose,
  sortingOptions,
  sheetGenMutate,
}) => {
  const { data: session } = useSession();
  const [selectedStructure, setSelectedStructure] =
    useState<Partial<Structure>>();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>();
  const [selectedSort, setSelectedSort] = useState<SortingType>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    campaignType,
    isLoading: campaignTypeLoading,
    error: campaignTypeError,
  } = useCampaignSheetGenFetcher();

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log({ selectedStructure });

    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/extract/sheetgen`;
    const reqPayload = {
      structures: [
        {
          type: selectedStructure.type,
          code:
            selectedStructure.type === 'VOTINGDISTRICT'
              ? selectedStructure.votingDistrict_id
              : selectedStructure.ward,
        },
      ],
      campaign: selectedCampaign.key,
      sortOrder: selectedSort.id,
    };
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(reqPayload),
    });

    setIsLoading(false);

    if (!response.ok) {
      const errJson = JSON.parse(await response.clone().text());
      appsignal.sendError(
        new Error(
          `Unable to request a new sheet generation task: ${errJson.message}`
        ),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            body: redactObject(reqPayload),
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }

    const respPayload = await response.clone().json();

    sheetGenMutate();

    setSelectedCampaign(null);
    setSelectedStructure(null);
    setSelectedSort(null);

    onClose();
  };

  const isDisabled = !(selectedCampaign && selectedStructure && selectedSort);

  if (campaignTypeLoading) {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <EuiSpacer />
        <EuiLoadingChart mono size="xl" />
        <EuiSpacer />
      </div>
    );
  }

  return (
    <>
      {campaignTypeError && (
        <EuiCallOut title="Campaign Type Error" color="danger" iconType="alert">
          {campaignTypeError}
        </EuiCallOut>
      )}

      <EuiText size="xs">
        <h3>Search for a structure:</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <Structres
        showSelected={true}
        onSelect={(label, data, value) => setSelectedStructure(data)}
      />
      <EuiSpacer size="m" />
      <EuiText size="xs">
        <h3>Type of sheet:</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <CampaignSelect
        campaigns={campaignType}
        onChange={campaign => {
          setSelectedCampaign(campaign);
        }}
      />
      <EuiSpacer size="m" />
      <EuiText size="xs">
        <h3>Sorting:</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <SortingTypeSelect
        sortingTypes={sortingOptions}
        onChange={type => {
          setSelectedSort(type);
        }}
      />
      <EuiSpacer />
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>
        <EuiButton onClick={handleSubmit} fill disabled={isDisabled}>
          Request
        </EuiButton>
      </EuiModalFooter>
    </>
  );
};

export default SheetGenerationModal;
