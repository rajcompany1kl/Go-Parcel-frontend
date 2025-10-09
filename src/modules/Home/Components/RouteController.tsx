import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { useMap } from '../../../shared/hooks/useMap';
import useService from '../../../shared/hooks/useServices';

interface RouteControllerProps {
    onRouteFound: (coordinates: L.LatLng[]) => void;
}

const RouteController: React.FC<RouteControllerProps> = ({ onRouteFound }) => {
    const { mapInstance, origin, destination, setRouteInfo, geocodeAddress, originCoords, destinationCoords } = useMap();
    const services = useService();
    const routingControlRef = useRef<L.Routing.Control | null>(null);
    const pickupMarkerRef = useRef<L.Marker | null>(null);
    const dropMarkerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapInstance) return;

        const updateRoute = async () => {
            if (pickupMarkerRef.current) mapInstance.removeLayer(pickupMarkerRef.current);
            if (dropMarkerRef.current) mapInstance.removeLayer(dropMarkerRef.current);
            if (routingControlRef.current) mapInstance.removeControl(routingControlRef.current);
            onRouteFound([]);

            const waypoints: L.LatLng[] = [];
            if (originCoords) {
                pickupMarkerRef.current = L.marker(originCoords).addTo(mapInstance).bindPopup(`Origin: ${origin}`);
                waypoints.push(L.latLng(originCoords));
            }
            if (destinationCoords) {
                dropMarkerRef.current = L.marker(destinationCoords).addTo(mapInstance).bindPopup(`Destination: ${destination}`);
                waypoints.push(L.latLng(destinationCoords));
            }

            if (waypoints.length >= 2) {
                routingControlRef.current = (L as any).Routing.control({
                    waypoints,
                    router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                    show: false, addWaypoints: false, routeWhileDragging: false, createMarker: () => null,
                }).on('routesfound', (e: any) => {
                    const route = e.routes[0];
                    if (route) {
                        setRouteInfo({ distance: route.summary.totalDistance, duration: route.summary.totalTime });
                        onRouteFound(route.coordinates || []);
                    }
                }).addTo(mapInstance);

                if (pickupMarkerRef.current && dropMarkerRef.current) {
                    const group = new L.FeatureGroup([pickupMarkerRef.current, dropMarkerRef.current]);
                    mapInstance.fitBounds(group.getBounds().pad(0.1));
                }
            } else if (waypoints.length === 1) {
                mapInstance.setView(waypoints[0], 14);
            }
        };

        updateRoute();
    }, [mapInstance, originCoords, destinationCoords, geocodeAddress, setRouteInfo, onRouteFound]);

    return null;
};

export default RouteController;