import React, { useState } from 'react';
import { EuiComboBox, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import Tag from './tag';
import { Field } from '@lib/domain/person';

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
}

const VoterTags: React.FC<Props> = ({
  onChange,
  fields,
  searchFields,
  handleSearchChange,
}: Props) => {
  const [originalFields] = useState(fields);

  //Set Rendered Badges
  const renderedBadges = [...fields]
    .reverse()
    .filter(field => field.value === true)
    .map((field, i) => (
      <EuiFlexItem key={i}>
        <Tag
          label={field.field.description}
          onDelete={() => onChange({ ...field, value: false })}
          isNew={originalFields?.find(f => f.key === field.key) === undefined}
        />
      </EuiFlexItem>
    ));

  return (
    <>
      <EuiComboBox
        compressed
        aria-label="Search for a tag"
        placeholder="Search for a tag"
        singleSelection={{ asPlainText: true }}
        options={searchFields?.map(f => ({
          label: f.field.description,
          value: f,
        }))}
        onChange={options => {
          onChange({ ...options[0].value, value: true });
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
