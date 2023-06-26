import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiCallOut,
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
import { ICanvassType } from '@components/canvassing-type/type';

const canvassTypeData: ICanvassType[] = [
  { id: 'face', name: 'Face to face' },
  { id: 'phone', name: 'Telephone' },
];

const CanvassingType: FunctionComponent = () => {
  const { campaignType, isLoading, error } = useCanvassTypeFetcher();
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaignData(campaignType);
  }, [campaignType]);

  const { data, setUpdatePayload, setCampaign, setCanvassingType } =
    useContext(CanvassingContext);

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
      text: 'Canvass',
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
          onClick={() => router.push('/canvass/voter-search')}>
          Continue
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  if (isLoading) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        showSpinner={isLoading}
        panelled={false}
      />
    );
  }

  return (
    <MainLayout breadcrumb={breadcrumb} panelled={false}>
      {error && (
        <>
          <EuiCallOut
            title="Somethig went wrong"
            color="danger"
            iconType="alert">
            {error?.message ? error.message : 'Unknown error'}
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
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
        <h3>How was this voter canvassed?</h3>
      </EuiText>
      <EuiSpacer size="s" />
      <CanvassingTypeSelect
        canvassTypes={canvassTypeData}
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

export default CanvassingType;
