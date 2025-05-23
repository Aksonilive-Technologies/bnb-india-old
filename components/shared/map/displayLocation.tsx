import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DisplayLocationMapProps {
  coordinates: [number, number];
}

const MapEventHandler = () => {
  const map = useMap();

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const zoomDelta = event.deltaY > 0 ? -1 : 1;
        map.setZoom(map.getZoom() + zoomDelta);
      }
    };

    // Add the wheel event listener to the map container
    map.getContainer().addEventListener('wheel', handleWheel);

    // Clean up the event listener on component unmount
    return () => {
      map.getContainer().removeEventListener('wheel', handleWheel);
    };
  }, [map]);

  return null;
};

export default function DisplayLocationMap({ coordinates }: DisplayLocationMapProps) {
  return (
    <MapContainer center={coordinates} zoom={13} minZoom={2} className="h-full w-full z-0" scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={coordinates}>
        <Popup>
          <a href={`https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </Popup>
      </Marker>
      <MapEventHandler />
    </MapContainer>
  );
}
