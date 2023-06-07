import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiButton,
  EuiFieldText,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiToolTip,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FaHouseUser, FaUndo, FaStoreAltSlash } from 'react-icons/fa';
import FillInManuallyModal from './fill-in-manually-modal';
import { Address } from '@lib/domain/person';
import { useGeolocated } from 'react-geolocated';
import { useSession } from 'next-auth/react';
import SearchResultsModal from './search-results-modal';
import SpinnerEmbed from '@components/spinner/spinner-embed';
import Map from '@components/maps/map';
import omit from 'lodash/omit';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { AiOutlineWarning } from 'react-icons/ai';
import SearchAddress from '@components/address-search';
import { GeocodedAddressSource } from '@lib/domain/person-enum';
import { MdHowToVote } from 'react-icons/md';
import { appsignal } from '@lib/appsignal';

export type Props = {
  address: Address;
  onChange: (address: Partial<Address>) => void;
};

const LivingAddress: FunctionComponent<Props> = ({ address, onChange }) => {
  const { data: session } = useSession();
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [updatedAddress, setUpdatedAddress] =
    useState<Partial<Address>>(address);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const onUseMyLocation = async (
    latitude: number,
    longitude: number,
    geocodeSource: GeocodedAddressSource
  ) => {
    setIsLoading(true);
    setSearchResults([]);

    const url = `${process.env.NEXT_PUBLIC_API_BASE}/address/geocode/reverse/`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        latitude,
        longitude,
        username: session.user.darn,
        metaData: { votingDistrict: true },
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const errJson = JSON.parse(await response.text());
      appsignal.sendError(
        new Error(`Unable to reverse geocode coordinates: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            latitude,
            longitude,
            username: session.user.darn,
            metaData: 'votingDistrict: true',
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }

    const respPayload = await response.json();

    const results = respPayload?.data?.results?.values.map(a => {
      return a.service.type !== 'ROOFTOP'
        ? { ...a, latitude, longitude, geocodeSource }
        : a;
    });

    // console.log('[results]', { latitude, longitude, results });

    setSearchResults(results || []);
  };

  const getFormattedAddress = () => {
    if (!updatedAddress) return 'Unknown';

    if (updatedAddress.geocodeSource === GeocodedAddressSource.GEOCODED_VD) {
      return (
        <EuiFlexGroup responsive={false} gutterSize="xs">
          <EuiFlexItem grow={false}>
            <EuiIcon type={MdHowToVote} />
          </EuiFlexItem>
          <EuiFlexItem>
            {updatedAddress?.structure?.formatted ?? updatedAddress.formatted}
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }

    // if (
    //   'formatted' in updatedAddress &&
    //   updatedAddress.formatted !== '' &&
    //   updatedAddress.formatted !== null
    // )
    //   return updatedAddress?.formatted;

    let formatted = '';
    if (
      'streetNo' in updatedAddress &&
      updatedAddress.streetNo !== '' &&
      updatedAddress.streetNo !== null
    )
      formatted = updatedAddress.streetNo;
    if (
      'streetName' in updatedAddress &&
      updatedAddress.streetName !== '' &&
      updatedAddress.streetName !== null
    )
      formatted = `${formatted} ${updatedAddress.streetName},`;
    if (
      'suburb' in updatedAddress &&
      updatedAddress.suburb !== '' &&
      updatedAddress.suburb !== null
    )
      formatted = `${formatted} ${updatedAddress.suburb},`;
    if (
      'city' in updatedAddress &&
      updatedAddress.city !== '' &&
      updatedAddress.city !== null
    )
      formatted = `${formatted} ${updatedAddress.city},`;
    if (
      'province_enum' in updatedAddress &&
      updatedAddress.province_enum !== null
    )
      formatted = `${formatted} ${updatedAddress.province_enum},`;
    if (
      'postalCode' in updatedAddress &&
      updatedAddress.postalCode !== '' &&
      updatedAddress.postalCode !== null
    )
      formatted = `${formatted} ${updatedAddress.postalCode}`;

    return formatted !== '' ? formatted : 'Unknown';
  };

  const onAddressChange = (selectedAddress: Partial<Address>) => {
    setSearchResults([selectedAddress]);
  };

  const onSelectAddress = async (selectedAddress: Partial<Address>) => {
    setSearchResults([]);
    if (!selectedAddress) return;
    // TODO: shouldn't use any here. Need to define proper update type that matches the reqiored payload.
    const update: any = {
      // key: address.key,
      ...omit(selectedAddress, [
        'key',
        'type',
        // 'formatted',
        'service',
        'emoji',
        'created',
        'createdBy',
        'key_hash',
        'key_text',
        'modified',
        'modifiedBy',
        'person',
        'structure',
      ]),
      structure: {
        votingDistrict_id: +selectedAddress.votingDistrict_id,
      },
    };

    setUpdatedAddress(update);
    onChange(update);
  };

  const onSetManualAddress = (address: Partial<Address>) => {
    delete address.latitude;
    delete address.longitude;
    setUpdatedAddress(address);
    onChange(address);
  };

  const onUpdateAddress = (field: string, value: string) => {
    // TODO: shouldn't use any here. Need to define proper update type that matches the reqiored payload.
    const update: any = {
      ...omit(updatedAddress, [
        'key',
        'type',
        // 'formatted',
        'service',
        'emoji',
        'created',
        'createdBy',
        'key_hash',
        'key_text',
        'modified',
        'modifiedBy',
        'person',
        'structure',
      ]),
      [field]: value,
    };

    if (
      'votingDistrict_id' in updatedAddress.structure &&
      address.structure.votingDistrict_id !==
        +updatedAddress.structure.votingDistrict_id
    ) {
      update.structure = {
        votingDistrict_id: +updatedAddress.structure.votingDistrict_id,
      };
    } else {
      update.structure = {
        key: updatedAddress.structure.key,
      };
    }

    setUpdatedAddress(update);
    onChange(update);
  };

  const renderUseMyLocationButton = () => {
    if (isGeolocationEnabled) {
      return (
        <EuiButton
          isLoading={isLoading}
          aria-label="Use my location button"
          iconType={FaHouseUser}
          iconSide="left"
          // disabled={!isGeolocationEnabled}
          color="primary"
          onClick={() =>
            onUseMyLocation(
              coords.latitude,
              coords.longitude,
              GeocodedAddressSource.GEOCODED_DEVICE
            )
          }>
          Use device location
        </EuiButton>
      );
    }

    return (
      <EuiToolTip
        display="block"
        content={
          isGeolocationAvailable
            ? 'You have not enabled location services for this application'
            : 'Your device does not support lcation services'
        }>
        <EuiButton
          fullWidth
          aria-label="Use my location button"
          iconType={AiOutlineWarning}
          iconSide="left"
          // disabled={true}
          color={'warning'}>
          Use device location
        </EuiButton>
      </EuiToolTip>
    );
  };

  const onReset = () => {
    setUpdatedAddress(address);
    onChange(null);
  };

  const onMoved = () => {
    const emptyAddress: Partial<Address> = {
      deleted: true,
    };
    setUpdatedAddress(emptyAddress);
    onChange(null);
    onChange(emptyAddress);
  };

  useCanvassFormReset(() => {
    setUpdatedAddress(address);
  });

  useEffect(() => {
    setUpdatedAddress(address);
  }, [address]);

  return (
    <div style={{ position: 'relative' }}>
      <SpinnerEmbed show={isLoading} />
      <SearchResultsModal results={searchResults} onClose={onSelectAddress} />
      <EuiFlexGroup direction="column">
        <EuiFlexGroup
          direction="row"
          alignItems="center"
          responsive={false}
          gutterSize="s">
          <EuiFlexItem>
            <SearchAddress onAddressChange={onAddressChange} />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGrid
          direction="row"
          columns={isMobile ? 2 : 4}
          alignItems="center"
          responsive={false}
          gutterSize="s">
          <EuiFlexItem>{renderUseMyLocationButton()}</EuiFlexItem>
          <EuiFlexItem>
            <FillInManuallyModal
              address={updatedAddress}
              onSubmit={onSetManualAddress}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton
              iconType={FaStoreAltSlash}
              aria-label="Moved button"
              onClick={() => onMoved()}>
              Voter has moved
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton
              iconType={FaUndo}
              aria-label="Reset button"
              onClick={() => onReset()}>
              Reset
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGrid>
        <EuiFlexItem>
          <EuiFlexGroup responsive={false} gutterSize="m">
            <EuiFlexItem grow={3}>
              <EuiFormRow display="rowCompressed" label="Unit Number">
                <EuiFieldText
                  name="Unit Number"
                  compressed
                  value={updatedAddress?.buildingNo || ''}
                  onChange={e => onUpdateAddress('buildingNo', e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={9}>
              <EuiFormRow display="rowCompressed" label="Unit Name">
                <EuiFieldText
                  name="Unit Name"
                  compressed
                  value={updatedAddress?.buildingName || ''}
                  onChange={e =>
                    onUpdateAddress('buildingName', e.target.value)
                  }
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
          <EuiFlexItem grow={9}>
            <EuiFormRow display="rowCompressed" label="Comment">
              <EuiFieldText
                name="Comment"
                autoComplete="no"
                compressed
                value={updatedAddress?.comment || ''}
                onChange={e => onUpdateAddress('comment', e.target.value)}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiSpacer size="m" />
          <EuiFormRow display="rowCompressed" label="Address on File">
            <EuiPanel hasShadow={false} hasBorder={true} paddingSize="s">
              <EuiText size="xs">{getFormattedAddress()}</EuiText>
            </EuiPanel>
          </EuiFormRow>
        </EuiFlexItem>
        <Map
          address={updatedAddress}
          onAddressChange={(latitude, longitude) =>
            onUseMyLocation(
              latitude,
              longitude,
              GeocodedAddressSource.GEOCODED_PIN
            )
          }
        />
      </EuiFlexGroup>
    </div>
  );
};

export default LivingAddress;
