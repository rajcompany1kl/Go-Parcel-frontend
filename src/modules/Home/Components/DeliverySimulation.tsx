import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { useMap } from '../../../shared/hooks/useMap';
import { DeliveryMarker } from '../../../shared/components/ui/markers';

interface DeliverySimulationProps {
    routeCoordinates: L.LatLng[];
}

const DeliverySimulation: React.FC<DeliverySimulationProps> = ({ routeCoordinates }) => {
    const { mapInstance } = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const intervalRef = useRef<number | null>(null);

    const deliveryIcon = useMemo(() => L.icon(DeliveryMarker), []);

    useEffect(() => {
        if (!mapInstance || routeCoordinates.length === 0) {
            console.log("returning")
            return;
        }

        console.log("delivery simulation")
        let step = 0;
        const startPosition = routeCoordinates[0];
        
        markerRef.current = L.marker([startPosition.lat, startPosition.lng], { icon: deliveryIcon })
            .addTo(mapInstance)
            .bindPopup("Delivery Person");

        intervalRef.current = window.setInterval(() => {
            step++;

            if (step >= routeCoordinates.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            const nextCoord = routeCoordinates[step];
            if (markerRef.current) {
                markerRef.current.setLatLng([nextCoord.lat, nextCoord.lng]);
            }
        }, 100);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (markerRef.current) {
                if (mapInstance) {
                    mapInstance.removeLayer(markerRef.current);
                }
                markerRef.current = null;
            }
        };
    }, [routeCoordinates, mapInstance, deliveryIcon]);

    return null;
};

export default DeliverySimulation;