import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../../../shared/hooks/useMap';
import RouteController from './RouteController';
import DeliverySimulation from './DeliverySimulation';

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const { setMapInstance } = useMap();
    const [routeCoordinates, setRouteCoordinates] = useState<L.LatLng[]>([]);

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [24.5854, 73.7125],
                zoom: 13,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);

            mapInstanceRef.current = map;
            setMapInstance(map);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setMapInstance(null);
            }
        };
    }, [setMapInstance]); 

    return (
        <div id="home-map" ref={mapContainerRef} className="w-full mx-auto h-full rounded-2xl shadow-xl">
            {mapInstanceRef.current && (
                <React.Fragment>
                    <RouteController onRouteFound={setRouteCoordinates} />
                    <DeliverySimulation routeCoordinates={routeCoordinates} />
                </React.Fragment>
            )}
        </div>
    );
};

export default Map;