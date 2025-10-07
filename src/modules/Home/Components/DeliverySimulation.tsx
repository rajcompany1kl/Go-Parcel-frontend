import React, { useEffect, useRef, useMemo, useState } from 'react';
import L from 'leaflet';
import { useMap } from '../../../shared/hooks/useMap';
import { DeliveryMarker } from '../../../shared/components/ui/markers';
import { calculateTravelTime, formatMillisecondsToTime } from '../../../shared/Utils';

interface DeliverySimulationProps {
    routeCoordinates: L.LatLng[];
}

const DeliverySimulation: React.FC<DeliverySimulationProps> = ({ routeCoordinates }) => {
    const { mapInstance } = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const [remainingTime, setRemainingTime] = useState<string | null>(null);

    const deliveryIcon = useMemo(() => L.icon(DeliveryMarker), []);

    useEffect(() => {
        if (!mapInstance || routeCoordinates.length < 2) {
            return;
        }

        const DELIVERY_SPEED_KMH = 50;

        const startPosition = routeCoordinates[0];
        markerRef.current = L.marker([startPosition.lat, startPosition.lng], { icon: deliveryIcon })
            .addTo(mapInstance);
        
        const calculateRemainingRoadDistance = (fromStep: number): number => {
            let totalDistance = 0;
            for (let i = fromStep; i < routeCoordinates.length - 1; i++) {
                totalDistance += routeCoordinates[i].distanceTo(routeCoordinates[i + 1]);
            }
            return totalDistance;
        };

        let currentStep = 0;

        const moveMarker = () => {
            if (currentStep >= routeCoordinates.length - 1) {
                setRemainingTime('Arrived');
                markerRef.current?.bindPopup(`Arrived at destination!`).openPopup();
                return;
            }

            const startPoint = routeCoordinates[currentStep];
            const endPoint = routeCoordinates[currentStep + 1];

            const segmentDistance = startPoint.distanceTo(endPoint);
            const durationMilliseconds = calculateTravelTime(segmentDistance, DELIVERY_SPEED_KMH);

            markerRef.current?.setLatLng([endPoint.lat, endPoint.lng]);

            // Calculate remaining time instead of distance
            const distanceToFinal = calculateRemainingRoadDistance(currentStep + 1);
            const timeToFinalMs = calculateTravelTime(distanceToFinal, DELIVERY_SPEED_KMH);
            const formattedTime = formatMillisecondsToTime(timeToFinalMs);

            setRemainingTime(formattedTime);
            markerRef.current?.bindPopup(`Delivery in progress...<br>Time remaining: ${formattedTime}`).openPopup();

            currentStep++;
            timeoutRef.current = window.setTimeout(moveMarker, durationMilliseconds);
        };

        // Calculate and set the initial total travel time
        const initialTotalDistance = calculateRemainingRoadDistance(0);
        const initialTotalTime = calculateTravelTime(initialTotalDistance, DELIVERY_SPEED_KMH);
        setRemainingTime(formatMillisecondsToTime(initialTotalTime));
        
        moveMarker();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (markerRef.current && mapInstance) {
                mapInstance.removeLayer(markerRef.current);
            }
        };
    }, [routeCoordinates, mapInstance, deliveryIcon]);

    return null;
};

export default DeliverySimulation;

