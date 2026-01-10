import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getMarkerIcon } from "../../utils/mapIcons";


export default function MapView({stations, onStationClick}) {
  return (
    <MapContainer //boss component , creates the map object
      center={[37.9838, 23.7275]}   // Athens
      zoom={13} //1 is the whole world, 18 is a street corner, 13 a city view
      style={{ height: "100%", width: "100%", }}
    // DEBUG
    >
      <TileLayer
	attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	url='https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}{r}.png?apikey=fb7a93ebc29a49cf9a8d94e56c00af61'
      />

      {stations && stations.map((station) => {
        return (
          <Marker
            key={station.station_id}
            position={[station.latitude, station.longitude]}
            //use the status directly from the databse result
            icon={getMarkerIcon(station.station_status)} // Apply the custom icon here
            eventHandlers={{
              click: () => {
                onStationClick(station); //this triggers the sidebar to open
              },
            }}
          >
          </Marker>
        );
      })}
    </MapContainer>
  );
}

