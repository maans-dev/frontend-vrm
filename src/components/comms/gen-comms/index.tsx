import Structres from '@components/structure-search';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiModalFooter,
  EuiSpacer,
} from '@elastic/eui';
import { Campaign } from '@lib/domain/person';
import {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import CampaignSelect from '@components/canvassing-type/campaign-select';
import router from 'next/router';
import MessageSection from './message-section';
import SendBySelection from './send-by-section';
import useSmsCounter from '@lib/hooks/useSmsCounter';
import { useSession } from 'next-auth/react';
import { appsignal, redactObject } from '@lib/appsignal';
import { ToastContext } from '@lib/context/toast.context';
import useFetchCountAndCost, {
  CommsFetchResponse,
} from '@lib/hooks/useCountAndCost';
import { SmsInfoType } from './sms-counter';

const calculateCost = (smsInfo: SmsInfoType, countCost: CommsFetchResponse) => {
  if (!smsInfo || !countCost) {
    return null;
  }

  let value = countCost.costing.value;
  // Convert value to decimal if valueType is 'CENTS'
  if (countCost.costing.valueType === 'CENTS') {
    value = value / 100; // Divide by 100 to convert cents to decimal
  }

  const messages = smsInfo.messages || 0;
  const per = countCost.costing.per || 1;
  const numbers = countCost.count || 0;

  const totalCost = messages * (value / per) * numbers;

  // Format totalCost as currency with 2 decimal places and comma separator
  const formattedCost = totalCost.toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  });

  return formattedCost;
};

export type Props = {
  mode: string;
  bulkCommsCampaignType: Campaign[];
};

export interface IBulkCommsOwnSendType {
  name: string;
  id: string;
}

const GenerateBulkComms: FunctionComponent<Props> = ({
  mode,
  bulkCommsCampaignType,
}) => {
  const { data: session } = useSession();
  const { addToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const { smsText, setSmsText, smsInfo } = useSmsCounter();
  const [selectedStructures, setSelectedStructures] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>();
  const [purpose, setPurpose] = useState('');
  const [sendByOption, setSendByOption] = useState<string | null>(null);
  const [cost, setCost] = useState<string>(null);

  const { countCost } = useFetchCountAndCost(
    selectedStructures,
    selectedCampaign,
    mode,
    session?.accessToken
  );

  const handlePurposeChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPurpose(event.target.value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSmsText(event.target.value);
  };

  const handleClearForm = () => {
    setSelectedCampaign(undefined);
    setPurpose('');
    setSendByOption(null);
    setSmsText('');
    setSelectedStructures([]);
  };

  const handleStructuresSelect = option => {
    const structure = {
      type: option.value.type,
      code:
        option.value.type === 'VOTINGDISTRICT'
          ? option.value.votingDistrict_id
          : option.value.ward,
    };

    setSelectedStructures(prevSelected => [...prevSelected, structure]);
  };

  // const handleSendByChange = (option: string) =>
  //   setSendByOption(option === sendByOption ? null : option);

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/extract/${
      mode === 'sms' ? 'sms' : 'email'
    }/`;
    const reqPayload = {
      structures: selectedStructures,
      campaign: selectedCampaign.key,
      sender: 'FHO',
      message: smsText,
      requestReason: purpose,
      messageCharacters: smsInfo.length,
      criteria_number: countCost.count,
      cost: cost.replace(/[^\d.,]/g, ''),
    };
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(reqPayload),
    });

    if (response.ok) {
      addToast({
        id: 'bulk-comms-sms-success',
        title: 'Request sent successfully',
        color: 'success',
      });

      router.push('/comms');
    }

    if (!response.ok) {
      const errJson = await response.clone().text();
      appsignal.sendError(
        new Error(`Unable to request a new bulk comms task: ${errJson}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            body: redactObject(reqPayload),
          });
          span.setTags({ user_darn: session?.user?.darn?.toString() });
        }
      );
      return;
    }

    const respPayload = await response.clone().json();
    console.log({ respPayload });
    setSelectedCampaign(null);
    setSelectedStructures(null);
    setIsLoading(false);
  };

  const arePropertiesFilled =
    selectedStructures && selectedCampaign?.key && purpose;

  useEffect(() => {
    if (countCost && smsInfo) {
      const calculatedCost = calculateCost(smsInfo, countCost);
      setCost(calculatedCost);
    }
  }, [countCost, smsInfo]);

  return (
    <>
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton
            iconSide="left"
            iconType="arrowLeft"
            iconSize="s"
            onClick={() => router.push('/comms')}>
            Cancel
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="s" />

      <EuiFormFieldset legend={{ children: 'Search for a structure:' }}>
        <EuiSpacer size="xs" />
        <Structres
          showSelected={true}
          onSelect={handleStructuresSelect}
          bulkComms={true}
          addLimitAction={true}
        />
        <EuiSpacer size="s" />
      </EuiFormFieldset>
      <EuiSpacer size="m" />

      <EuiFormFieldset legend={{ children: 'Who should your message go to?' }}>
        <CampaignSelect
          campaigns={bulkCommsCampaignType}
          onChange={campaign => {
            setSelectedCampaign(campaign);
          }}
        />
      </EuiFormFieldset>
      <EuiSpacer size="m" />

      <MessageSection
        onPurposeChange={handlePurposeChange}
        purpose={purpose}
        mode={mode}
        handleTextChange={handleTextChange}
        smsInfo={smsInfo}
        smsCost={cost}
        smsText={smsText}
        countCost={countCost}
      />

      <EuiSpacer size="m" />

      {/* <SendBySelection
        handleSendByChange={handleSendByChange}
        sendByOption={sendByOption}
      /> */}

      <EuiSpacer size="m" />
      <EuiModalFooter>
        <EuiButtonEmpty onClick={handleClearForm}>Clear</EuiButtonEmpty>
        <EuiButton onClick={handleSubmit} fill disabled={!arePropertiesFilled}>
          Request
        </EuiButton>
      </EuiModalFooter>
    </>
  );
};

export default GenerateBulkComms;
