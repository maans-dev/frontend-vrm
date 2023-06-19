import { FunctionComponent, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFlexGroup,
  EuiFlexItem,
  htmlIdGenerator,
} from '@elastic/eui';
import { SortingType } from './type';
import { css, Global } from '@emotion/react';

export type Props = {
  sortingTypes: SortingType[];
  selectedType?: string;
  onChange: (type: SortingType) => void;
};

const SortingTypeSelect: FunctionComponent<Props> = ({
  sortingTypes,
  selectedType,
  onChange,
}) => {
  const generateId = htmlIdGenerator('sorting');
  const [selected, setSelected] = useState(
    sortingTypes.find(i => i.id === selectedType)?.name || ''
  );

  const handleChange = (type: SortingType) => {
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
      <EuiFlexGroup
        className="canvass-type-selector"
        direction="column"
        gutterSize="s"
        responsive={false}>
        {sortingTypes?.map((item: SortingType, i) => (
          <EuiFlexItem key={i} style={{ minWidth: 100 }}>
            <EuiCheckableCard
              id={generateId()}
              label={item.name}
              value={item.name}
              checked={selected === item.name}
              onChange={() => handleChange(item)}
            />
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </>
  );
};

export default SortingTypeSelect;
