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
import Spinner from '@components/spinner/spinner';
import { CanvassType } from '@lib/domain/person';

const canvassTypeData = [{ name: 'Face to face' }, { name: 'Telephone' }];

const CanvassingType: FunctionComponent = () => {
  const { campaignType, isLoading, error } = useCanvassTypeFetcher();
  const [campaignData, setCampaignData] = useState<CanvassType[]>([]);

  useEffect(() => {
    setCampaignData(campaignType);
  }, [campaignType]);

  const { setUpdatePayload } = useContext(CanvassingContext);

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
  ];

  // const onChange = (update: )

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

  if (isLoading) {
    return (
      <MainLayout breadcrumb={breadcrumb}>
        <Spinner show={isLoading} />
      </MainLayout>
    );
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
