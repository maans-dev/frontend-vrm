import { FunctionComponent, useEffect, useState } from 'react';
import { ITag } from './types';
import VoterTags from './canvassing-tags';
import { faker } from '@faker-js/faker';
import { Field } from '@lib/domain/person';

export type Props = {
  fields: Field[];
};

const allOptionsStatic: Field[] = [];

const Tags: FunctionComponent<Props> = ({ fields }) => {
  const [allOptions] = useState(allOptionsStatic);
  const [tags, setTags] = useState<Field[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  console.log(tags, 'fields');
  let searchTimeout;

  // const onSearch = searchValue => {
  //   console.log('OnSearch');
  //   setOptions([]);

  //   if (searchValue === '') return;

  //   setLoading(true);

  //   clearTimeout(searchTimeout);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   searchTimeout = setTimeout(() => {
  //     setLoading(false);
  //     setOptions(
  //       allOptions.filter(
  //         option =>
  //           option.field.description
  //             .toLowerCase()
  //             .includes(searchValue.toLowerCase()) && !tags.includes(option)
  //       )
  //     );
  //   }, 100);
  // };

  // const onSelect = (tag: Field) => {
  //   // tag.isDirty = true;
  //   setTags([tag, ...tags]);
  //   setOptions([]);
  // };

  const onRemove = (label: string) => {
    setTags(tags.filter(tag => tag.field.description !== label));
  };
  console.log(onRemove, 'dd');

  useEffect(() => {
    setTags([...fields]);
  }, [fields]);

  // useEffect(() => {
  //   for (let i = 0; i < 100; i++) {
  //     allOptionsStatic.push({''});
  //   }
  //   allOptionsStatic.push(...fields);
  // }, [fields]);

  return (
    <VoterTags
      // options={options}
      fields={fields}
      // onSearch={onSearch}
      // onSelect={onSelect}
      onRemoveTag={onRemove}
      isLoading={isLoading}
    />
  );
};

export default Tags;
