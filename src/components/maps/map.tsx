import React, { FunctionComponent, useEffect, useState } from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FaThumbtack } from 'react-icons/fa';
import { Address } from '@lib/domain/person';
import { IoMapOutline } from 'react-icons/io5';
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
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [screenWidth, setScreenWidth] = useState(0);
  const isTablet = screenWidth >= 767 && screenWidth <= 1073;

  useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API,
  });

  const handleMapButtonClick = () => {
    setShowMap(true);
    setIsModalVisible(true);
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
            onClick={handleMapButtonClick}
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
            onClick={handleMapButtonClick}>
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
          onClick={handleMapButtonClick}>
          <EuiText size="s">Pin on Map</EuiText>
        </EuiButton>
      )}

      {isModalVisible && (
        <EuiOverlayMask>
          <EuiModal onClose={handleCloseModal} maxWidth="1200px">
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
                            marginTop: '20px',
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
            {showConfirmation && (
              <EuiFlexGroup justifyContent="center">
                <EuiFlexItem grow={false}>
                  <EuiButton onClick={handleConfirmationClick} size="m">
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
              </EuiFlexGroup>
            )}
            <EuiSpacer size={isMobile ? 's' : 'm'} />
          </EuiModal>
        </EuiOverlayMask>
      )}
    </>
  );
};

export default Map;
