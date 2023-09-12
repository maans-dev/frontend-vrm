import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSession } from 'next-auth/react';
import { Address } from '@lib/domain/person';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiInputPopover,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import AddressResults from './address.results';
import { appsignal } from '@lib/appsignal';
import FillInManuallyModal from '@components/living-address/fill-in-manually-modal';
import Map from '@components/maps/map';
import { useAnalytics } from '@lib/hooks/useAnalytics';

export type Props = {
  onAddressChange: (selectedAddress: Partial<Address>) => void;
  onMapAddressChange?: (latitude: number, longitude: number) => void;
  address?: Partial<Address>;
  onSubmit?: (address: Partial<Address>) => void;
  onClose?: (address: Partial<Address>) => void;
};

const SearchAddress: FunctionComponent<Props> = ({
  onAddressChange,
  onMapAddressChange,
  address,
  onSubmit,
  onClose,
}) => {
  const { data: session } = useSession();
  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState<Partial<Address>[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [releaseFocusTrap, setReleaseFocusTrap] = useState(false);
  const { trackCustomEvent } = useAnalytics();

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
        Authorization: `Bearer ${session?.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        address: value,
        username: session?.user?.darn,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      setSearchResults([]);
      const errJson = await response.clone().text();
      appsignal.sendError(
        new Error(`Unable to forward geocode this address: ${errJson}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            address: value,
            username: session?.user?.darn,
          });
          span.setTags({ user_darn: session?.user?.darn?.toString() });
        }
      );
      return;
    }

    const respPayload = await response.clone().json();

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
      trackCustomEvent('Living address', 'Search for an address, selected');
    }
  };

  useEffect(() => {
    setSearchedLocation(searchResults);
    setIsPopoverOpen(searchResults.length > 0);
  }, [searchResults]);

  return (
    <EuiInputPopover
      fullWidth={true}
      input={
        <EuiFieldSearch
          autoComplete="no"
          fullWidth={true}
          isLoading={isLoading}
          placeholder="E.g. 3 Kloof Street, Gardens"
          value={searchString}
          onBlur={e => {
            if (isPopoverOpen && searchResults.length && !releaseFocusTrap)
              e.target.focus();
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

      <EuiSpacer size="s" />
      <EuiFlexGroup direction="row" gutterSize="s">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="row" gutterSize="s">
            <EuiFlexItem>
              <EuiText size="s" color="subdued">
                Alternatively
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <Map
                displayText={true}
                address={address}
                onAddressChange={onMapAddressChange}
                searchedLocation={searchedLocation}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <FillInManuallyModal
                address={searchResults[0]}
                onSubmit={onSubmit}
                removeResults={true}
                onClose={address => {
                  onClose(address);
                  setReleaseFocusTrap(false);
                }}
                onOpen={() => {
                  setReleaseFocusTrap(true);
                }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiInputPopover>
  );
};

export default SearchAddress;
