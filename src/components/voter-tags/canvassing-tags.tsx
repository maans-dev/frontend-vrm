import React, { useState } from 'react';
import {
  EuiBadge,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { TagInputsProps } from './types';

export interface Props {
  items: TagInputsProps[];
  onAddTag?: (tag: string) => void;
}

const VoterTags: React.FC<Props> = ({ onAddTag }: Props) => {
  const [selectedOption, setSelectedOptions] = useState<
    EuiComboBoxOptionOption[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<{ label: string }[]>([]);

  const handleAddTag = (newTag: { label: string }) => {
    if (newTag.label.length < 15) {
      return;
    }
    setSelectedTags([...selectedTags, newTag]);
    onAddTag(newTag.label);
  };

  const handleDeleteTag = (index: number) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  const onInputChange = (
    searchValue: string,
    event?: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event && event.key === 'Enter' && searchValue.trim() !== '') {
      const newTagLabel = searchValue.trim();
      const newTag = { label: newTagLabel };
      handleAddTag(newTag);
    }
  };

  const onChange = (
    selectedOptions: EuiComboBoxOptionOption<string | number | string[]>[]
  ) => {
    const selectedOptionLabels = selectedOptions.map(option => option.label);

    // add selected options from the options list to selected tags array
    const selectedOptionsFromList = options.filter(option =>
      selectedOptionLabels.includes(option.label)
    );
    setSelectedTags([...selectedTags, ...selectedOptionsFromList]);

    // set the selected options state
    setSelectedOptions(selectedOptions);
  };

  const tagBadges = selectedTags.map((tag, i) => (
    <EuiFlexItem grow={false} key={i}>
      <EuiBadge
        css={{ marginTop: '10px' }}
        color="hollow"
        iconType="cross"
        iconSide="right"
        iconOnClick={() => handleDeleteTag(i)}
        iconOnClickAriaLabel={`Delete tag "${tag.label}"`}>
        {tag.label}
      </EuiBadge>
    </EuiFlexItem>
  ));

  const onCreateOption = (searchValue: string): boolean => {
    if (searchValue.length < 30) {
      const newOption = { label: searchValue };
      setSelectedTags([...selectedTags, newOption]);
      return true;
    } else {
      return false;
    }
  };

  const options = [
    {
      label: 'Consectetur, adipisicing elit. Unde quas',
    },
    {
      label: 'Dolor sit amet consectetur, adipisicing elit. Unde quas,',
    },
    {
      label: 'Adipisicing elit. Unde quas,',
    },
    {
      label: 'Lorem ipsum dolor sit amet consectetur',
    },
    {
      label:
        'Lorem ipsum dolor sit amet consectetur Consectetur, adipisicing elit. Unde quas',
    },
  ];

  return (
    <>
      <EuiComboBox
        placeholder="Enter a tag here"
        singleSelection={{ asPlainText: true }}
        // noSuggestions
        options={options}
        selectedOptions={selectedOption}
        onCreateOption={onCreateOption}
        onChange={onChange}
        onSearchChange={searchValue => onInputChange(searchValue)}
        fullWidth
      />
      <EuiFlexGroup wrap gutterSize="xs">
        {tagBadges}
      </EuiFlexGroup>
    </>
  );
};

export default VoterTags;
