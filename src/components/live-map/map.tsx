import { FunctionComponent, useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { eventIcons } from './icons';
export { Legend } from './legend';

const wsUrl = process.env.NEXT_PUBLIC_LIVEMAP_WS;

interface Event {
  eventKey: string;
  category: string;
  type: string;
  latitude: number;
  longitude: number;
  createdDate: string;
}

interface EventPoint extends Event {
  point: google.maps.LatLng;
  received: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export const LiveMap: FunctionComponent = () => {
  const [now, setNow] = useState(new Date().getTime());
  const [eventPoints, setEventPoints] = useState<Array<EventPoint>>([]);
  const { lastJsonMessage } = useWebSocket(wsUrl, {
    retryOnError: true,
    shouldReconnect: () => true,
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      interval: 15000,
    },
  });

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(i);
    };
  }, []);

  useEffect(() => {
    if (lastJsonMessage != null) {
      const event = lastJsonMessage as Event;

      if (event.category === 'system' || event.category === 'admin') {
        return;
      }

      setEventPoints(ep => [
        {
          ...event,
          point: new google.maps.LatLng(event.latitude, event.longitude),
          received: new Date().getTime(),
        },
        ...ep.filter(e => e.eventKey !== event.eventKey),
      ]);
      setTimeout(() => {
        setEventPoints(ep => ep.filter(e => e.eventKey !== event.eventKey));
      }, 60000);
    }
  }, [lastJsonMessage]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API,
    mapIds: ['8ceb5cfd22422ffe'],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(
      { lat: -34.9, lng: 16.4 },
      { lat: -22.1, lng: 32.9 }
    );
    map.fitBounds(bounds);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={{ streetViewControl: false, mapId: '8ceb5cfd22422ffe' }}>
      {eventPoints.map(ep => (
        <Marker
          key={ep.eventKey}
          position={ep.point}
          opacity={Math.max(0, (ep.received + 60000 - now) / 60000)}
          icon={eventIcons[ep.category]?.image ?? eventIcons.default.image}
          animation={google.maps.Animation.DROP}
          zIndex={ep.received}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
};
