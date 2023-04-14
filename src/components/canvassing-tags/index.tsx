import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { EuiFlexGrid, EuiFlexItem, useIsWithinBreakpoints } from '@elastic/eui';
import CanvassingTag from './canvassing-tag';
import { Field, FieldMetaData } from '@lib/domain/person';
import { FieldsUpdate, PersonUpdate } from '@lib/domain/person-update';
import useCanvassingTagFetcher from '@lib/fetcher/tags/canvassing-tags';
import { CanvassingTagCodes } from '@lib/domain/tags';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  fields: Field[];
  onChange: (data: PersonUpdate<FieldsUpdate>) => void;
};

const CanvassingTags: FunctionComponent<Props> = ({ fields, onChange }) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [internalFields, setInternalFields] = useState<Field[]>(
    fields.filter(f => CanvassingTagCodes.includes(f.field.code))
  );
  const { data } = useCanvassingTagFetcher();
  const [presetFields, setPresetFields] = useState<Partial<Field>[]>(null);
  const { nextId } = useContext(CanvassingContext);
  const getField = (field: Partial<Field>) => {
    const found = internalFields.find(f => {
      return f.field.code === field.field.code;
    });

    if (!found && !('key' in field)) field.key = nextId();

    return found || field;
  };

  const handleChange = (updatedField: Partial<Field>) => {
    const originalField = presetFields
      ?.map(f => getField(f))
      ?.find(f => f.key === updatedField.key);

    if (
      (originalField && originalField.value === updatedField.value) || // is an existing field and it's value matched the updated value
      (!originalField && !updatedField.value) // is a new field that has been removed
    ) {
      // remove from update payload
      updatedField = { key: updatedField.key } as Partial<Field>;
    } else {
      if (updatedField.value === false) {
        // field has been removed
        updatedField = {
          key: updatedField.key,
          deleted: true,
        } as Partial<Field>;
      } else {
        // new field has been added
        updatedField = {
          key: updatedField.key,
          value: updatedField.value,
          field: { key: updatedField.field.key },
        } as Partial<Field>;
      }
    }
    onChange({
      field: 'fields',
      data: { ...updatedField },
    });
  };

  useEffect(() => {
    const f = data?.map(f => ({
      field: f as Partial<FieldMetaData>,
      value: false,
    }));
    setPresetFields(f);
  }, [data]);

  useEffect(() => {
    setInternalFields(
      fields.filter(f => CanvassingTagCodes.includes(f.field.code))
    );
  }, [data, fields]);

  return (
    <EuiFlexGrid
      columns={isMobile ? 1 : 3}
      direction="row"
      gutterSize="s"
      responsive={true}>
      {presetFields?.map((f, i) => {
        return (
          <EuiFlexItem key={i} grow={false} style={{ minWidth: 100 }}>
            <CanvassingTag field={getField(f)} onChange={handleChange} />
          </EuiFlexItem>
        );
      })}
    </EuiFlexGrid>
  );
};

export default CanvassingTags;
