import {useState, useEffect} from "react";
import FloatingSearch from "../components/layout/FloatingSearch"; 
import BrandingIsland from "../components/layout/BrandingIsland";
import UserIsland from "../components/layout/UserIsland";
import MapView from "../components/map/mapview";
import StationDetails from "../components/map/StationDetails";
import 'leaflet/dist/leaflet.css';
import '../styles/MapOverlay.css';

export default function Map() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(`http://localhost:9876/api/station`);
        const data = await response.json();
        setStations(data);
      } catch(error) {
        console.error("Error fetching pins",error);
      }
    };
    fetchStations();
  }, []);


  const handleMarkerClick = async (station) => {
    try {
      const res = await fetch(`http://localhost:9876/api/station/${station.station_id}`);
      const detailedData = await res.json();
      setSelectedStation(detailedData);
    } catch (err) {
      console.error("Error fetching details:",err);
    } 
  };

  return (
    <>
      <div style={{ position: "relative" ,height: "100vh" ,width: "100vw", overflow: "hidden"}}>
        {/*the floating UI layer*/}
        {/*these will sit on top of the map because of their z-index*/}
        <div className="map-overlay-wrapper"> 
        <BrandingIsland />
        <FloatingSearch on Search = {(query) =>console.log(query)} />
        <UserIsland />
        </div>
        
        {/* the map */}
        <MapView stations = {stations} onStationClick={handleMarkerClick} />
        
        {/* The Sliding Side Block & Overlay */}
        {selectedStation && ( //when selected station becomes not null, the side block opens
          <StationDetails 
            station={selectedStation}  //we pass the data into the sidebar to show it
            onClose={() => setSelectedStation(null)} 
          />
        )}
      </div>
    </>
  );
}

