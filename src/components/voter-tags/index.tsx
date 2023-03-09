import { FunctionComponent, useEffect, useState } from 'react';
import { ITag } from './types';
import VoterTags from './canvassing-tags';
import { faker } from '@faker-js/faker';

export type Props = {
  existingTags: ITag[];
};

const allOptionsStatic: ITag[] = [];

const Tags: FunctionComponent<Props> = ({ existingTags }) => {
  const [allOptions] = useState(allOptionsStatic);
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  let searchTimeout;

  const onSearch = searchValue => {
    console.log('OnSearch');
    setOptions([]);

    if (searchValue === '') return;

    setLoading(true);

    clearTimeout(searchTimeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    searchTimeout = setTimeout(() => {
      setLoading(false);
      setOptions(
        allOptions.filter(
          option =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()) &&
            !tags.includes(option)
        )
      );
    }, 100);
  };

  const onSelect = (tag: ITag) => {
    tag.isDirty = true;
    setTags([tag, ...tags]);
    setOptions([]);
  };

  const onRemove = (label: string) => {
    setTags(tags.filter(tag => tag.label !== label));
  };

  useEffect(() => {
    setTags([...existingTags]);
  }, [existingTags]);

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      allOptionsStatic.push({ label: faker.random.words(5) });
    }
    allOptionsStatic.push(...existingTags);
  }, [existingTags]);

  return (
    <VoterTags
      options={options}
      tags={tags}
      onSearch={onSearch}
      onSelect={onSelect}
      onRemoveTag={onRemove}
      isLoading={isLoading}
    />
  );
};

export default Tags;
