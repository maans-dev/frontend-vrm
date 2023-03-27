import React, { useContext, useEffect, useState } from 'react';
import {
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { PartyTags } from '@lib/domain/person';
import Tag from './tag';
import { Field } from '@lib/domain/person';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { VoterTagsType } from '@lib/domain/voter-tags';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useRef } from 'react';

export type IPartyTags = {
  key: string | number;
  person?: number;
  description?: string;
  isNew?: boolean;
  existingTag?: string | number;
};

export interface Props {
  fields: Field[];
  onTagChange: (data: PersonUpdate<VoterTagsUpdate>) => void;
  partyTags: PartyTags[];
}

type VoterTagsOption = EuiComboBoxOptionOption<IPartyTags>;

const VoterTags: React.FC<Props> = ({
  onTagChange,
  fields,
  partyTags,
}: Props) => {
  //Refrence Array
  const fieldsRefrenceArray = useRef(fields);

  //Rendered Array
  const [renderedArray, setRenderedArray] = useState<VoterTagsType[]>(
    fieldsRefrenceArray.current.map(field => ({
      key: field.key,
      person: field.person,
      field: {
        key: field.field.key,
        description: field.field.description,
      },
      value: field.value,
    }))
  );

  const [tags, setTags] = useState<VoterTagsOption[]>([]);

  useEffect(() => {
    const newTags =
      partyTags
        ?.filter(
          tag =>
            !renderedArray.some(
              field => field.field.description === tag.description
            )
        )
        .map(tag => ({
          label: tag.description,
          value: tag,
        })) || [];

    setTags(newTags);
  }, [renderedArray, partyTags]);

  //Search value
  const [searchValue, setSearchValue] = useState('');

  //Canvassing context
  const { nextId } = useContext(CanvassingContext);

  //Set Rendered Badges
  const renderedBadges = [...renderedArray]
    .reverse()
    .filter(field => field.value === true)
    .map((field, i) => (
      <EuiFlexItem key={i}>
        <Tag
          label={field.field.description}
          onDelete={() => handleOnRemoveTag(field)}
          isNew={field.field?.isNew}
        />
      </EuiFlexItem>
    ));

  const handleOnChange = selectedOptions => {
    const newFields = selectedOptions
      .map(option => {
        const selectedField = option.value;
        //Check on Ref if an existing
        const existingField = fieldsRefrenceArray.current.find(
          field => field.field.description === selectedField.description
        );

        if (!existingField) {
          // New field, add to rendered array
          const newId = nextId();
          const newField = {
            key: newId,
            field: {
              key: selectedField.key,
              description: selectedField.description,
              isNew: true,
            },
            value: true,
          };
          const updatedFields = [...renderedArray, newField];
          setRenderedArray(updatedFields);

          // Update Payload
          const filteredFields = updatedFields.filter(field => {
            const existsInRef = fieldsRefrenceArray.current.some(
              refField => refField.field.description === field.field.description
            );
            return !existsInRef;
          });
          const updatedTags = filteredFields.map(field => ({
            key: field.key,
            field: { key: field.field.key },
            value: field.value,
          }));
          const update = {
            field: 'field',
            data: updatedTags,
          } as PersonUpdate<VoterTagsType>;
          onTagChange(update);
        } else if (selectedField) {
          // Check if the selectedField is already present in the fieldsReferenceArray
          const existingField = fieldsRefrenceArray.current.find(
            field => field.field.description === selectedField.description
          );
          if (existingField) {
            // Existing Field
            const updatedFields = renderedArray.map(field => {
              if (field.field.key === existingField.field.key) {
                return {
                  key: existingField.key,
                  person: field.person,
                  field: {
                    key: existingField.field.key,
                    description: existingField.field.description,
                  },
                  value: true,
                };
              } else {
                return field;
              }
            });
            setRenderedArray(updatedFields);
            return null;
          }
        }
      })
      .filter(Boolean);

    setRenderedArray(state => [...newFields, ...state]);
  };

  const handleOnRemoveTag = selected => {
    const tagDescription = selected.field.description;
    const updatedFields = renderedArray
      .map(tag => {
        if (tag.field.description === tagDescription) {
          if (tag.field.isNew) {
            // New tag was removed, remove from rendered array
            const filteredNewTags = renderedArray.filter(
              t => t.field.description !== tagDescription && !t.person
            );
            // Update Payload
            const update = {
              field: 'field',
              data: filteredNewTags,
            } as PersonUpdate<VoterTagsType>;
            onTagChange(update);
            return null;
          } else {
            // Existing tag was removed, update rendered array and payload
            const existingTag = {
              key: tag.key,
              field: {
                key: tag.field.key,
                isNew: false,
              },
              value: false,
            };
            return existingTag;
          }
        }
        return tag;
      })
      .filter(Boolean);

    setRenderedArray(updatedFields);

    //Update Payload
    const updatedTags = updatedFields
      .filter(field => !field.value)
      .map(field => ({
        key: field.key,
        value: field.value,
      }));

    const update = {
      field: 'field',
      data: updatedTags,
    } as PersonUpdate<VoterTagsType>;
    onTagChange(update);
  };

  return (
    <>
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
        {renderedBadges}
      </EuiFlexGroup>
    </>
  );
};
export default VoterTags;
