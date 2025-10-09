import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../../shared/hooks/useMap';
import RouteController from './RouteController';
import useAuth from '../../../shared/hooks/useAuth'
import { Socket } from 'socket.io-client';


// ✅ make props optional for flexibility
interface Props {
    socket: Socket | null;
}


const Map: React.FC<Props> = ({ socket }) => {
    const { delivery, role, user } = useAuth()

    console.log("Map component rendered with role:", role);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const { setMapInstance, setOrigin, setDestination } = useMap();
    const [_, setRouteCoordinates] = useState<L.LatLng[]>([]);

    function setDriverLocation(map: L.Map) {
        if (delivery) {
            
            const { lat, lng } = delivery.lastDriverLocation
             const newLatLng: L.LatLngTuple = [lat, lng];
             console.log(newLatLng);
             
        if (driverMarkerRef.current) {
           
            driverMarkerRef.current.setLatLng(newLatLng);
        } else {
           
            const newMarker = L.marker(newLatLng);
            newMarker.addTo(map);
            
          
            driverMarkerRef.current = newMarker;
        }

       
      //  map.setView(newLatLng, map.getZoom());
            
        }
    }
    ////////////////////

    // ✅ Only set up tracking if driver AND socket & driverId are defined
    useEffect(() => {
        console.log("hi")
        if (role !== 'driver') return;

        if(role === 'driver' && socket && user) {
            console.log("Setting up geolocation tracking for driver");
            if (!navigator.geolocation) {
                console.error("Geolocation not supported");
                return;
            }
    
            if (!mapInstanceRef.current) return;
    
            const map = mapInstanceRef.current;
            let marker: L.Marker | null = null;
    
    
            let lastSent = 0;
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const now = Date.now();
                    if (now - lastSent < 3000) return;
                    lastSent = now;
    
                    const { latitude, longitude } = pos.coords;
    
                    if (!marker) {
                        marker = L.marker([latitude, longitude]).addTo(map);
                    } else {
                        marker.setLatLng([latitude, longitude]);
                    }
                    map.setView([latitude, longitude], map.getZoom());
    
                    socket.emit('driver:location', {
                        driverId: user.id,
                        lat: latitude,
                        lng: longitude,
                        ts: Date.now(),
                    });
                },
                (err) => console.error("Geolocation error:", err),
                { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
            );
    
            return () => {
                if (marker) {
                    map.removeLayer(marker);
                }
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [role, socket, user]);

    /////////////////////
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, { center: [24.5854, 73.7125], zoom: 13 });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            mapInstanceRef.current = map;
            
            setMapInstance(map);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setMapInstance(null);
                setOrigin("")
                setDestination("")
            }
        };
    }, [setMapInstance]);
    useEffect(() => {
        if (mapInstanceRef.current) {
            
                setDriverLocation(mapInstanceRef.current);
            
        }
    }, [delivery]);

    return (
        <div id="home-map" ref={mapContainerRef} className="w-full mx-auto h-full rounded-2xl z-0">
            {mapInstanceRef.current && (
                <React.Fragment>
                    <RouteController onRouteFound={setRouteCoordinates} />
                    {/* <DeliverySimulation routeCoordinates={routeCoordinates} /> */}
                </React.Fragment>
            )}
        </div>
    );
};

export default Map;