import { FunctionComponent, useState } from 'react';
import { EuiFlexGrid, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';
import CanvassingTag from './canvassing-tag';
import { Field } from '@lib/domain/person';

export type Props = {
  fields: Field[];
  onTagClick?: (tag: Field) => void;
};

const presetFields: Partial<Field>[] = [
  {
    field: {
      category: 'Canvassing',
      code: 'WR',
      name: 'Will Register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'ASTREG',
      name: 'Assisted to register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'DR',
      name: 'Did (Re-)register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'WV',
      name: "Won't vote",
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'CV',
      name: "Can't vote",
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'M',
      name: 'Moved',
      active_status: true,
    },
    value: false,
  },
];

export const shortCodes = ['WR', 'ASTREG', 'DR', 'WV', 'CV', 'M'];

const CanvassingTags: FunctionComponent<Props> = ({ fields, onTagClick }) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [internalFields, setInternalFields] = useState<Field[]>(
    fields.filter(f => shortCodes.includes(f.field.code))
  );

  const getField = (field: Partial<Field>) => {
    const found = internalFields.find(f => {
      return f.field.code === field.field.code;
    });
    return found;
  };

  return (
    <EuiFlexGrid
      columns={isMobile ? 1 : 3}
      direction="row"
      gutterSize="s"
      responsive={true}>
      {presetFields.map((f, i) => {
        return (
          <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
            <CanvassingTag
              field={getField(f) || f}
              onChange={() => {
                // const updatedTag = { ...tag, enabled: !tag.enabled };
                // onTagClick && onTagClick(updatedTag);
              }}
            />
          </EuiFlexItem>
        );
      })}
    </EuiFlexGrid>
  );
};

export default CanvassingTags;
