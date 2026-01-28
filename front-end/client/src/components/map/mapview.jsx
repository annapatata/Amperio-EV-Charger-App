import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getMarkerIcon } from "../../utils/mapIcons";
import { useEffect, useState, useRef } from "react";
import "./mapview.css";

//zooming on selected station
function SetViewOnStation({ selectedStation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedStation?.latitude && selectedStation?.longitude) {
      //zoom in
      map.flyTo(
        [selectedStation.latitude, selectedStation.longitude], 
        16, 
        { animate: true, duration: 1.3 }
      );
    } else if (!selectedStation) {
      // zoom out
      map.flyTo(
        [37.9838, 23.7275], 
        13, 
        { animate: true, duration: 1.3 }
      );
    }
  }, [selectedStation, map]);

  return null;
}

export default function MapView({ stations, onStationClick, selectedStation }) {
  const [hoveredStationId, setHoveredStationId] = useState(null);
  const markerRefs = useRef({});

  const getAvailableChargers = (station) => {
    // Προσοχή: Βεβαιώσου ότι το backend επιστρέφει αυτά τα ονόματα πεδίων
    // Αν χρησιμοποιείς το προηγούμενο SQL query, ίσως χρειαστεί να υπολογίσεις 
    // τα counts εκεί ή να τα στείλεις ως εξτρά πεδία.
    if (station.total_chargers > 0) {
      return `${station.available_chargers || 0}/${station.total_chargers}`;
    }
    return null;
  };

  const handleMarkerMouseEnter = (stationId) => {
    const marker = markerRefs.current[stationId];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleMarkerMouseLeave = (stationId) => {
    const marker = markerRefs.current[stationId];
    if (marker) {
      marker.closePopup();
    }
  };

  return (
    <MapContainer
      center={[37.9838, 23.7275]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
	attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	url='https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=fb7a93ebc29a49cf9a8d94e56c00af61'
      />

      {stations && stations.map((station) => {
        const isSelected = selectedStation?.station_id === station.station_id;
        const chargerText = getAvailableChargers(station);

        return (
          <Marker
            key={station.station_id}
            ref={(el) => (markerRefs.current[station.station_id] = el)}
            position={[station.latitude, station.longitude]}
            icon={getMarkerIcon(station.station_status, isSelected)}
            eventHandlers={{
              click: () => onStationClick(station),
              mouseover: () => handleMarkerMouseEnter(station.station_id),
              mouseout: () => handleMarkerMouseLeave(station.station_id),
            }}
          >
            {chargerText && (
              <Popup 
                className="charger-popup" 
                closeButton={false} 
                autoPan={false} // Εμποδίζει το χάρτη να "πηδάει" στο hover
                offset={[0, -10]} // Μετακινεί το popup λίγο πιο πάνω από το εικονίδιο
              >
                <div className="charger-popup-content">
                  ⚡ {chargerText}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
      <SetViewOnStation selectedStation={selectedStation} />
    </MapContainer>
  );
}

