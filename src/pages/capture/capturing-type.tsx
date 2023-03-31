import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCallOut,
  EuiDatePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { css, Global } from '@emotion/react';
import CampaignSelect from '@components/canvassing-type/campaign-select';
import CanvassingTypeSelect from '@components/canvassing-type/canvassing-type-select';
import { CanvassingContext } from '@lib/context/canvassing.context';
import useCanvassTypeFetcher from '@lib/fetcher/campaign-type/campaign';
import { Campaign } from '@lib/domain/person';
import moment, { Moment } from 'moment';
import { ICaptureType } from '@lib/domain/capturer';
import CanvasserSelect from '@components/canvassing-type/canvasser-select';

const captureTypeData: ICaptureType[] = [
  { id: 'face', name: 'Face to face' },
  { id: 'phone', name: 'Telephone' },
];

const CaptureType: FunctionComponent = () => {
  const { campaignType, isLoading, error } = useCanvassTypeFetcher();
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
  const [dob, setDob] = useState<Moment | null>(null);

  useEffect(() => {
    setCampaignData(campaignType);
  }, [campaignType]);

  const { data, setUpdatePayload, setCampaign, setCanvassingType } =
    useContext(CanvassingContext);

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Capturing',
    },
  ];

  const handleDOBChange = date => {
    setDob(date);
    setUpdatePayload({
      field: 'canvass',
      data: {
        date: date?.isValid() ? date.format('YYYY-MM-DD') : null,
      },
    });
  };

  const canSubmit = () => {
    return (
      !data?.canvass?.activity ||
      !data?.canvass?.type ||
      !data.canvass.key ||
      !data?.canvass?.date
    );
  };

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButton
          isDisabled={canSubmit()}
          iconType="arrowRight"
          iconSide="right"
          size="m"
          fill
          onClick={() => router.push('/capture/capturing-search')}>
          Continue
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  if (isLoading) {
    return <MainLayout breadcrumb={breadcrumb} showSpinner={isLoading} />;
  }

  if (error) {
    return (
      <EuiCallOut title="Error" color="danger" iconType="alert">
        {error}
      </EuiCallOut>
    );
  }

  return (
    <MainLayout breadcrumb={breadcrumb}>
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
      <EuiText size="xs">
        <h3>Which campaign are you capturing for?</h3>
      </EuiText>

      <EuiSpacer size="m" />

      <CampaignSelect
        campaigns={campaignData}
        selectedKey={data?.canvass?.activity}
        onChange={update => {
          setUpdatePayload({
            field: 'canvass',
            data: {
              activity: update.key,
            },
          });
          setCampaign(update);
        }}
      />

      <EuiSpacer size="l" />

      <EuiText size="xs">
        <h3>Who did the canvass or spoke with the voter?</h3>
      </EuiText>

      <EuiSpacer size="s" />

      <CanvasserSelect
        lastCapturer={null} //TODO: Get lastCapturer from localStorage
        onChange={update => {
          setUpdatePayload({
            field: 'canvass',
            data: {
              key: update.key,
            },
          });
        }}
      />

      <EuiSpacer size="l" />

      <EuiText size="xs">
        <h3>When was this canvass taken?</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiDatePicker
        name="dob"
        placeholder="Select a date"
        dateFormat={['D MMM YYYY']}
        selected={dob}
        maxDate={moment().add(2, 'years')}
        yearDropdownItemNumber={120}
        onChange={handleDOBChange}
      />

      <EuiSpacer size="l" />

      <EuiText size="xs">
        <h3>How was this voter canvassed?</h3>
      </EuiText>

      <EuiSpacer size="s" />

      <CanvassingTypeSelect
        canvassTypes={captureTypeData}
        selectedType={data?.canvass?.type}
        onChange={update => {
          setUpdatePayload({
            field: 'canvass',
            data: {
              type: update.id,
            },
          });
          setCanvassingType(update);
        }}
      />
      <EuiSpacer />
      {formActions}
    </MainLayout>
  );
};

export default CaptureType;
