import { FunctionComponent, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFlexGrid,
  EuiFlexItem,
  htmlIdGenerator,
} from '@elastic/eui';
import { ICanvassType } from './type';
import { css, Global } from '@emotion/react';

export type Props = {
  canvassTypes: ICanvassType[];
};

const CanvassTypeSelect: FunctionComponent<Props> = ({ canvassTypes }) => {
  // const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const generateId = htmlIdGenerator('campaign');
  const [selected, setSelected] = useState('');

  return (
    <>
      <Global
        styles={css`
          .canvass-type-selector .euiCheckableCard__label {
            padding-bottom: 12px;
          }
          .canvass-type-selector .euiSplitPanel__inner {
            padding: 12px;
          }
        `}
      />
      <EuiFlexGrid
        className="canvass-type-selector"
        columns={2}
        direction="row"
        gutterSize="s"
        responsive={false}>
        {canvassTypes?.map((item: ICanvassType, i) => {
          return (
            <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
              <EuiCheckableCard
                id={generateId()}
                label={item.name}
                value={item.name}
                checked={selected === item.name}
                onChange={() => setSelected(item.name)}
              />
            </EuiFlexItem>
          );
        })}
      </EuiFlexGrid>
    </>
  );
};

export default CanvassTypeSelect;
