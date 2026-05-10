import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapFocus({ selectedCity }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCity) {
      map.setView([selectedCity.lat, selectedCity.lon], 9);
    }
  }, [selectedCity, map]);

  return null;
}

function WeatherMap({ settlements, selectedCity, onSelectCity }) {
  return (
    <MapContainer
      center={[55.75, 37.62]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
    >
      <MapFocus selectedCity={selectedCity} />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {settlements.map((city, index) => (
        <CircleMarker
          key={index}
          center={[city.lat, city.lon]}
          radius={5}
          pathOptions={{
            color: selectedCity?.name === city.name ? 'red' : 'blue',
            fillColor: selectedCity?.name === city.name ? 'red' : 'blue',
            fillOpacity: 0.7
          }}
          eventHandlers={{
            click: () => onSelectCity(city)
          }}
        >
          <Popup>
            <strong>{city.name}</strong>
            <br />
            {city.region}
            <br />
            Население: {city.population}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default WeatherMap;