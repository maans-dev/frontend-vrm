import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EuiComboBox, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
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
}

const VoterTags: FunctionComponent<Props> = ({
  onChange,
  fields,
  searchFields,
  handleSearchChange,
  searchValue,
}: Props) => {
  const [originalFields, setOriginalFields] = useState(
    fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
  );
  const [fieldsInternal, setFieldsInternal] = useState(
    fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
  );
  const { nextId } = useContext(CanvassingContext);

  // TODO: Memoize the callback function used in the useEffect hook by using useCallback. This can improve the performance of the component by avoiding unnecessary re-renders when the fields array is updated.
  // TODO: Review if there is a better solution to handle the state update in useEffect after the fields have been set.
  useEffect(() => {
    setFieldsInternal(
      fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
    setOriginalFields(
      fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  }, [fields]);

  useCanvassFormReset(() => {
    setFieldsInternal(
      fields.filter(f => !CanvassingTagCodes.includes(f.field.code))
    );
  });

  const renderedBadges = [...fieldsInternal]
    .reverse()
    .filter(field => field.value === true)
    .map((field, i) => (
      <EuiFlexItem key={field.key}>
        <Tag
          label={field.field.description}
          onDelete={() => handleChange({ ...field, value: false })}
          isNew={!originalFields.some(f => f.field.key === field.field.key)}
        />
      </EuiFlexItem>
    ));

  const filteredOptions = searchFields
    ?.filter(
      field =>
        !fieldsInternal.some(refField => refField.field.key === field.field.key)
    )
    ?.map(f => ({
      label: `${f.field.description} (${f.field.code})`,
      value: f,
    }));

  const handleChange = (updatedField: Partial<Field>) => {
    const originalField = fields.find(
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

  return (
    <>
      <EuiComboBox
        compressed
        aria-label="Search for a tag"
        placeholder="Search for a tag"
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
