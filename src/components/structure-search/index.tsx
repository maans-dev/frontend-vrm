import { FunctionComponent, useEffect, useState } from 'react';
import useStructureFetcher from '@lib/fetcher/structures/structures';
import SearchMap from './search-map';
import { debounce } from 'lodash';
import { Structure } from '@lib/domain/stuctures';

export type Props = {
  onSelect?: (
    label: string,
    data: {
      description: string;
      ward: string;
      votingDistrict_id: string;
    },
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
        structure.type === 'votingdistrict' || structure.type === 'ward'
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
