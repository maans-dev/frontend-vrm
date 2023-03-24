import React, { useContext, useEffect, useState } from 'react';
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
import { CanvassingContext } from '@lib/context/canvassing.context';

export type IPartyTags = {
  key: string | number;
  description?: string;
  isNew?: boolean;
  existingTag?: string | number;
};

export interface Props {
  fields: Field[];
  onTagChange: (data: PersonUpdate<VoterTagsUpdate>) => void;
  onSelect?: (tag: PartyTags) => void;
  onRemoveTag?: (label: string) => void;
}

type VoterTagsOption = EuiComboBoxOptionOption<IPartyTags>;

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
  const { nextId } = useContext(CanvassingContext);

  useEffect(() => {
    setPartyTags(data);
    if (fields) {
      const mappedData = map(fields);
      setSelectedFields(mappedData);
    }
  }, [fields, data]);

  const map = (fields: Field[]): Partial<VoterTagsType[]> => {
    const fieldsOptions = fields.map(field => ({
      key: field.key,
      field: {
        key: field.field.key,
        description: field.field.description,
      },
      value: field.value,
    }));

    return [...fieldsOptions];
  };

  const [deleted, isDeleted] = useState([]);

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

  useEffect(() => {
    const currentTags = partyTags
      ?.filter(
        tag =>
          !fields.some(field => field.field.description === tag.description)
      )
      .map(tag => ({
        label: tag.description,
        value: tag,
      }));
    setTags(currentTags);
  }, [partyTags, fields]);

  const handleOnChange = selectedOptions => {
    const newFields = selectedOptions
      .map(option => {
        const selectedField = option.value;
        if (selectedField.existingTag) {
          const existingTag = {
            key: selectedField.existingTag,
            field: {
              key: selectedField.key,
              description: selectedField.description,
              isNew: false,
            },
            value: true,
          };
          setTags(prevTags =>
            prevTags.filter(
              tag => tag.value.description !== existingTag.field.description
            )
          );
          return existingTag;
        } else if (selectedField) {
          const isTagSelected = selectedFields?.some(
            tag => tag.field?.description === selectedField.description
          );
          if (isTagSelected) {
            return null;
          }
          const newTag = {
            key: nextId(),
            field: {
              key: selectedField.key,
              description: selectedField.description,
              isNew: true,
            },
            value: true,
          };
          const existingTags = selectedFields.filter(
            tag => typeof tag.key === 'number' && tag.field !== undefined
          );
          const update = {
            field: 'field',
            data: [...existingTags, newTag],
          } as PersonUpdate<VoterTagsType>;
          onTagChange(update);
          isDeleted(selectedFields);
          return newTag;
        }
      })
      .filter(Boolean);

    setSelectedFields(state => [...newFields, ...state]);
  };

  const handleOnRemoveTag = selected => {
    const tagDescription = selected.field.description;
    const deleted = selected;

    setSelectedFields(prevSelectedFields => {
      const updatedFields = prevSelectedFields.map(tag => {
        if (tag.field && tag.field.description === tagDescription) {
          if (typeof tag.key === 'string') {
            setTags(prevTags => [
              ...prevTags,
              {
                label: deleted.field.description,
                value: {
                  key: deleted.field.key,
                  description: deleted.field.description,
                  existingTag: tag.key,
                  value: false,
                },
              },
            ]);
            const newTag = {
              key: tag.key,
              value: false,
            };
            const update = {
              field: 'field',
              data: newTag,
            } as PersonUpdate<VoterTagsType>;
            onTagChange(update);
            tag.value = false;
          }
          if (typeof tag.key === 'number') {
            const update = {
              field: 'field',
              data: undefined,
            } as PersonUpdate<VoterTagsType>;
            onTagChange(update);
            tag.value = false;
          }
        }
        return tag;
      });
      return updatedFields;
    });
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
