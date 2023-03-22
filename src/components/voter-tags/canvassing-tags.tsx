import React, { useEffect, useState } from 'react';
import {
  EuiCallOut,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { PartyTags } from '@lib/domain/person';
import Tag from './tag';
import { Field } from '@lib/domain/person';
import { shortCodes } from '@components/canvassing-tags';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';

export interface Props {
  fields: Field[];
  onTagChange: (data: PersonUpdate<VoterTagsUpdate>) => void;
  onSelect?: (tag: PartyTags) => void;
  onRemoveTag?: (label: string) => void;
}

type VoterTagsOption = EuiComboBoxOptionOption<PartyTags>;

const VoterTags: React.FC<Props> = ({
  onSelect,
  onRemoveTag,
  onTagChange,
  fields,
}: Props) => {
  const { data, error, isLoading } = useTagFetcher();
  const [partyTags, setPartyTags] = useState<PartyTags[]>();

  const [tags, setTags] = useState<VoterTagsOption[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<PartyTags[]>([]);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [removedFields, setRemovedFields] = useState<Field[]>([]);

  useEffect(() => {
    if (data && fields.length > 0) {
      const filteredPartyTags = data.filter(tag =>
        [...fields, ...removedFields].every(
          field => field.field.code !== tag.code
        )
      );
      setPartyTags(filteredPartyTags);
    }
  }, [data, fields, removedFields]);

  useEffect(() => {
    const voterTags = partyTags?.map(tag => ({
      label: tag.description,
      value: tag,
    }));
    setTags(voterTags);
  }, [partyTags]);

  console.log(tags, 'tags');

  useEffect(() => {
    setSelectedFields(fields);
  }, [fields]);

  const handleOnChange = selectedOptions => {
    const selectedField = selectedOptions[0]?.value;
    if (selectedField) {
      const selectedTag = {
        ...selectedField,
        description: selectedField.description,
        isNew: true,
      };
      if (
        !selectedTags.some(tag => tag.description === selectedTag.description)
      ) {
        onSelect?.(selectedTag);
        setSelectedTags(prevSelectedTags => [selectedTag, ...prevSelectedTags]);
        // let updateData;
        // onTagChange({
        //   field: 'voter-tags',
        //   data: updateData,
        // });
      }
    }
  };

  const tagBadges = [
    ...selectedTags.map((tag, i) => (
      <EuiFlexItem key={i}>
        <Tag
          label={tag.description}
          onDelete={() => handleOnRemoveTag(tag)}
          isNew={tag.isNew}
        />
      </EuiFlexItem>
    )),
    ...selectedFields.map((field, i) => (
      <EuiFlexItem key={selectedTags.length + i}>
        <Tag
          label={field.field.description}
          onDelete={() => handleOnRemoveTag(field)}
        />
      </EuiFlexItem>
    )),
  ];

  const handleOnRemoveTag = selectedTagOrField => {
    onRemoveTag?.(selectedTagOrField.description);

    if ('code' in selectedTagOrField) {
      // Remove the tag from selectedTags
      const updatedTags = selectedTags.filter(
        tag => tag.description !== selectedTagOrField.description
      );
      setSelectedTags(updatedTags);
    } else {
      // Remove the field from selectedFields
      const updatedFields = selectedFields.filter(
        field =>
          (field.field.code ?? field.field.description) !==
          (selectedTagOrField.field.code ??
            selectedTagOrField.field.description)
      );
      setRemovedFields(prevRemovedFields => [
        selectedTagOrField,
        ...prevRemovedFields,
      ]);
      setSelectedFields(updatedFields);

      // Add the removed field to selectedTags
      const removedCode = selectedTagOrField.field.code;
      if (removedCode) {
        const tag = partyTags.find(tag => tag.code === removedCode);
        if (tag && !selectedTags.some(t => t.code === tag.code)) {
          const selectedTag = {
            ...tag,
            description: tag.description,
            isNew: false,
          };
          setSelectedTags(prevSelectedTags => [
            selectedTag,
            ...prevSelectedTags,
          ]);
        }
      }
    }
  };

  return (
    <>
      {isLoading && <Spinner show={isLoading} />}
      {error && (
        <EuiCallOut
          title="Error"
          color="danger"
          iconType="alert"
          size="s"
          style={{ marginBottom: '1rem' }}>
          Error fetching tags. Please try again later.
        </EuiCallOut>
      )}
      <EuiComboBox
        compressed
        aria-label="Search for a tag"
        placeholder="Search for a tag"
        singleSelection={{ asPlainText: true }}
        options={searchValue ? tags : []}
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
