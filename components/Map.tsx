
import { MapContainer, Marker, TileLayer, useMapEvents, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"



export default function Map(props: any) {
    const { position, zoom, formData, setFormData } = props
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormData((prevState: any) => ({
                    ...prevState,
                    coordinate: [lat, lng]
                }));
                console.log({ coordinates: [lat, lng] });
            },
        });

        return formData.coordinate.length === 0 ? null : (
            <Marker position={formData.coordinate}></Marker>
        );
    };
    return (
        <MapContainer
            style={{ height: "90%", width: "100%" }}
            center={[20.5937, 78.9629]}
            zoom={zoom || 10}
            minZoom={3} 
            scrollWheelZoom={true}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* <Marker position={position}>
                <div>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </div>
            </Marker> */}
            <LocationMarker />


        </MapContainer>
    )
}
