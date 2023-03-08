import React, { useState } from 'react';
import {
  EuiBadge,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { TagInputsProps } from './types';
import { FaTimesCircle } from 'react-icons/fa';

export interface Props {
  items: TagInputsProps[];
  onAddTag?: (tag: string) => void;
}

const VoterTags: React.FC<Props> = ({ onAddTag, items }: Props) => {
  const [selectedOption, setSelectedOptions] = useState<
    EuiComboBoxOptionOption[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<{ label: string }[]>([]);

  const handleDeleteTag = (index: number) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  const handleAddTag = (newTag: { label: string }) => {
    if (newTag.label.length < 30) {
      return;
    }
    setSelectedTags([...selectedTags, newTag]);
    onAddTag(newTag.label);
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
    const selectedOptionsFromList = items.filter(item =>
      selectedOptionLabels.includes(item.label)
    );
    setSelectedTags([...selectedTags, ...selectedOptionsFromList]);
    setSelectedOptions(selectedOptions);
  };

  const tagBadges = [...selectedTags].reverse().map((tag, i) => (
    <EuiFlexItem key={i}>
      <EuiBadge
        css={{
          '.euiBadge__iconButton': {
            marginLeft: 'auto',
            color: '#1EA7FD',
            '&:hover': {
              color: 'red',
            },
            borderLeft: '2px solid #CBD2D9',
            paddingLeft: '6px',
          },
          '.euiBadge__iconButton:hover svg': {
            fill: 'red',
          },
          marginTop: '0.1px',
          border: 'none',
          backgroundColor: '#E3F3FF',
          fontSize: '0.9rem',
        }}
        color="hollow"
        iconType={FaTimesCircle}
        iconSide="right"
        iconOnClick={() => handleDeleteTag(selectedTags.length - i - 1)}
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

  const options = items.map(item => ({ label: item.label }));

  return (
    <>
      <EuiComboBox
        placeholder="Enter a tag here"
        singleSelection={{ asPlainText: true }}
        options={options}
        selectedOptions={selectedOption}
        onCreateOption={onCreateOption}
        onChange={onChange}
        onSearchChange={searchValue => onInputChange(searchValue)}
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
        direction="column"
        gutterSize="xs"
        style={{ maxHeight: '250px', overflow: 'auto' }}>
        {tagBadges}
      </EuiFlexGroup>
    </>
  );
};

export default VoterTags;
