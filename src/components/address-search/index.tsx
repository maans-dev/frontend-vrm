import { FunctionComponent, useEffect, useState } from 'react';
import AddressMap from './address-map';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { Address } from '@lib/domain/person';

export type Props = {
  onAddressChange: (selectedAddress: Partial<Address>) => void;
};

const SearchAddress: FunctionComponent<Props> = ({ onAddressChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const { data: session } = useSession();
  const [addressInternal, setAddressInternal] = useState<Partial<Address>[]>(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSearchChange = async (value: string) => {
    setSearchValue(value);

    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/address/geocode/forward/`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          address: value,
          username: session.user.darn,
          metaData: { votingDistrict: true },
        }),
      }
    );

    setIsLoading(false);

    if (!response.ok) {
      console.log('something went wrong');
      setSearchResults([]);
      return;
    }

    const respPayload = await response.json();

    const result = respPayload?.data?.results?.values.filter(
      v => v?.service?.type !== 'VOTING_DISTRICT'
    );
    setSearchResults(result || []);
  };

  const debouncedHandleSearchChange = debounce((value: string) => {
    onSearchChange(value);
  }, 1000);

  useEffect(() => {
    setAddressInternal(searchResults);
  }, [addressInternal, searchResults]);

  return (
    <AddressMap
      isLoading={isLoading}
      handleSearchChange={debouncedHandleSearchChange}
      address={addressInternal}
      onAddressChange={onAddressChange}
    />
  );
};

export default SearchAddress;
