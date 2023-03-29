import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui';
import { css, Global } from '@emotion/react';
import { Campaign } from '@lib/domain/person';

export type Props = {
  campaigns: Campaign[];
  selectedKey?: string;
  onChange: (campaign: Campaign) => void;
};

const CampaignSelect: FunctionComponent<Props> = ({
  campaigns,
  selectedKey,
  onChange,
}) => {
  // const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const generateId = htmlIdGenerator('campaign');
  const [selected, setSelected] = useState('');

  const handleChange = (campaign: Campaign) => {
    console.log('CAMPAIGN', campaign);
    setSelected(campaign.key);
    onChange(campaign);
  };

  useEffect(() => {
    if (selectedKey) setSelected(selectedKey);
  }, [campaigns, selectedKey]);

  return (
    <>
      <Global
        styles={css`
          .campaign-selector .euiCheckableCard__label {
            font-weight: bold;
            padding-bottom: 7px;
            font-size: 12px;
          }
          .campaign-selector .euiSplitPanel__inner {
            padding: 7px;
          }
        `}
      />
      <EuiFlexGrid
        className="campaign-selector"
        // columns={isMobile ? 1 : 2}
        direction="row"
        gutterSize="s"
        responsive={true}>
        {campaigns?.map((item: Campaign) => {
          return (
            <EuiFlexItem key={item.key} grow={false} style={{ minWidth: 100 }}>
              <EuiCheckableCard
                id={generateId()}
                label={item.name}
                value={item.key}
                checked={selected === item.key}
                onChange={() => handleChange(item)}>
                <EuiText
                  size="xs"
                  onClick={() => handleChange(item)}
                  css={{ cursor: 'pointer' }}>
                  {item.type.description}
                </EuiText>
              </EuiCheckableCard>
            </EuiFlexItem>
          );
        })}
      </EuiFlexGrid>
    </>
  );
};

export default CampaignSelect;
