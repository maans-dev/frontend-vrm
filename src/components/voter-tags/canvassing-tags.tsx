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

  //State for New Tags being added
  const [newTag, setNewTag] = useState([]);

  //Rendered Array
  const [renderedArray, setRenderedArray] = useState<VoterTagsType[]>([]);

  //Search value
  const [searchValue, setSearchValue] = useState('');

  //Canvassing context
  const { nextId } = useContext(CanvassingContext);

  //Set combo box
  const [tags, setTags] = useState<VoterTagsOption[]>([]);
  useEffect(() => {
    const currentTags = partyTags?.map(tag => ({
      label: tag.description,
      value: tag,
    }));
    setTags(currentTags || []);
  }, [partyTags]);

  //Set RenderedArray
  useEffect(() => {
    const mappedFields = fieldsRefrenceArray.current.map(field => ({
      key: field.key,
      person: field.person,
      field: {
        key: field.field.key,
        description: field.field.description,
      },
      value: field.value,
    }));
    setRenderedArray(mappedFields);
  }, [fieldsRefrenceArray]);

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
          // New field, add to new tag state
          const newT = {
            key: nextId(),
            field: {
              key: selectedField.key,
            },
            value: true,
          };
          setNewTag(state => [...state, newT]);

          // New field, add to rendered array
          const updatedFields = [
            ...renderedArray,
            {
              key: newT.key,
              field: {
                key: newT.field.key,
                description: selectedField.description,
                isNew: true,
              },
              value: newT.value,
            },
          ];
          setRenderedArray(updatedFields);

          // Update Payload
          const updatedTags = newTag.filter(field => field.value === true);
          const update = {
            field: 'field',
            data: updatedTags,
          } as PersonUpdate<VoterTagsType>;
          onTagChange(update);
        } else if (selectedField) {
          // Existing Field
          const updatedFields = renderedArray.map(field => {
            if (field.field.description === selectedField.description) {
              return {
                ...field,
                value: true,
              };
            }
            return field;
          });

          setRenderedArray(updatedFields);

          return null;
        }
      })
      .filter(Boolean);

    setRenderedArray(state => [...newFields, ...state]);
  };

  // console.log(newTag, 'newtag');

  const handleOnRemoveTag = selected => {
    const tagDescription = selected.field.description;
    const updatedFields = renderedArray
      .map(tag => {
        if (tag.field.description === tagDescription) {
          if (tag.field.isNew) {
            // New tag was removed, remove from rendered array and new tag state
            setNewTag(state => state.filter(t => t.key !== tag.key));
            //Update Payload
            const update = {
              field: 'field',
              data: newTag,
            } as PersonUpdate<VoterTagsType>;
            onTagChange(update);
            return null;
          } else {
            // Existing tag was removed, update rendered array and payload
            const existingTag = {
              key: tag.key,
              field: {
                key: tag.field.key,
                description: tagDescription,
                isNew: false,
              },
              value: false,
            };
            //Update
            const updatePayload = {
              key: tag.key,
              value: false,
            };
            const update = {
              field: 'field',
              data: updatePayload,
            } as PersonUpdate<VoterTagsType>;
            onTagChange(update);
            return existingTag;
          }
        }
        return tag;
      })
      .filter(Boolean);

    setRenderedArray(updatedFields);
  };

  return (
    <>
      <EuiComboBox
        compressed
        async
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
