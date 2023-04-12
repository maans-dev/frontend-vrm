import { FunctionComponent, useContext, useEffect, useState } from 'react';
import VoterTags from './voter-tags';
import { Field, FieldMetaData } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import { FieldsUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingTagCodes } from '@lib/domain/tags';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';

export type Props = {
  fields: Field[];
  onChange: (update: PersonUpdate<FieldsUpdate>) => void;
};

const Tags: FunctionComponent<Props> = ({ fields, onChange }) => {
  const [selectedFields, setSelectedFields] = useState<Partial<Field>[]>(
    fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
  );
  const [searchValue, setSearchValue] = useState('');

  const { data } = useTagFetcher(searchValue);
  const [searchFields, setSearchFields] = useState<Partial<Field>[]>(null);
  const { nextId } = useContext(CanvassingContext);

  useEffect(() => {
    const f = data
      ?.filter(f => !CanvassingTagCodes.includes(f.code))
      .map(f => ({
        field: f as Partial<FieldMetaData>,
        value: false,
      }));
    setSearchFields(f);
  }, [data]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleChange = (updatedField: Partial<Field>) => {
    const originalField = fields.find(
      f => f.field.key === updatedField.field.key
    );

    if (!('key' in updatedField))
      updatedField.key = originalField ? originalField.key : nextId();

    if (updatedField.value === false) {
      // remove
      setSelectedFields(selectedFields.filter(f => f.key !== updatedField.key));
    } else {
      // add
      setSelectedFields(prev => [...prev, updatedField]);
    }

    console.log('ORIGINAL', originalField, updatedField);

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

  // const [voterFields, setVoterFields] = useState<Field[]>([]);

  useCanvassFormReset(() => {
    setSelectedFields(
      fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  });

  useEffect(() => {
    setSelectedFields(
      fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  }, [fields]);

  // useEffect(() => {
  //   const filteredVoterFields = fields.filter(
  //     f => !shortCodes.includes(f.field.code)
  //   );
  //   setVoterFields(filteredVoterFields);

  return (
    <VoterTags
      fields={selectedFields}
      onChange={handleChange}
      searchFields={searchFields}
      handleSearchChange={handleSearchChange}
    />
  );
};

export default Tags;
