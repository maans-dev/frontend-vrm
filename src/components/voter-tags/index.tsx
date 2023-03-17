import { FunctionComponent, useEffect, useState } from 'react';
import VoterTags from './canvassing-tags';
import { Field } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import { shortCodes } from '@components/canvassing-tags';
import { PartyTags, PartyTags2 } from './types';

export type Props = {
  fields: Field[];
};

const Tags: FunctionComponent<Props> = ({ fields }) => {
  const [tags, setTags] = useState<Field[]>(fields);
  const [partyTags, setPartyTags] = useState<PartyTags[]>([]);
  const { data, error, isLoading } = useTagFetcher();
  if (error) {
    console.log(error);
  }

  useEffect(() => {
    setTags(fields);
  }, [fields]);

  useEffect(() => {
    if (data) {
      setPartyTags(data);
    }
  }, [data]);

  // function getOptions(fields: Field[], partyTags: PartyTags) {
  //   const options = [];
  //   for (const tag of partyTags) {
  //     const { code, name } = tag;
  //     if (shortCodes.includes(code)) {
  //       continue;
  //     }
  //     const option = { value: code, label: name };
  //     const matchingField = fields.find(field => field.field.code === code);
  //     if (!matchingField) {
  //       options.push(option);
  //     }
  //   }
  //   return options;
  // }
  // console.log(getOptions(fields, partyTags), 'options');

  // console.log(partyTags, 'party');

  const onRemove = (label: string) => {
    setTags(tags.filter(tag => tag.field.description !== label));
  };

  const onSelect = (tag: Field) => {
    setTags([tag, ...tags]);
  };

  return (
    <VoterTags
      fields={fields}
      onRemoveTag={onRemove}
      // options={getOptions(fields, partyTags)}
      onSelect={onSelect}
      // onSearch={onSearch}
      isLoading={isLoading}
    />
  );
};

export default Tags;
