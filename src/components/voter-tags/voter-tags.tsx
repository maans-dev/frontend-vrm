import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormErrorText,
  EuiSpacer,
} from '@elastic/eui';
import Tag from './tag';
import { Field } from '@lib/domain/person';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { CanvassingTagCodes } from '@lib/domain/tags';

export type IPartyTags = {
  key: string | number;
  person?: number;
  description?: string;
  isNew?: boolean;
  existingTag?: string | number;
};

export interface Props {
  fields: Partial<Field>[];
  onChange?: (f: Partial<Field>) => void;
  searchFields: Partial<Field>[];
  handleSearchChange: (searchTerm: string) => void;
  searchValue: string;
  isLoading?: boolean;
  tagFetcherror: Error;
}

const VoterTags: FunctionComponent<Props> = ({
  onChange,
  isLoading,
  fields,
  searchFields,
  handleSearchChange,
  searchValue,
  tagFetcherror,
}: Props) => {
  const [originalFields, setOriginalFields] = useState(
    fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
  );
  const [fieldsInternal, setFieldsInternal] = useState(
    fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
  );
  const { nextId } = useContext(CanvassingContext);

  const handleFieldsUpdate = useCallback(() => {
    setFieldsInternal(
      fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
    setOriginalFields(
      fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  }, [fields]);

  useEffect(() => {
    handleFieldsUpdate();
  }, [handleFieldsUpdate]);

  useCanvassFormReset(() => {
    setFieldsInternal(
      fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  });

  const renderedBadges = fieldsInternal
    ? [...fieldsInternal]
        .reverse()
        .filter(field => field.value === true)
        .map(field => (
          <EuiFlexItem key={field.key}>
            <Tag
              label={field.field.description}
              onDelete={() => handleChange({ ...field, value: false })}
              isNew={!originalFields.some(f => f.field.key === field.field.key)}
            />
          </EuiFlexItem>
        ))
    : null;

  const filteredOptions = searchFields
    ?.filter(
      field =>
        !fieldsInternal?.some(
          refField => refField.field.key === field.field.key
        )
    )
    ?.map(f => ({
      label: `${f.field.description} (${f.field.code})`,
      value: f,
    }));

  const handleChange = (updatedField: Partial<Field>) => {
    const originalField = fields?.find(
      f => f.field.key === updatedField.field.key
    );

    if (!('key' in updatedField))
      updatedField.key = originalField ? originalField.key : nextId();

    if (updatedField.value === false) {
      // remove
      setFieldsInternal(fieldsInternal.filter(f => f.key !== updatedField.key));
    } else {
      // add
      setFieldsInternal(prev => [...prev, updatedField]);
    }
    onChange(updatedField);
  };

  useCanvassFormReset(() => {
    setFieldsInternal(
      fields?.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  });

  return (
    <>
      {tagFetcherror && (
        <>
          <EuiFormErrorText style={{ marginLeft: '5px' }}>
            An error occurred while fetching the tags. Please try again later.
          </EuiFormErrorText>
          <EuiSpacer size="s" />
        </>
      )}

      <EuiComboBox
        // compressed
        async
        isLoading={searchValue && isLoading}
        noSuggestions={!searchValue}
        aria-label="Start typing to search for a tag"
        placeholder="Start typing to search for a tag"
        singleSelection={{ asPlainText: true }}
        options={searchValue ? filteredOptions : []}
        onChange={options => {
          handleChange({ ...options[0].value, value: true });
        }}
        onSearchChange={handleSearchChange}
        fullWidth
        isClearable={false}
        css={{
          '.euiComboBoxPill--plainText': {
            display: 'none',
          },
          marginBottom: '5px',
        }}
      />
      <EuiFlexGroup
        gutterSize="xs"
        direction="column"
        style={{ maxHeight: '250px', overflow: 'auto' }}>
        {renderedBadges}
      </EuiFlexGroup>
    </>
  );
};

export default VoterTags;
