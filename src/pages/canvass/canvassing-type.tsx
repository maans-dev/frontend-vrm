import { FunctionComponent, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiFormRow,
  EuiSpacer,
  useGeneratedHtmlId,
  EuiText,
  EuiHighlight,
  EuiSelectableOption,
  EuiSelectable,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';

const campaignData = [
  { name: 'Red/Pink registration calling', district: 'A placeholder' },
  { name: 'Campaign 2024 Registration', district: 'A placeholder' },
  { name: 'Campaign 2024 DAFor Confirm', district: 'A placeholder' },
  { name: 'Comprehensive Telephone Canvassing', district: 'A placeholder' },
  { name: 'Registration telephone and foot', district: 'A placeholder' },
];

interface OptionData {
  secondaryContent?: string;
}

const CanvassingType: FunctionComponent = () => {
  const [contactMethod, setContactMethod] = useState('face-to-face');

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
    {
      text: 'Canvassing Type',
    },
  ];

  const onContactMethodChange = id => {
    setContactMethod(id);
  };
  const basicButtonGroupPrefix = useGeneratedHtmlId({
    prefix: 'basicButtonGroup',
  });

  const formActions = (
    <>
      <EuiFlexGroup
        direction="row"
        responsive={false}
        justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty size="m">Reset</EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            size="m"
            fill
            onClick={() => router.push('/canvass/voter-search')}>
            Continue
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );

  const [options, setOptions] = useState<
    Array<EuiSelectableOption<OptionData>>
  >([
    ...campaignData.map(
      (campaign): EuiSelectableOption => ({
        label: `${campaign.name}`,
        searchableLabel: `${campaign.name}`,
        data: {
          secondaryContent: campaign.district,
        },
      })
    ),
  ]);

  const renderCampaignOption = (
    option: EuiSelectableOption<OptionData>,
    searchValue: string
  ) => {
    return (
      <>
        <EuiHighlight search={searchValue}>{option.label}</EuiHighlight>
        <EuiText size="xs" color="subdued" className="eui-displayBlock">
          <small>
            <EuiHighlight search={searchValue}>
              {option.secondaryContent || ''}
            </EuiHighlight>
          </small>
        </EuiText>
      </>
    );
  };

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <EuiFlexGroup direction="row" justifyContent="center">
        <EuiFlexItem grow={true} css={{ maxWidth: '800px' }}>
          <EuiCard
            textAlign="left"
            title="Canvassing Type"
            titleSize="xs"
            footer={formActions}>
            <EuiFormFieldset
              legend={{ children: 'Which campaign are you canvassing for?' }}>
              <EuiSelectable
                aria-label="Select a campaign"
                singleSelection
                options={options}
                onChange={options => setOptions(options)}
                listProps={{
                  rowHeight: 50,
                  showIcons: false,
                  onFocusBadge: false,
                }}
                renderOption={renderCampaignOption}
                height={250}>
                {(list, search) => (
                  <>
                    {search}
                    {list}
                  </>
                )}
              </EuiSelectable>
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset
              legend={{ children: 'How was this voter canvassed?' }}>
              <EuiFormRow fullWidth>
                <EuiButtonGroup
                  legend="Canvassing type"
                  color="primary"
                  // buttonSize="compressed"
                  isFullWidth={true}
                  options={[
                    {
                      id: 'face-to-face',
                      label: 'Face to Face',
                    },
                    {
                      id: 'telephone',
                      label: 'Telephone',
                    },
                  ]}
                  idSelected={contactMethod}
                  onChange={onContactMethodChange}
                  name={`${basicButtonGroupPrefix}-contact-method`}
                />
              </EuiFormRow>
            </EuiFormFieldset>
            <EuiSpacer />
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default CanvassingType;
