import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useForm } from 'react-hook-form'
import "./MyForm.css"

// תיקון אייקון ברירת מחדל של Marker
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map1 = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // ברירת מחדל: לונדון
    const [mapZoom, setMapZoom] = useState(13);
    const mapRef = useRef(null);

    useEffect(() => {
        if (query) {
            const fetchAddresses = async () => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
                    );
                    const data = await response.json();
                    setSearchResults(data);
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                    setSearchResults([]); // נקה תוצאות במקרה של שגיאה
                }
            };
            fetchAddresses();
        } else {
            setSearchResults([]);
        }
    }, [query]);

    const handleResultClick = (result) => {
        setQuery(result.display_name);
        setSearchResults([]); // סגור את רשימת ההצעות
        setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
        setMapZoom(16);

        if (mapRef.current) {
            mapRef.current.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 16);
        }
    };


    let { register, handleSubmit, formState: { isValid, errors }, getValues } = useForm({ mode: "onBlur" });

    function save(values) {
        alert("הפרטים נשמרו בהצלחה " + JSON.stringify(values))
        // props.newW(values); // שולח את הנתונים להורה
    }


    // אתחול המצב ל"מחפש"
    // eslint-disable-next-line no-undef
    const [status, setStatus] = useState('מחפש');

    // פונקציה לשינוי הסטטוס ל"מבוטל"
    const cancelSearch = () => {
        setStatus('מבוטל');
    };


    return (
        <div>
            <form id='myform' onSubmit={handleSubmit(save)}>

                <input className='myInp' {...register("name", { required: true })} placeholder="name" type="text" />
                {errors.name && <div className='error-message'>שדה חובה</div>}
                {/* <input
                type="text"
                placeholder="חפש כתובת..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            /> */}
                <input className='myInp' {...register("address", { required: true })} placeholder="address" value={query}
                    onChange={(e) => setQuery(e.target.value)} type="text" />
                {errors.address && <div className='error-message'>שדה חובה</div>}
                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map((result) => (
                            <li key={result.place_id} onClick={() => handleResultClick(result)}>
                                {result.display_name}
                            </li>
                        ))}
                    </ul>
                )}

                <input className='myInp' {...register("fone", { required: true })} placeholder="fone" type="text" />
                {errors.fone && <div className='error-message'>שדה חובה</div>}


                <input className='myInp' {...register("mail", {
                    pattern: {
                        value: /^[A-Za-z]{3,5}@(co|com)$/, message: "מייל לא תקין"
                    }
                })} placeholder="mail" type="email" />
                {errors.mail && <div className='error-message'>{errors.mail.message}</div>}

                <input className='myInp' {...register("connection")} type="checkbox" /><label>connection</label>
                {errors.connection && <div className='error-message'>{errors.connection.message}</div>}

                <input className='myInp' {...register("coffeeMachine")} type="checkbox" /><label>coffeeMachine</label>
                {errors.coffeeMachine && <div className='error-message'>{errors.coffeeMachine.message}</div>}

                <input className='myInp' {...register("kitchen")} type="checkbox" /><label>kitchen</label>
                {errors.kitchen && <div className='error-message'>{errors.kitchen.message}</div>}

                <input className='myInp' {...register("room", {
                    // min: { value: 3, message: "מינימום 3 " }
                })} placeholder="num rooms" type="number" />
                {errors.room && <div className='error-message'>{errors.room.message}</div>}

                <input className='myInp' {...register("distance", {
                })} placeholder="distance" type="number" />
                {errors.distance && <div className='error-message'>{errors.distance.message}</div>}

                {/* <input type="radio" name="inSearch" id="" /><label htmlFor="">in search</label> */}

                <p>הסטטוס הנוכחי: {status}</p>
                {status === 'מחפש' && (
                    <button onClick={cancelSearch}>בטל חיפוש</button>
                )}
                <input type="submit"  onClick={save} /><label htmlFor="">submit</label>

            </form>


            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '400px', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter}>
                    <Popup>{query}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map1;