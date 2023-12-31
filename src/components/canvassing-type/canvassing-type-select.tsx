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
  selectedType: string;
  onChange: (type: ICanvassType) => void;
};

const CanvassTypeSelect: FunctionComponent<Props> = ({
  canvassTypes,
  selectedType,
  onChange,
}) => {
  // const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const generateId = htmlIdGenerator('campaign');
  const [selected, setSelected] = useState(
    canvassTypes.find(i => i.id === selectedType)?.name || ''
  );

  const handleChange = (type: ICanvassType) => {
    setSelected(type.name);
    onChange(type);
  };

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
                onChange={() => handleChange(item)}
              />
            </EuiFlexItem>
          );
        })}
      </EuiFlexGrid>
    </>
  );
};

export default CanvassTypeSelect;
