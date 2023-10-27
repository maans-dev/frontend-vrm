import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FaThumbtack } from 'react-icons/fa';
import { Address } from '@lib/domain/person';
import { IoMapOutline } from 'react-icons/io5';
import { useAnalytics } from '@lib/hooks/useAnalytics';
export interface Props {
  address?: Partial<Address>;
  onAddressChange?: (latitude: number, longitude: number) => void;
  displayText?: boolean;
  displayCoordinates?: boolean;
  searchedLocation?: Partial<Address>[];
}

const Map: FunctionComponent<Props> = ({
  address,
  onAddressChange,
  displayText,
  displayCoordinates,
  searchedLocation,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  //TODO set as a png
  const [markerIcon, setMarkerIcon] = useState(null);
  const [location, setLocation] = useState({
    lat: address?.latitude || -30.559483,
    lng: address?.longitude || 22.937506,
  });
  const [coordinates, setCoordinates] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [screenWidth, setScreenWidth] = useState(0);
  const isTablet = screenWidth >= 767 && screenWidth <= 1073;
  const { trackCustomEvent } = useAnalytics();

  useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API,
  });

  const handleMapButtonClick = () => {
    setShowMap(true);
    setIsModalVisible(true);
    trackCustomEvent('Living address', 'Pin on Map');
  };

  const handleCloseModal = () => {
    setShowMap(false);
    setIsModalVisible(false);
  };

  const isDefaultLocation =
    location.lat === -30.559483 && location.lng === 22.937506;

  const handleDoubleClick = event => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setShowConfirmation(true);
  };

  function handleConfirmationClick() {
    onAddressChange(location.lat, location.lng);
    setIsModalVisible(false);
    trackCustomEvent('Living address', 'Use Pin on Map Location');
  }

  function handleMarkerDragStart() {
    setIsDragging(true);
    setShowConfirmation(false);
  }

  function handleMarkerDragEnd(event) {
    setIsDragging(false);
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setIsDragging(false);
    setShowConfirmation(true);
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    const structMapType = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        // "Wrap" x (logitude) at 180th meridian properly
        // NB: Don't touch coord.x because coord param is by reference, and changing its x property breakes something in Google's lib
        const tilesPerGlobe = 1 << zoom;
        let x = coord.x % tilesPerGlobe;
        if (x < 0) {
          x = tilesPerGlobe + x;
        }
        // Wrap y (latitude) in a like manner if you want to enable vertical infinite scroll

        return `https://mapping.da.org.za/structures-2019/tiles/admin16/${zoom}/${x}/${coord.y}.png`;
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'Structures',
      maxZoom: 19,
    });

    map.overlayMapTypes.insertAt(0, structMapType);
  }, []);

  const onUseCoordinates = () => {
    trackCustomEvent('Living address', 'Entered coordinates manually');
    if (!coordinates) return;

    let latitude: number, longitude: number;

    if (coordinates.includes(',')) {
      const [latStr, lngStr] = coordinates
        .split(',')
        .map(coord => coord.trim());
      latitude = Number(latStr);
      longitude = Number(lngStr);
    } else if (coordinates.includes(' ')) {
      const [latStr, lngStr] = coordinates
        .split(' ')
        .map(coord => coord.trim());
      latitude = Number(latStr);
      longitude = Number(lngStr);
    } else {
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) return;

    setLocation({
      lat: latitude,
      lng: longitude,
    });
    setCoordinates('');
  };

  const handleCoordinatesChange = event => {
    setCoordinates(event.target.value);
  };

  useEffect(() => {
    const icon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-pushpin.png',
    };
    setMarkerIcon(icon);
    if (
      searchedLocation &&
      searchedLocation[0]?.latitude &&
      searchedLocation[0]?.longitude
    ) {
      setLocation({
        lat: searchedLocation[0].latitude,
        lng: searchedLocation[0].longitude,
      });
    } else {
      setLocation({
        lat: address?.latitude || -30.559483,
        lng: address?.longitude || 22.937506,
      });
    }
  }, [address, searchedLocation]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      {displayText ? (
        <div>
          <EuiButtonIcon
            href="#"
            iconType={FaThumbtack}
            iconSize="s"
            aria-label="Use Pin on Map"
            onClick={() => {
              trackCustomEvent(
                'Living Address',
                'Clicked Use Pin on Map on Search Address'
              );
              handleMapButtonClick();
            }}
          />
          <EuiButtonEmpty href="#" onClick={handleMapButtonClick} size="xs">
            Use Pin on Map
          </EuiButtonEmpty>
        </div>
      ) : displayCoordinates ? (
        address && address.longitude && address.latitude ? (
          <EuiButton
            type="submit"
            style={{ width: '320px' }}
            onClick={() => {
              trackCustomEvent('Living Address', 'Clicked Show on Map');
              handleMapButtonClick();
            }}>
            <EuiIcon type={IoMapOutline} size="m" />
            <EuiText size="s">Show on Map</EuiText>(
            {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)})
          </EuiButton>
        ) : null
      ) : (
        <EuiButton
          type="submit"
          iconType={FaThumbtack}
          size="m"
          onClick={() => {
            trackCustomEvent('Living Address', 'Clicked Pin on Map');
            handleMapButtonClick();
          }}>
          <EuiText size="s">Pin on Map</EuiText>
        </EuiButton>
      )}

      {isModalVisible && (
        <EuiOverlayMask>
          <EuiModal onClose={handleCloseModal} maxWidth="1200px">
            <EuiModalHeader style={{ justifyContent: 'center' }}>
              <EuiModalHeaderTitle size={isMobile ? 'xs' : 's'}>
                Drop a Pin by Double-Clicking on the Map or Enter Coordinates
                Below
              </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>
              {showMap && (
                <>
                  <EuiFlexGroup direction="column" alignItems="center">
                    <EuiFlexItem>
                      {location && (
                        <GoogleMap
                          center={location}
                          zoom={isDefaultLocation ? 5 : 17}
                          onDblClick={handleDoubleClick}
                          options={{
                            zoomControl: true,
                            streetViewControl: true,
                            mapTypeControl: true,
                            fullscreenControl: true,
                          }}
                          onLoad={onLoad}
                          mapContainerStyle={{
                            height: isMobile
                              ? 'calc(100vh - 140px)'
                              : isTablet
                              ? '350px'
                              : '500px',
                            width: isMobile
                              ? 'calc(100vw - 20px)'
                              : isTablet
                              ? '800px'
                              : '1000px',
                            margin: '10px',
                            marginTop: '-2px',
                            border: '1px solid rgba(128, 128, 128, 0.4  )',
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                          }}>
                          <Marker
                            position={location}
                            icon={isDefaultLocation ? markerIcon : markerIcon}
                            label={{
                              text: isDragging ? ' ' : ' ',
                              color: 'black',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            }}
                            draggable={true}
                            onDragStart={handleMarkerDragStart}
                            onDragEnd={handleMarkerDragEnd}
                          />
                        </GoogleMap>
                      )}
                    </EuiFlexItem>
                  </EuiFlexGroup>
                  <EuiSpacer size={isMobile ? 's' : 'm'} />
                </>
              )}
            </EuiModalBody>

            {isMobile && <EuiSpacer size="s" />}

            <EuiFlexGroup
              justifyContent="center"
              direction={isMobile ? 'column' : undefined}
              responsive={false}
              gutterSize="s">
              <EuiFormRow>
                <EuiFlexGroup
                  style={
                    isMobile
                      ? { paddingLeft: '10px', paddingRight: '10px' }
                      : undefined
                  }>
                  <EuiFieldText
                    compressed
                    placeholder="Latitude, Longitude"
                    id="coordinatesInput"
                    value={coordinates}
                    onChange={handleCoordinatesChange}
                    append={
                      <EuiButton size="s" onClick={onUseCoordinates}>
                        Set Coordinates
                      </EuiButton>
                    }
                  />
                </EuiFlexGroup>
              </EuiFormRow>

              <EuiSpacer size="s" />

              {showConfirmation && (
                <EuiFlexItem
                  grow={false}
                  style={
                    isMobile
                      ? { paddingLeft: '10px', paddingRight: '10px' }
                      : undefined
                  }>
                  <EuiButton onClick={handleConfirmationClick} size="s">
                    Use this location
                  </EuiButton>
                  <EuiSpacer size="s" />
                  <EuiText size="xs" textAlign="center">
                    <strong>
                      Coordinates: {location.lat.toFixed(4)},{' '}
                      {location.lng.toFixed(4)}
                    </strong>
                  </EuiText>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>

            <EuiSpacer size={isMobile ? 'm' : 'l'} />
          </EuiModal>
        </EuiOverlayMask>
      )}
    </>
  );
};

export default Map;
