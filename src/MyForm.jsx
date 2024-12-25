// ייבוא של useForm לסיוע בניהול הטופס
import { useForm } from 'react-hook-form'
import "./MyForm.css"

// ייבוא ספריית Leaflet להצגת מפה אינטראקטיבית
import "./Map.css"
import { MapContainer, WMSTileLayer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // חשוב לייבא את ה-CSS של Leaflet

// ייבוא שימוש במצב (state) והפניה (ref)
import { useState, useRef } from 'react';

// הפונקציה הראשית המרכיבה את הקומפוננטה
export default function User() {

    // שימוש ב-useForm לניהול הטופס (ולידציות, שמירת נתונים, וכו')
    let { register, handleSubmit, formState: { isValid, errors }, getValues } = useForm({ mode: "onBlur" });

    // פונקציה לשמירת נתונים מהטופס
    function save(values) {
        alert("הפרטים נשמרו בהצלחה " + JSON.stringify(values))
        // props.newW(values); // שולח את הנתונים להורה
    }
    
    // מצב לאחסון כתובת שהוזנה
    const [adress, setAdress] = useState()
    // מצב להגדרת המיקום ההתחלתי של המפה
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // ברירת מחדל: לונדון
    // מצב לקביעת רמת הזום במפה
    const [mapZoom, setMapZoom] = useState(13);
    // הפניה לאובייקט המפה
    const mapRef = useRef(null);
    // מצב לשמירת תוצאות החיפוש של כתובת
    const [query, setQuery] = useState([]);

    // פונקציה לחיפוש כתובת ב-OpenStreetMap
    function addressFetch() {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${adress}&limit=5`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                // console.log(adress)
                setQuery(data) // שמירת תוצאות החיפוש במצב
            })
            .catch(err => console.log(err));
    };

    // פונקציה שמתעדכנת עם הקלדה בשדה הכתובת
    function chandeAddress(e) {
        setAdress(e.target.value)
        // console.log(e.target.value)
        if (adress)
            addressFetch(adress)
    }

    // פונקציה שמעדכנת את המיקום של המפה על פי התוצאה שנבחרה
    function setMap(index) {
        console.log(query[index])
        let map = [query[index].lat, query[index].lon]
        setMapCenter(map) // עדכון מיקום המפה
        setAdress(query[index].display_name) // עדכון הכתובת שנבחרה
        // console.log(map)
        setMapZoom(16);

        if (mapRef.current) {
            mapRef.current.flyTo([query[index].lat, query[index].lon], 16); // זז למיקום החדש במפה
        }
    }

    // מצב ברירת מחדל של סטטוס
    const [status, setStatus] = useState('מחפש');

    // פונקציה לביטול החיפוש
    const cancelSearch = () => {
        setStatus('מבוטל');
    };

    // מבנה ה-JSX של הקומפוננטה
    return <> 
        <form id='myform' onSubmit={handleSubmit(save)}>
            <h1>Registration form</h1>
            
            {/* שדה להזנת שם */}
            <label>name</label>
            <input className='myInp' {...register("name", { required: true })} placeholder="שדה חובה" type="text" />
            {errors.name && <div className='error-message'>שדה חובה</div>}

            {/* שדה להזנת כתובת */}
            <label>address</label>
            <input className='myInp' {...register("address", { required: true })} placeholder="שדה חובה" type="text" onChange={chandeAddress} />
            {errors.address && <div className='error-message'>שדה חובה</div>}

            {/* הצגת תוצאות חיפוש כתובת */}
            {query.map((item, index) => (
                <p key={index} onClick={() => { setMap(index) }} className='p'>
                    {item.display_name}
                </p>
            ))}

            {/* שדה להזנת טלפון */}
            <label>fone</label>
            <input className='myInp' {...register("fone", { required: true })} placeholder="שדה חובה" type="text" />
            {errors.fone && <div className='error-message'>שדה חובה</div>}

            {/* שדה להזנת מייל */}
            <label>mail</label>
            <input className='myInp' {...register("mail", {
                pattern: {
                    value:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "מייל לא תקין"
                }
            })} type="email" />
            {errors.mail && <div className='error-message'>{errors.mail.message}</div>}

            {/* שדות לבחירת אופציות שונות */}
            <div id='myChecksbox'>
                <input className='myInpC' {...register("connection")} type="checkbox" /><label>connection</label>
                <input className='myInpC' {...register("coffeeMachine")} type="checkbox" /><label>coffeeMachine</label>
                <input className='myInpC' {...register("kitchen")} type="checkbox" /><label>kitchen</label>
            </div>

            {/* שדות למספר חדרים ומרחק */}
            <label>num rooms</label>
            <input className='myInp' {...register("room")} type="number" />

            <label>distance</label>
            <input className='myInp' {...register("distance")} type="number" />

            {/* סטטוס ותצוגת כפתור לביטול חיפוש */}
            <p>הסטטוס הנוכחי: {status}</p>
            {status === 'מחפש' && (
                <button onClick={cancelSearch}>בטל חיפוש</button>
            )}

            <br/>
            <br/>

            <input type="submit" onClick={save} />
        </form>

        {/* תצוגת מפה אינטראקטיבית */}
        <MapContainer id='myMap' center={mapCenter}
            zoom={mapZoom}
            style={{ height: '500px', width: '100%' }}
            ref={mapRef}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCenter}>
                <Popup>
                    {adress}<br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    </>
}
