import { FunctionComponent, useContext } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
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

const campaignData = [
  {
    key: '1',
    name: 'Red/Pink registration calling',
    district: 'A placeholder',
  },
  { key: '2', name: 'Campaign 2024 Registration', district: 'A placeholder' },
  { key: '3', name: 'Campaign 2024 DAFor Confirm', district: 'A placeholder' },
  {
    key: '4',
    name: 'Comprehensive Telephone Canvassing',
    district: 'A placeholder',
  },
  {
    key: '5',
    name: 'Registration telephone and foot',
    district: 'A placeholder',
  },
];

const canvassTypeData = [{ name: 'Face to face' }, { name: 'Telephone' }];

const CanvassingType: FunctionComponent = () => {
  const { setUpdatePayload } = useContext(CanvassingContext);
  // const { campaign, setCampaign } = useState<ICampaign>();
  // const { campaignType, setCampaignType } = useState<ICanvassType>();

  // const onChange = (update: )

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
  ];

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
        <h3>Which campaign are you canvassing for?</h3>
      </EuiText>

      <EuiSpacer size="m" />

      <CampaignSelect
        campaigns={campaignData}
        onChange={update =>
          setUpdatePayload({
            field: 'canvass',
            data: {
              activity: update.key,
            },
          })
        }
      />

      <EuiSpacer size="l" />

      <EuiText size="xs">
        <h3>How was this voter canvassed?</h3>
      </EuiText>

      <EuiSpacer size="s" />

      <CanvassingTypeSelect
        canvassTypes={canvassTypeData}
        onChange={update =>
          setUpdatePayload({
            field: 'canvass',
            data: {
              type: update.name,
            },
          })
        }
      />
      <EuiSpacer />
      {formActions}
    </MainLayout>
  );
};

export default CanvassingType;
