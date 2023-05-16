import React, { FunctionComponent, useEffect, useState } from 'react';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FaThumbtack } from 'react-icons/fa';
import { Address } from '@lib/domain/person';
export interface Props {
  address: Partial<Address>;
  onAddressChange: (latitude: number, longitude: number) => void;
}

const Map: FunctionComponent<Props> = ({ address, onAddressChange }) => {
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

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
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
    setLocation({
      lat: address?.latitude || -30.559483,
      lng: address?.longitude || 22.937506,
    });
  }, [address]);

  const isDefaultLocation =
    location.lat === -30.559483 && location.lng === 22.937506;

  const handleDoubleClick = event => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setShowConfirmation(true);
  };

  return (
    <>
      <EuiButton
        style={{ width: '320px' }}
        type="submit"
        iconType={FaThumbtack}
        size="s"
        onClick={handleMapButtonClick}>
        {address && address?.longitude && address?.latitude ? (
          <>
            <EuiText size="s">Show map</EuiText>({address.latitude.toFixed(4)},{' '}
            {address.longitude.toFixed(4)})
          </>
        ) : (
          <EuiText size="s">Use map to set location</EuiText>
        )}
      </EuiButton>
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
                </>
              )}
            </EuiModalBody>
          </EuiModal>
        </EuiOverlayMask>
      )}
    </>
  );
};

export default Map;
