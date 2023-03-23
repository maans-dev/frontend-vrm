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
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';
import { VoterTagsType } from '@lib/domain/voter-tags';

export interface Props {
  fields: Field[];
  onTagChange: (data: PersonUpdate<VoterTagsUpdate>) => void;
  onSelect?: (tag: PartyTags) => void;
  onRemoveTag?: (label: string) => void;
}

type VoterTagsOption = EuiComboBoxOptionOption<VoterTagsType>;

const VoterTags: React.FC<Props> = ({
  onSelect,
  onRemoveTag,
  onTagChange,
  fields,
}: Props) => {
  const { data, error, isLoading } = useTagFetcher();
  const [partyTags, setPartyTags] = useState<PartyTags[]>();
  const [selectedFields, setSelectedFields] = useState<
    Partial<VoterTagsType[]>
  >([]);
  const [tags, setTags] = useState<VoterTagsOption[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const map = (
    fields: Field[],
    partyTags: PartyTags[]
  ): Partial<VoterTagsType[]> => {
    const fieldsOptions = fields.map(field => ({
      key: field.key,
      field: {
        key: field.field.key,
        description: field.field.description,
      },
      value: field.value,
    }));
    const partyTagsOptions = partyTags.map(tag => ({
      field: {
        key: tag.key,
        description: tag.description,
      },
      value: false,
    }));
    return [...fieldsOptions, ...partyTagsOptions];
  };

  useEffect(() => {
    setPartyTags(data);
  }, [data]);

  useEffect(() => {
    setPartyTags(data);
  }, [data]);

  useEffect(() => {
    if (partyTags && fields) {
      const mappedData = map(fields, partyTags);
      setSelectedFields(mappedData);
    }
  }, [fields, partyTags]);

  const tagBadges = selectedFields.map((field, i) => {
    if (field.value === true) {
      return (
        <EuiFlexItem key={i}>
          <Tag
            label={field.field.description}
            onDelete={() => handleOnRemoveTag(field)}
            isNew={field.field?.isNew}
          />
        </EuiFlexItem>
      );
    }
    return null;
  });

  const [deletedDescriptions, setDeletedDescriptions] = useState([]);

  useEffect(() => {
    const currentTags = selectedFields
      ?.filter(
        tag =>
          !fields.some(
            field => field.field.description === tag.field.description
          ) && !deletedDescriptions.includes(tag.field.description)
      )
      .map(tag => ({
        label: tag.field.description,
        value: tag,
      }));

    const deletedTags = deletedDescriptions
      .filter(d =>
        selectedFields.some(
          tag => tag.field.description === d.field.description
        )
      )
      .map(d => ({
        label: d.field.description,
        value: d.field,
      }));

    setTags([...currentTags, ...deletedTags]);
  }, [partyTags, selectedFields, fields, deletedDescriptions]);

  const handleOnChange = selectedOptions => {
    const selectedNew =
      selectedOptions[0]?.value !== selectedOptions[0]?.value.key;
    const selectedField = selectedOptions[0]?.value;
    const hasDeletedTags = deletedDescriptions.some(
      desc => desc.key !== undefined
    );
    console.log(hasDeletedTags, 'deleted');

    if (selectedOptions[0]?.value.key) {
      setSelectedFields(prevState => {
        const updatedFields = [...prevState];
        deletedDescriptions.forEach(deletedTag => {
          const existingFieldIndex = updatedFields.findIndex(
            field => field.field.description === deletedTag.field.description
          );

          if (existingFieldIndex >= 0) {
            // Update existing field
            updatedFields[existingFieldIndex] = {
              key: deletedTag.key,
              field: {
                key: deletedTag.field.key,
                description: deletedTag.field.description,
              },
              value: true,
            };
          } else {
            // Add new field
            updatedFields.push({
              key: deletedTag.key,
              field: {
                key: deletedTag.field.key,
                description: deletedTag.field.description,
              },
              value: true,
            });
          }
        });

        return updatedFields;
      });
    } else if (selectedNew) {
      const selectedTag = {
        ...selectedField,
        description: selectedField.field.description,
        isNew: true,
      };
      console.log(selectedTag, 'selected tag');

      // Check if the tag already exists in selectedFields
      const isTagAlreadySelected = selectedFields.some(
        tag => tag.field.description === selectedTag.description
      );
      console.log(isTagAlreadySelected);

      if (isTagAlreadySelected) {
        setSelectedFields(prevState => [
          {
            field: {
              key: selectedTag.field.key,
              description: selectedTag.field.description,
              isNew: true,
            },
            value: true,
          },
          ...prevState.filter(
            tag => tag.field.description !== selectedTag.description
          ),
        ]);
        onSelect?.(selectedTag);
      }
    }
  };

  const handleOnRemoveTag = selected => {
    const tagDescription = selected.field.description;
    const deleted = selected;
    if (selected.field.key) {
      setDeletedDescriptions(prevState => {
        // Check if the new object already exists in the array
        if (prevState.some(desc => desc.key === deleted.key)) {
          return prevState; // Return the existing array if object already exists
        } else {
          // Add the new object to the array if it doesn't exist
          return [...prevState, deleted];
        }
      });
      setSelectedFields(prevVeld =>
        prevVeld.map(tag => {
          if (tag.field.description === tagDescription) {
            return {
              field: tag.field,
              value: false,
            };
          }
          return tag;
        })
      );
    }
    if (selected.field.isNew === true) {
      setSelectedFields(prevVeld =>
        prevVeld.map(tag => {
          if (tag.field.description === tagDescription) {
            return {
              field: tag.field,
              value: false,
            };
          }
          return tag;
        })
      );
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
