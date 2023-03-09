import React from 'react';
import { EuiComboBox, EuiFlexGroup } from '@elastic/eui';
import { ITag } from './types';
import Tag from './tag';

export interface Props {
  options?: ITag[];
  // existingTags?: ITag[];
  // newTags?: ITag[];
  tags: ITag[];
  isLoading?: boolean;
  onSearch: (searchValue: string, hasMatchingOptions?: boolean) => void;
  onSelect: (tag: ITag) => void;
  onRemoveTag: (label: string) => void;
}

const VoterTags: React.FC<Props> = ({
  onSearch,
  onSelect,
  onRemoveTag,
  options,
  tags,
  isLoading,
}: Props) => {
  const tagBadges = [...tags].map((tag, i) => (
    <Tag key={i} label={tag.label} isNew={tag.isDirty} onDelete={onRemoveTag} />
  ));

  return (
    <>
      <EuiComboBox
        compressed
        placeholder="Search for a tag"
        singleSelection={{ asPlainText: true }}
        options={options}
        isLoading={isLoading}
        // selectedOptions={selectedOption}
        onChange={options => onSelect(options[0])}
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
        style={{ maxHeight: '250px', overflow: 'auto' }}>
        {tagBadges}
      </EuiFlexGroup>
    </>
  );
};

export default VoterTags;
