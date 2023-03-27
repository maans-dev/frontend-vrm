import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { EuiFlexGrid, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';
import CanvassingTag from './canvassing-tag';
import { Field } from '@lib/domain/person';
import { VoterTagsType } from '@lib/domain/voter-tags';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { GiConsoleController } from 'react-icons/gi';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  fields: Field[];
  onTagChange: (data: PersonUpdate<VoterTagsUpdate>) => void;
};

const presetFields: Partial<Field>[] = [
  {
    field: {
      category: 'Canvassing',
      code: 'WR',
      description: 'Will Register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'ASTREG',
      description: 'Assisted to register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'DR',
      description: 'Did (Re-)register',
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'WV',
      description: "Won't vote",
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'CNVT',
      description: "Can't vote",
      active_status: true,
    },
    value: false,
  },
  {
    field: {
      category: 'Canvassing',
      code: 'M',
      description: 'Moved',
      active_status: true,
    },
    value: false,
  },
];

export const shortCodes = ['WR', 'ASTREG', 'DR', 'WV', 'CNVT', 'M'];

const CanvassingTags: FunctionComponent<Props> = ({ fields, onTagChange }) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [internalFields, setInternalFields] = useState<Field[]>(
    fields.filter(f => shortCodes.includes(f.field.code))
  );
  const [tags, setTags] = useState<VoterTagsType[]>(
    fields
      .filter(field => shortCodes.includes(field.field.code))
      .map(field => ({ field }))
  );
  const { nextId } = useContext(CanvassingContext);

  console.log(tags, 'tags');

  const getField = (field: Partial<Field>) => {
    const found = internalFields.find(f => {
      return f.field.code === field.field.code;
    });
    return found;
  };

  const handlePayload = (field: Partial<Field>) => {
    //Payload Data
    const tagDescription = field;
    //Existed Tag
    const tagExisted = getField(field);

    if (tagExisted) {
      // If the tag already exists, update its value
      const updatedTags = tags.map(tag => {
        if (tagDescription.field.code === tagExisted.field.code) {
          return {
            key: tagExisted.key,
            value: false,
          };
        } else {
          return tag;
        }
      });

      setTags(updatedTags);
    } else if (tagDescription) {
      // If the tag is new and doesn't exist in the tags array, add it to the array
      const newTag: VoterTagsType = {
        key: nextId(),
        field: {
          key: field.field.key,
        },
        value: true,
      };

      setTags(tags.concat(newTag));
    }
  };

  // const update = {
  //   field: 'field',
  //   data: tags,
  // } as PersonUpdate<VoterTagsType>;
  // onTagChange && onTagChange(update);

  console.log(tags, 'tags');

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
                handlePayload(f);
              }}
            />
          </EuiFlexItem>
        );
      })}
    </EuiFlexGrid>
  );
};

export default CanvassingTags;
