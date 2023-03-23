import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui';
import { css, Global } from '@emotion/react';
import { CanvassType } from '@lib/domain/person';

export type Props = {
  campaigns: CanvassType[];
  selectedKey?: string;
  onChange: (campaign: CanvassType) => void;
};

const CampaignSelect: FunctionComponent<Props> = ({
  campaigns,
  selectedKey,
  onChange,
}) => {
  // const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const generateId = htmlIdGenerator('campaign');
  const [selected, setSelected] = useState('');

  const handleChange = (campaign: CanvassType) => {
    setSelected(campaign.name);
    onChange(campaign);
  };

  useEffect(() => {
    if (selectedKey)
      setSelected(campaigns.find(c => c.key === selectedKey)?.name);
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
        {campaigns?.map((item: CanvassType, i) => {
          return (
            <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
              <EuiCheckableCard
                id={generateId()}
                label={item.name}
                value={item.name}
                checked={selected === item.name}
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
