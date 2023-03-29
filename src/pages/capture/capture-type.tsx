import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCallOut,
  EuiComboBox,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { css, Global } from '@emotion/react';
import CampaignSelect from '@components/canvassing-type/campaign-select';
import CanvassingTypeSelect from '@components/canvassing-type/canvassing-type-select';
import { CanvassingContext } from '@lib/context/canvassing.context';
import useCanvassTypeFetcher from '@lib/fetcher/campaign-type/campaign';
import { Campaign } from '@lib/domain/person';
import moment from 'moment';

const canvassTypeData = [
  { id: 'face', name: 'Face to face' },
  { id: 'phone', name: 'Telephone' },
];

const CaptureType: FunctionComponent = () => {
  const { campaignType, isLoading, error } = useCanvassTypeFetcher();
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = e => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    setCampaignData(campaignType);
  }, [campaignType]);

  const { data, setUpdatePayload, setCampaign, setCanvassingType } =
    useContext(CanvassingContext);

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Capture',
    },
  ];

  // const onChange = (update: )

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButton
          //   isDisabled={!data?.canvass?.activity || !data?.canvass?.type}
          iconType="arrowRight"
          iconSide="right"
          size="m"
          fill
          onClick={() => router.push('/capture/capture-search')}>
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
          console.log(update);
        }}
      />

      <EuiSpacer size="m" />

      <EuiText size="xs">
        <h3>Who did the canvass or spoke with the voter?</h3>
      </EuiText>
      <EuiSpacer size="s" />

      <EuiFormRow
        display="rowCompressed"
        className={
          selectedOption === 'Someone Else'
            ? 'euiFormControlLayout__item--marginBottom'
            : ''
        }>
        <div>
          <EuiSelect
            options={[
              { value: 'Me', text: 'Me' },
              { value: 'Same as last capture', text: 'Same as last capture' },
              { value: 'Someone Else', text: 'Someone Else' },
            ]}
            compressed
            value={selectedOption}
            onChange={handleSelectChange}
          />
          {selectedOption === 'Someone Else' && (
            <EuiFormRow>
              <EuiFieldText
                name="first"
                compressed
                placeholder="ID or DARN Number"
              />
            </EuiFormRow>
          )}
          {selectedOption === 'Same as last capture' && (
            <EuiFormRow>
              <EuiFieldText
                name="lastCapture"
                compressed
                disabled
                placeholder="John Smith (8210105080082)"
              />
            </EuiFormRow>
          )}
        </div>
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiText size="xs">
        <h3>When was this canvass taken?</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiDatePicker
        name="dob"
        dateFormat={['D MMM YYYY']}
        maxDate={moment().add(2, 'years')}
        yearDropdownItemNumber={120}
      />

      <EuiSpacer size="m" />

      <EuiText size="xs">
        <h3>How was this voter canvassed?</h3>
      </EuiText>

      <EuiSpacer size="s" />

      <CanvassingTypeSelect
        canvassTypes={canvassTypeData}
        selectedType={data?.canvass?.type}
        onChange={update => {
          console.log(update);
          //   setCanvassingType(update);
        }}
      />
      <EuiSpacer />
      {formActions}
    </MainLayout>
  );
};

export default CaptureType;
