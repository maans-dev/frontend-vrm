import { useCallback, useEffect, useState } from 'react';
import {
  EuiCallOut,
  EuiSelectable,
  EuiSelectableOption,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { Address, Structure } from '@lib/domain/person';
import { useSession } from 'next-auth/react';
import { GeocodedAddressSource } from '@lib/domain/person-enum';
import { appsignal } from '@lib/appsignal';

interface Props {
  address: Partial<Address>[];
  isLoading: boolean;
  onSelect: (selected) => void;
}

export interface OptionData {
  description?: string;
  value: Partial<Address>;
  votingDistrict?: string;
  votingDistrict_id?: string;
  latitude?: string;
  longitude?: string;
  emoji?: string;
}

const AddressResults = ({ address, onSelect, isLoading }: Props) => {
  const { data: session } = useSession();
  const [options, setOptions] = useState<
    Array<EuiSelectableOption<OptionData>>
  >(
    address && Array.isArray(address)
      ? address.map(
          (addres): EuiSelectableOption<OptionData> => ({
            label: addres.formatted,
            data: {
              votingDistrict: addres?.votingDistrict,
              votingDistrict_id: addres?.votingDistrict_id,
              latitude: addres.latitude,
              longitude: addres.longitude,
              emoji: addres?.service?.emoji,
            },
            isGroupLabel: false,
            value: addres,
            // prepend: <></>,
          })
        )
      : []
  );

  const [error, setError] = useState<string>(null);

  const getOptionData = (option: EuiSelectableOption<OptionData>) => {
    return {
      description: option.data?.description,
      votingDistrict: option.data?.votingDistrict,
      votingDistrict_id: option.data?.votingDistrict_id,
      latitude: option.data?.latitude,
      longitude: option.data?.longitude,
      emoji: option?.data?.emoji,
    };
  };

  const renderOption = useCallback(
    (option: EuiSelectableOption<OptionData>) => {
      getOptionData(option);
      return (
        <>
          {option.label ? (
            <>
              <EuiSpacer size="xs" />
              <EuiText size="xs">{option.label}</EuiText>
              <EuiSpacer size="xs" />
            </>
          ) : null}
        </>
      );
    },
    []
  );

  const handleSelect = async options => {
    setOptions(options);
    setError(null);
    const selectedAddress = options.find(option => option.checked === 'on');

    // add structure info
    if (selectedAddress && !('votingDistrict_id' in selectedAddress.value)) {
      // fetch the structure info
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/structures/votingdistricts?latitude=${selectedAddress.data.latitude}&longitude=${selectedAddress.data.longitude}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        method: 'GET',
      });

      if (!response.ok) {
        // throw 'Unable to load Voting District for this address';
        const errJson = await response.clone().text();
        setError(`Unable to load Voting District for this address: ${errJson}`);

        appsignal.sendError(
          new Error(
            `Unable to load Voting District for this address: ${errJson}`
          ),
          span => {
            span.setAction('api-call');
            span.setParams({
              route: url,
              address: selectedAddress,
              user: session?.user?.darn,
            });
            span.setTags({ user_darn: session?.user?.darn?.toString() });
          }
        );
        return;
      }

      const structureInfo: Partial<Structure>[] = await response.clone().json();

      if (structureInfo.length === 0) {
        setError(
          `Unable to load Voting District for this address: No VD found at ${selectedAddress.data.latitude}, ${selectedAddress.data.longitude}`
        );
        appsignal.sendError(
          new Error(
            `Unable to load Voting District for this address: No VD found at ${selectedAddress.data.latitude}, ${selectedAddress.data.longitude}`
          ),
          span => {
            span.setAction('api-call');
            span.setParams({
              route: url,
              address: selectedAddress,
              user: session.user.darn,
            });
            span.setTags({ user_darn: session.user.darn.toString() });
          }
        );
        return;
      }

      // Add missing structure values from forward geocoded address
      selectedAddress.value.votingDistrict_id =
        +structureInfo[0].votingDistrict_id;
      selectedAddress.value.votingDistrict = structureInfo[0].votingDistrict;
      selectedAddress.value.province = structureInfo[0].province;
      selectedAddress.value.structure = structureInfo[0];
    }

    // add geocoded source
    if (selectedAddress?.value?.latitude && selectedAddress?.value?.longitude) {
      selectedAddress.value.geocodeSource =
        GeocodedAddressSource.GEOCODED_ADDRESS;
    } else {
      if (selectedAddress?.value?.geocodeSource) {
        selectedAddress.value.geocodeSource = GeocodedAddressSource.UNGEOCODED;
      }
    }

    if (selectedAddress?.value?.service?.type === 'VOTING_DISTRICT') {
      selectedAddress.value.geocodeSource = GeocodedAddressSource.GEOCODED_VD;
    }
    onSelect(selectedAddress);
  };

  useEffect(() => {
    if (address && Array.isArray(address)) {
      setError(null);
      setOptions(
        address.map(
          (addres): EuiSelectableOption<OptionData> => ({
            label: addres.formatted,
            data: {
              votingDistrict: addres?.votingDistrict,
              votingDistrict_id: addres?.votingDistrict_id,
              latitude: addres.latitude,
              longitude: addres.longitude,
              emoji: addres?.service?.emoji,
            },
            isGroupLabel: false,
            value: addres,
            prepend: addres?.service?.emoji,
          })
        )
      );
    }
  }, [address]);

  return (
    <>
      <EuiSelectable
        options={options}
        isLoading={isLoading}
        singleSelection={true}
        allowExclusions={false}
        errorMessage={
          error && (
            <EuiCallOut
              size="s"
              title={error}
              color="danger"
              iconType="error"
            />
          )
        }
        onChange={handleSelect}
        renderOption={renderOption}
        height="full"
        className="eui-scrollBar"
        css={{ maxHeight: '500px', overflowY: 'auto' }}
        listProps={{
          isVirtualized: false,
          textWrap: 'wrap',
          showIcons: false,
          onFocusBadge: false,
        }}>
        {(list, search) => (
          <>
            {search}
            {list}
          </>
        )}
      </EuiSelectable>
    </>
  );
};

export default AddressResults;
