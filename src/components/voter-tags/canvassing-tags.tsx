import React from 'react';
import { EuiComboBox, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { PartyTags } from './types';
import Tag from './tag';
import { Field } from '@lib/domain/person';
import { shortCodes } from '@components/canvassing-tags';

export interface Props {
  options?: PartyTags[];
  // existingTags?: ITag[];
  // newTags?: ITag[];
  fields: Field[];
  isLoading?: boolean;
  onSearch?: (searchValue: string, hasMatchingOptions?: boolean) => void;
  onSelect?: (tag: Field) => void;
  onRemoveTag: (label: string) => void;
}

const VoterTags: React.FC<Props> = ({
  onSearch,
  onSelect,
  onRemoveTag,
  options,
  fields,
  isLoading,
}: Props) => {
  const tagBadges = [...fields].map((field, i) =>
    shortCodes.includes(field.field.code) ? null : (
      <EuiFlexItem key={i}>
        <Tag
          label={field.field.description}
          // isNew={tag.isDirty}
          onDelete={onRemoveTag}
        />
      </EuiFlexItem>
    )
  );
  // options={options.map(field => ({ label: field.description }))}
  // console.log(options, 'options')

  return (
    <>
      <EuiComboBox
        compressed
        placeholder="Search for a tag"
        singleSelection={{ asPlainText: true }}
        // options={options}
        isLoading={isLoading}
        // selectedOptions={selectedOption}
        // onChange={options => onSelect(options[0])}
        onSearchChange={onSearch}
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
        {tagBadges}
      </EuiFlexGroup>
    </>
  );
};

export default VoterTags;
