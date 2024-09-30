import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L, { icon } from 'leaflet';
import { fetchConstructionZones } from "../api/constructionsApi";
import LayerControl from "./LayerControl"; // Import the LayerControl component
import metro from '../resources/metro.svg'
import CustomLeafletToggleControl from "./CustomLeafletToggleControl";

const metroIcon = L.icon({
  iconUrl: metro,
  iconSize: [25, 25],
  iconAnchor: [12, 24],
});

const MapComponent = () => {
  const [constructionZones, setConstructionZones] = useState(null);

  // State to manage layer visibility
  const [visibleLayers, setVisibleLayers] = useState({
    metro: true,
    roads: true,
    construction: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try{
      const constructionZonesData = await fetchConstructionZones();
      setConstructionZones(constructionZonesData);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);

  if (!constructionZones) {
    return <div>Загрузка...</div>;
  }
  // Handle layer toggle logic for checkbox
  const handleLayerToggle = (layer, isChecked) => {
    setVisibleLayers(prevState => ({
      ...prevState,
      [layer]: isChecked, // Set the visibility of the layer based on the checkbox state
    }));
  };

  return (
    <div class="map-with-controls" >

      <MapContainer
        center={[55.746996, 37.676155]}
        zoom={13}
        style={{ height: '100vh', width: '100%' }}
      >
              <CustomLeafletToggleControl
        visibleLayers={visibleLayers}
        handleLayerToggle={handleLayerToggle}
      />
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

   {/* Render all, not construction zones*/}
      {constructionZones.map((zone) => (
        <React.Fragment key={zone.id}>
          {/* render construction zones */}
          <Polygon 
            positions={visibleLayers.construction && zone.area.coordinates[0].map(coord => [coord[1], coord[0]])}
            color="blue"
          >
            <Popup>{visibleLayers.construction && zone.name}</Popup>
          </Polygon>

          {/* render metro*/}
          {visibleLayers.metro && zone.zoneMetroTraffic.map((metro) => (
            <Marker
              key={metro.metro_station.id}
              position={[
                metro.metro_station.position.coordinates[1], 
                metro.metro_station.position.coordinates[0]
              ]}
              icon={metroIcon}
            >
              <Popup>
                {metro.metro_station.name} <br />
                Утренний трафик: {metro.metro_station.morning_traffic} <br />
                Вечерний трафик: {metro.metro_station.evening_traffic} <br />
                Прогнозируемый трафик: {metro.new_traffic} <br />
                {metro.is_effective ? "Трафик эффективен" : "Трафик неэффективен"} <br />
              </Popup>
            </Marker>
          ))}

          {/* render roads */}
          {visibleLayers.roads && zone.zoneRoadTraffic.map((road) => (
            <Polyline
              key={road.road.id}
              positions={road.road.geometry.coordinates.map(coord => [coord[1], coord[0]])}
              color="red"
            >
              <Popup>
                {road.road.name} <br />
                Утренний трафик: {road.road.morning_traffic} <br />
                Вечерний трафик: {road.road.evening_traffic} <br />
                Прогнозируемый трафик: {road.new_traffic} <br />
                {road.is_effective ? "Трафик эффективен" : "Трафик неэффективен"} <br />
              </Popup>
            </Polyline>
          ))}
        </React.Fragment>
      ))}
    </MapContainer>
    </div>
  );
};


export default MapComponent;
