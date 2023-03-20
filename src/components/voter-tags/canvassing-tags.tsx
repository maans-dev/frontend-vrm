import React, { useEffect, useState } from 'react';
import {
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { PartyTags } from '@lib/domain/person';
import Tag from './tag';
import { Field } from '@lib/domain/person';
import { shortCodes } from '@components/canvassing-tags';

export interface Props {
  data: PartyTags[];
  fields: Field[];
  onSelect?: (tag: PartyTags) => void;
  onRemoveTag?: (label: string) => void;
}

type VoterTagsOption = EuiComboBoxOptionOption<PartyTags>;

const VoterTags: React.FC<Props> = ({
  onSelect,
  onRemoveTag,
  data,
  fields,
}: Props) => {
  const [filteredOptions, setFilteredOptions] = useState<VoterTagsOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<PartyTags[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setFilteredOptions(
      data
        .filter(item => !shortCodes.includes(item.code))
        .map(item => ({ label: item.description, value: item }))
    );
  }, [data]);

  const handleOnChange = (selectedOptions: VoterTagsOption[]) => {
    if (selectedOptions.length > 0) {
      const selectedTag = selectedOptions[0].value;
      if (
        !selectedTags.some(tag => tag.description === selectedTag.description)
      ) {
        onSelect?.(selectedTag);
        setSelectedTags(prevSelectedTags => [
          { ...selectedTag, isNew: true },
          ...prevSelectedTags.filter(
            tag => tag.description !== selectedTag.description
          ),
        ]);
      }
    }
  };

  const handleOnRemoveTag = (label: string) => {
    onRemoveTag?.(label);
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.filter(tag => tag.description !== label)
    );
  };

  const tagBadges = [
    ...selectedTags.map((tag, i) => (
      <EuiFlexItem key={i}>
        <Tag
          label={tag.description}
          isNew={tag.isNew}
          onDelete={() => handleOnRemoveTag(tag.description)}
        />
      </EuiFlexItem>
    )),
    ...fields.map((field, i) =>
      shortCodes.includes(field.field.code) ? null : (
        <EuiFlexItem key={selectedTags.length + i}>
          <Tag
            label={field.field.description}
            onDelete={() => handleOnRemoveTag(field.field.description)}
          />
        </EuiFlexItem>
      )
    ),
  ];

  return (
    <>
      <EuiComboBox
        compressed
        aria-label="Search for a tag"
        placeholder="Search for a tag"
        singleSelection={{ asPlainText: true }}
        options={searchValue ? filteredOptions : []}
        onChange={handleOnChange}
        onSearchChange={value => setSearchValue(value)}
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
