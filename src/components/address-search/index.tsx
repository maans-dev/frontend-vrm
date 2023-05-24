import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSession } from 'next-auth/react';
import { Address } from '@lib/domain/person';
import { EuiFieldSearch, EuiInputPopover } from '@elastic/eui';
import AddressResults from './address.results';
import { appsignal } from '@lib/appsignal';

export type Props = {
  onAddressChange: (selectedAddress: Partial<Address>) => void;
};

const SearchAddress: FunctionComponent<Props> = ({ onAddressChange }) => {
  const { data: session } = useSession();
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setIsPopoverOpen(searchResults.length > 0);
  }, [searchResults]);

  const doSearchChanged = async (value: string) => {
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/address/geocode/forward/`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        address: value,
        username: session.user.darn,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setSearchResults([]);
      const errJson = JSON.parse(await response.text());
      appsignal.sendError(
        new Error(`Unable to forward geocode this address: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            address: value,
            username: session.user.darn,
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }

    const respPayload = await response.json();

    setSearchResults(respPayload?.data?.results?.values || []);
  };

  const doDebouncedSearchChanged = useCallback(
    debounce(async (value: string) => {
      await doSearchChanged(value);
    }, 1000),
    []
  );

  const doSelectAddress = selected => {
    setIsPopoverOpen(false);

    setSearchString('');

    if (selected && selected.label && selected.data) {
      onAddressChange(selected.value);
      setSearchResults([]);
    }
  };

  return (
    <EuiInputPopover
      fullWidth={true}
      input={
        <EuiFieldSearch
          autoComplete="no"
          fullWidth={true}
          isLoading={isLoading}
          compressed
          placeholder="E.g. 3 Kloof Street, Gardens"
          value={searchString}
          onBlur={e => {
            if (isPopoverOpen && searchResults.length) e.target.focus();
            if (!isPopoverOpen) {
              setSearchString('');
              setSearchResults([]);
            }
          }}
          onChange={e => {
            setSearchString(e.target.value);
            if (e.target.value === '' || e.target.value.length < 3) {
              setSearchResults([]);
            } else {
              doDebouncedSearchChanged(e.target.value);
            }
          }}
          data-test-subj="searchMapInput"
          aria-label="Structure search"
        />
      }
      isOpen={isPopoverOpen}
      closePopover={() => setIsPopoverOpen(false)}>
      <AddressResults
        isLoading={isLoading}
        address={searchResults}
        onSelect={doSelectAddress}
      />
    </EuiInputPopover>
  );
};

export default SearchAddress;
