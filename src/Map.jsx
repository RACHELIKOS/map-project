import "./Map.css"

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // חשוב לייבא את ה-CSS של Leaflet

import L from 'leaflet';


export default function Map() {

    const position = [51.505, -0.09]
    const [adress, setAdress] = useState([])
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // ברירת מחדל: לונדון
    const [mapZoom, setMapZoom] = useState(13);
    //const mapRef = useRef(null);
    const [query, setQuery] = useState('אופקים');

    useEffect(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setAdress(data[0]); // Assuming the first result in the data is the relevant address
          })
          .catch(err => console.log(err));
      }, [query]);

    return <>
        <MapContainer id='myMap' center={mapCenter}
            zoom={mapZoom}
            style={{ height: '400px', width: '100%' }}
            // ref={mapRef}
            scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCenter}>
                <Popup>
                    {query}<br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    </>
}

