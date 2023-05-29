import { FunctionComponent, useEffect, useState } from 'react';
import useStructureFetcher from '@lib/fetcher/structures/structures';
import SearchMap from './search-map';
import { debounce } from 'lodash';
import { Structure } from '@lib/domain/person';

export type Props = {
  onSelect?: (
    label: string,
    data: Partial<Structure>,
    value: Structure
  ) => void;
};

const Structres: FunctionComponent<Props> = ({ onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const { structures, isLoading } = useStructureFetcher(searchValue);
  const [structuresInternal, setStructuresInternal] =
    useState<Partial<Structure[]>>(null);

  const debouncedHandleSearchChange = debounce((value: string) => {
    setSearchValue(value);
  }, 300);
  const handleSearchChange = (value: string) => {
    debouncedHandleSearchChange(value);
  };

  useEffect(() => {
    const filteredStructures = structures?.filter(
      structure =>
        structure?.type?.toLowerCase() === 'votingdistrict' ||
        structure.type?.toLowerCase() === 'ward'
    );
    setStructuresInternal(filteredStructures);
  }, [structures]);

  return (
    <SearchMap
      isLoading={isLoading}
      handleSearchChange={handleSearchChange}
      structures={structuresInternal}
      onSelect={onSelect}
    />
  );
};

export default Structres;
