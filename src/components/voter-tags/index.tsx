import { FunctionComponent, useEffect, useState } from 'react';
import VoterTags from './voter-tags';
import { Field, FieldMetaData } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import { FieldsUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingTagCodes } from '@lib/domain/tags';
import { debounce } from 'lodash';
import { EuiCallOut } from '@elastic/eui';

export type Props = {
  fields: Field[];
  onChange: (update: PersonUpdate<FieldsUpdate>) => void;
};

const Tags: FunctionComponent<Props> = ({ fields, onChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading, error } = useTagFetcher(searchValue);
  const [searchFields, setSearchFields] = useState<Partial<Field>[]>(null);

  useEffect(() => {
    const f = data
      ?.filter(f => !CanvassingTagCodes.includes(f.code))
      .map(f => ({
        field: f as Partial<FieldMetaData>,
        value: false,
      }));
    setSearchFields(f);
  }, [data]);

  if (error) {
    let errorMessage = 'An error occurred while fetching the data.';
    if (error.response) {
      errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'Network error: Could not connect to the server.';
    }
    return (
      <EuiCallOut title="Error" color="danger" iconType="alert">
        <p>{errorMessage}</p>
        <p>
          Please try again later or contact support if the problem persists.
        </p>
      </EuiCallOut>
    );
  }

  const debouncedHandleSearchChange = debounce((value: string) => {
    setSearchValue(value);
  }, 300);
  const handleSearchChange = (value: string) => {
    debouncedHandleSearchChange(value);
  };

  const handleChange = (updatedField: Partial<Field>) => {
    const originalField = fields.find(
      f => f.field.key === updatedField.field.key
    );

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

  return (
    <VoterTags
      tagFetcherror={error}
      isLoading={isLoading}
      fields={fields}
      onChange={handleChange}
      searchFields={searchFields}
      handleSearchChange={handleSearchChange}
      searchValue={searchValue}
    />
  );
};

export default Tags;
