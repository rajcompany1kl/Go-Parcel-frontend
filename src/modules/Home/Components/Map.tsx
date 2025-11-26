import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../../shared/hooks/useMap';
import RouteController from './RouteController';
import useAuth from '../../../shared/hooks/useAuth';
import { Socket } from 'socket.io-client';
import { DeliveryMarker } from '../../../shared/components/ui/markers';

// Props are optional for flexibility
interface Props {
    socket: Socket | null;
}

const Map: React.FC<Props> = ({ socket }) => {
    const [mapReady, setMapReady] = useState(false);

    const { delivery, role, user } = useAuth();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const { setMapInstance, setDriverLoc } = useMap();
    const [_, setRouteCoordinates] = useState<L.LatLng[]>([]);

    // Update driver marker location
    function setDriverLocation(map: L.Map) {
        if (!delivery?.lastDriverLocation) return;

        const { lat, lng } = delivery.lastDriverLocation;
        if (!lat || !lng) return;

        const newLatLng: L.LatLngTuple = [lat, lng];

        if (driverMarkerRef.current) {
            setDriverLoc(newLatLng as [number, number]);
            driverMarkerRef.current.setLatLng(newLatLng);
        } else {
            setDriverLoc(newLatLng as [number, number]);
            driverMarkerRef.current = L.marker(newLatLng, { icon: L.icon(DeliveryMarker) }).addTo(map);
        }
    }

    // Driver real-time tracking via socket
    useEffect(() => {
        console.log("aya to")
        if (role !== 'driver' || !socket || !user) return;
        console.log("aya to 2")
        if (!mapInstanceRef.current) return;
        console.log("aya to 3")

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
            if (marker) map.removeLayer(marker);
            navigator.geolocation.clearWatch(watchId);
        };
    }, [role, socket, user, mapReady]);

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, { center: [24.5854, 73.7125], zoom: 13 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        mapInstanceRef.current = map;
        setMapInstance(map);
        setMapReady(true); // <-- IMPORTANT
        return () => {
            map.remove();
            mapInstanceRef.current = null;
            setMapInstance(null);
            setDriverLoc([0, 0]);
        };
    }, [setMapInstance, setDriverLoc]);

    // Update driver location when delivery changes
    useEffect(() => {
        if (mapInstanceRef.current) setDriverLocation(mapInstanceRef.current);
    }, [delivery]);

    return (
        <div id="home-map" ref={mapContainerRef} className="w-full mx-auto h-full rounded-2xl z-0">
            {mapInstanceRef.current && <RouteController onRouteFound={setRouteCoordinates} />}
        </div>
    );
};

export default Map;
