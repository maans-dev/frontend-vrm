import { FunctionComponent, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  useGeneratedHtmlId,
  EuiText,
  EuiHighlight,
  EuiSelectableOption,
  EuiSelectable,
  EuiCheckableCard,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { css, Global } from '@emotion/react';

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
  ];

  const onContactMethodChange = id => {
    setContactMethod(id);
  };
  const radioGroupId = useGeneratedHtmlId({ prefix: 'canvassType' });
  const checkableCardId__1 = useGeneratedHtmlId({
    prefix: 'checkableCard',
    suffix: 'first',
  });
  const checkableCardId__2 = useGeneratedHtmlId({
    prefix: 'checkableCard',
    suffix: 'second',
  });

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButton
          iconType="arrowRight"
          iconSide="right"
          size="m"
          fill
          onClick={() => router.push('/canvass/voter-search')}>
          Continue
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
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
      <EuiFlexGroup direction="row" justifyContent="center">
        <EuiFlexItem grow={true} css={{ maxWidth: '800px' }}>
          <EuiCard
            textAlign="left"
            title=""
            titleSize="xs"
            footer={formActions}>
            <EuiText size="xs">
              <h3>Which campaign are you canvassing for?</h3>
            </EuiText>

            <EuiSpacer size="m" />

            <EuiSelectable
              aria-label="Select a campaign"
              singleSelection="always"
              options={options}
              onChange={options => setOptions(options)}
              listProps={{
                rowHeight: 50,
                showIcons: true,
                onFocusBadge: false,
                bordered: true,
                // css: { background: '#ffcc00' },
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

            <EuiSpacer size="xxl" />

            <EuiText size="xs">
              <h3>How was this voter canvassed?</h3>
            </EuiText>

            <EuiSpacer size="m" />

            <EuiFlexGroup
              gutterSize="m"
              justifyContent="spaceBetween"
              responsive={false}>
              <EuiFlexItem>
                <EuiCheckableCard
                  id={checkableCardId__1}
                  label="Face to face"
                  name={radioGroupId}
                  value="face-to-face"
                  checked={contactMethod === 'face-to-face'}
                  onChange={() => onContactMethodChange('face-to-face')}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiCheckableCard
                  id={checkableCardId__2}
                  label="Telephone"
                  name={radioGroupId}
                  value="telephone"
                  checked={contactMethod === 'telephone'}
                  onChange={() => onContactMethodChange('telephone')}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer />
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default CanvassingType;
