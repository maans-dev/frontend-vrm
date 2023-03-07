import { FunctionComponent, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui';
import { ICampaign } from './type';
import { css, Global } from '@emotion/react';

export type Props = {
  campaigns: ICampaign[];
};

const CampaignSelect: FunctionComponent<Props> = ({ campaigns }) => {
  // const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const generateId = htmlIdGenerator('campaign');
  const [selected, setSelected] = useState('');

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
        {campaigns?.map((item: ICampaign, i) => {
          return (
            <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
              <EuiCheckableCard
                id={generateId()}
                label={item.name}
                value={item.name}
                checked={selected === item.name}
                onChange={() => setSelected(item.name)}>
                <EuiText
                  size="xs"
                  onClick={() => setSelected(item.name)}
                  css={{ cursor: 'pointer' }}>
                  {item.district}
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
