import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiCallOut,
  EuiComboBox,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormControlLayout,
  EuiFormRow,
  EuiIcon,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiToolTip,
  useGeneratedHtmlId,
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
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';

const captureTypeData: ICaptureType[] = [
  { id: 'face', name: 'Face to face' },
  { id: 'phone', name: 'Telephone' },
];

const CaptureType: FunctionComponent = () => {
  const { campaignType, isLoading, error } = useCanvassTypeFetcher();
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);

  const [dob, setDob] = useState<Moment | null>(null);

  //Fetch Person
  const [voterKey, setVoterKey] = useState('');
  const { person } = usePersonFetcher(voterKey);

  const handleInputChange = event => {
    setVoterKey(event.target.value);
  };

  const handleButtonClick = () => {
    if (voterKey) {
      console.log(person?.key, 'person');
      setVoterKey(voterKey.trim());
      setUpdatePayload({
        field: 'canvass',
        data: {
          key: person?.key,
        },
      });
    }
  };

  const handleDOBChange = date => {
    setDob(date);
    setUpdatePayload({
      field: 'canvass',
      data: {
        date: date?.isValid() ? date.format('YYYY-MM-DD') : null,
      },
    });
  };

  const [name, setName] = useState('');

  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = selectedOptions => {
    if (selectedOptions.length > 0) {
      setSelectedOption(selectedOptions[0].value);
    } else {
      setSelectedOption('');
    }
  };

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

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButton
          isDisabled={!data?.canvass?.activity || !data?.canvass?.type}
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
          setUpdatePayload({
            field: 'canvass',
            data: {
              activity: update.key,
            },
          });
          setCampaign(update);
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
          <EuiComboBox
            compressed
            singleSelection={{ asPlainText: true }}
            options={[
              { value: 'Me', label: 'Me' },
              { value: 'Same as last capture', label: 'Same as last capture' },
              { value: 'Someone Else', label: 'Someone Else' },
            ]}
            onChange={handleSelectChange}
            fullWidth
            isClearable={false}
            css={{
              '.euiComboBoxPill--plainText': {
                display: 'none',
              },
              marginBottom: '5px',
            }}
          />
          {selectedOption === 'Someone Else' && (
            <EuiFormControlLayout
              isLoading={isLoading}
              append={
                <EuiButtonEmpty size="xs" onClick={handleButtonClick}>
                  Verify
                </EuiButtonEmpty>
              }>
              <EuiFieldText
                name="first"
                controlOnly
                compressed
                value={
                  person && voterKey.trim() !== ''
                    ? `${person.salutation} ${person.firstName} ${person.surname}`
                    : voterKey
                }
                onChange={handleInputChange}
                placeholder="ID or DARN Number"
              />
            </EuiFormControlLayout>
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
        selected={dob}
        maxDate={moment().add(2, 'years')}
        yearDropdownItemNumber={120}
        onChange={handleDOBChange}
      />

      <EuiSpacer size="m" />

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
