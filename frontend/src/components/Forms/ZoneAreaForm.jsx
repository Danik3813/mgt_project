import React, { useState } from 'react';

const ZoneAreaForm = ({ zoneAreas, setZoneAreas }) => {
  const [zoneArea, setZoneArea] = useState({
    zone_area: 0,
    construction_type_id: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setZoneArea((prev) => ({ ...prev, [name]: value }));
  };

  const addZoneArea = () => {
    if (zoneArea.zone_area > 0 && zoneArea.construction_type_id > 0) {
      setZoneAreas((prev) => [...prev, zoneArea]);
      setZoneArea({ zone_area: 0, construction_type_id: 0 });
    }
  };

  const removeZoneArea = (index) => {
    setZoneAreas((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>Площади</h3>
      <input
        type="number"
        name="zone_area"
        value={zoneArea.zone_area}
        onChange={handleChange}
        placeholder="Площадь"
      />
      <input
        type="number"
        name="construction_type_id"
        value={zoneArea.construction_type_id}
        onChange={handleChange}
        placeholder="ID типа строительства"
      />
      
      <button onClick={addZoneArea} disabled={zoneArea.zone_area <= 0 || zoneArea.construction_type_id <= 0}>
        Добавить площадь
      </button>

      <ul>
        {zoneAreas && zoneAreas.length > 0 ? (
          zoneAreas.map((zone, index) => (
            <li key={index}>
              {zone.zone_area} - {zone.construction_type_id} 
              <button onClick={() => removeZoneArea(index)}>Удалить</button>
            </li>
          ))
        ) : (
          <li>Нет добавленных площадей</li>
        )}
      </ul>
    </div>
  );
};

export default ZoneAreaForm;
