import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchConstructionZones } from "../api/api";
import CustomLeafletToggleControl from "./CustomLeafletToggleControl";
import PolygonLayer from "./PolygonLayer";
import MarkerLayer from "./MarkerLayer";
import "../styles/MapComponent.css";
import ContactsButton from './ContactsButton';

import MainForm from './Forms/MainForm'; // Импортируйте ваш компонент формы
const MapComponent = () => {
  const [constructionZones, setConstructionZones] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState({
    metro: true,
    roads: true,
    construction: true,
  });
  const [loading, setLoading] = useState(true);
  const [showToolbar, setShowToolbar] = useState(false); // Состояние для тулбара
  useEffect(() => {
    const loadData = async (attempts = 10, delay = 4000) => {
      setLoading(true); // Start loading

      for (let i = 0; i < attempts; i++) {
        try {
          const data = await fetchConstructionZones();
          setConstructionZones(data);
          setLoading(false); 
          return;
        } catch (error) {
          console.error("Attempt failed:", error);
          // Wait for the specified delay before trying again
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      setLoading(false); 
    };

    loadData();
  }, []);

  const handleLayerToggle = (layer, isChecked) => {
    setVisibleLayers((prevState) => ({
      ...prevState,
      [layer]: isChecked,
    }));
  };
  const toggleToolbar = () => {
    setShowToolbar((prev) => !prev);
  };
  if (loading) {
    return(
    <div className="as">
      <div className="container">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>);
  }

  return (
    <div className="map-with-controls" style ={{}}>
      <MapContainer
        center={[55.746996, 37.676155]}
        zoom={13}
        style={{ height: "100vh", width: "100%", borderRadius: "10px"}}
      >
        <CustomLeafletToggleControl
          visibleLayers={visibleLayers}
          handleLayerToggle={handleLayerToggle}
        />
        <ContactsButton/>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {constructionZones.map((zone) => (
          <PolygonLayer
            key={zone.id}
            zone={zone}
            visibleLayers={visibleLayers}
          />
        ))}
        {constructionZones.map((zone) => (
          <MarkerLayer
            key={zone.id}
            zone={zone}
            visibleLayers={visibleLayers}
          />
        ))}
        
      </MapContainer>

      {!showToolbar && (
        <button
          onClick={toggleToolbar}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          Добавить зону
        </button>
      )}

      {showToolbar && (
        <div style={{
          position: 'absolute',
          left: '20px',
          bottom: '80px',
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}>
          <h3>Добавление зоны</h3>
          <MainForm />
          <button onClick={toggleToolbar} style={{ marginTop: '10px' }}>
            Отмена
          </button>
        </div>
        )}
      
    </div>
  );
};

export default MapComponent;