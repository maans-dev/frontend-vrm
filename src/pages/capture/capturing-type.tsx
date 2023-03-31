import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiComboBox,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormControlLayout,
  EuiFormRow,
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
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';

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

  //Fetch Person
  const [voterKey, setVoterKey] = useState('');
  const { person } = usePersonFetcher(voterKey);
  const [isValid, setIsValid] = useState(true);
  const [toast, setToast] = useState(null);

  const handleInputChange = event => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setVoterKey(value);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleButtonClick = () => {
    if (voterKey && person && isValid) {
      const name = `${person.salutation} ${person.firstName} ${person.surname}`;
      setVoterKey(name);
      setUpdatePayload({
        field: 'canvass',
        data: {
          key: person?.key,
        },
      });
      setIsValid(true);
      setToast({
        title: 'Success!',
        color: 'success',
        iconType: 'check',
        text: `Voter ${voterKey} verified.`,
      });
      setTimeout(() => setToast(null), 2000); // close the success message after 2 seconds
    } else {
      setIsValid(false);
    }
  };

  const handleEditStart = () => {
    setVoterKey('');
    setIsValid(true);
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

  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = selectedOptions => {
    if (selectedOptions.length > 0) {
      setSelectedOption(selectedOptions[0].value);
    } else {
      setSelectedOption('');
    }
  };

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButton
          isDisabled={!data?.canvass?.activity || !data?.canvass?.type}
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
          console.log(update, 'capture update');
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
          {/* {toast && toast} */}
          {selectedOption === 'Someone Else' && (
            <EuiFormControlLayout
              isLoading={isLoading}
              append={
                <EuiButtonEmpty size="xs" onClick={handleButtonClick}>
                  Verify
                </EuiButtonEmpty>
              }>
              <EuiFormRow
                label="ID or DARN Number"
                isInvalid={!isValid}
                error={
                  !isValid ? 'Voter key should only contain numbers' : null
                }>
                <EuiFieldText
                  name="voter-key"
                  value={voterKey}
                  onChange={handleInputChange}
                  onFocus={handleEditStart}
                  isInvalid={!isValid}
                  aria-invalid={!isValid}
                  compressed
                />
              </EuiFormRow>
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
          console.log(update, 'capture update');
          setCanvassingType(update);
        }}
      />
      <EuiSpacer />
      {formActions}
    </MainLayout>
  );
};

export default CaptureType;
