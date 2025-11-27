import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { useMap } from '../../../shared/hooks/useMap';
import { DestinationMarker, OriginMarker } from '../../../shared/components/ui/markers';

interface RouteControllerProps {
    onRouteFound: (coordinates: L.LatLng[]) => void;
}

const RouteController: React.FC<RouteControllerProps> = ({ onRouteFound }) => {
    const { mapInstance, origin, destination, setRouteInfo, originCoords, destinationCoords, driverLoc } = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);
    const pickupMarkerRef = useRef<L.Marker | null>(null);
    const dropMarkerRef = useRef<L.Marker | null>(null);


    useEffect(() => {
        console.log("routeController useeffect called due to origin/dest")
        if (!mapInstance) return;

        const updateRoute = async () => {
            console.log("update route called from origin")
            // Remove old markers and routing
             pickupMarkerRef.current && mapInstance.removeLayer(pickupMarkerRef.current);
             dropMarkerRef.current && mapInstance.removeLayer(dropMarkerRef.current);
             routingControlRef.current && mapInstance.removeControl(routingControlRef.current);
             onRouteFound([]);

            const waypoints: L.LatLng[] = [];

            // Only push valid coordinates
            if (driverLoc?.[0] && driverLoc?.[1]) waypoints.push(L.latLng(driverLoc[0], driverLoc[1]));
            if (originCoords?.[0] && originCoords?.[1]) waypoints.push(L.latLng(originCoords[0], originCoords[1]));
            if (destinationCoords?.[0] && destinationCoords?.[1]) waypoints.push(L.latLng(destinationCoords[0], destinationCoords[1]));

            // Add markers
            if (originCoords?.[0] && originCoords?.[1]) {
                pickupMarkerRef.current = L.marker(originCoords, { icon: L.icon(OriginMarker) }).addTo(mapInstance)
                    .bindPopup(`Origin: ${origin}`);
            }
            if (destinationCoords?.[0] && destinationCoords?.[1]) {
                dropMarkerRef.current = L.marker(destinationCoords, { icon: L.icon(DestinationMarker) }).addTo(mapInstance)
                    .bindPopup(`Destination: ${destination}`);
            }

            // Only create route if at least 2 waypoints
            if (waypoints.length >= 2) {
                routingControlRef.current = (L as any).Routing.control({
                    waypoints,
                    router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                    show: false,
                    addWaypoints: false,
                    routeWhileDragging: false,
                    createMarker: () => null,
                }).on('routesfound', (e: any) => {
                    const route = e.routes[0];
                    if (route) {
                        setRouteInfo({ distance: route.summary.totalDistance, duration: route.summary.totalTime });
                        onRouteFound(route.coordinates || []);
                    }
                }).addTo(mapInstance);

                // Fit map bounds
                const markers = [pickupMarkerRef.current, dropMarkerRef.current].filter(Boolean) as L.Marker[];
                if (markers.length) {
                    console.log("markers length se")
                    const group = new L.FeatureGroup(markers);
                    // mapInstance.fitBounds(group.getBounds().pad(0.1));
                }
            } else if (waypoints.length === 1) {
                console.log("waypoints se")
                // mapInstance.setView(waypoints[0], 14);
            }
        };

        updateRoute();
    }, [mapInstance, originCoords, destinationCoords, origin, destination, setRouteInfo, onRouteFound]);


    useEffect(() => {
        console.log("routeController useeffect called")
        if (!mapInstance) return;

        const updateRoute = async () => {
            console.log("update route called from driver loc")
            // Remove old markers and routing
            // pickupMarkerRef.current && mapInstance.removeLayer(pickupMarkerRef.current);
            // dropMarkerRef.current && mapInstance.removeLayer(dropMarkerRef.current);
             routingControlRef.current && mapInstance.removeControl(routingControlRef.current);
            // onRouteFound([]);

            const waypoints: L.LatLng[] = [];

            // Only push valid coordinates
            if (driverLoc?.[0] && driverLoc?.[1]) waypoints.push(L.latLng(driverLoc[0], driverLoc[1]));
             if (originCoords?.[0] && originCoords?.[1]) waypoints.push(L.latLng(originCoords[0], originCoords[1]));
             if (destinationCoords?.[0] && destinationCoords?.[1]) waypoints.push(L.latLng(destinationCoords[0], destinationCoords[1]));

            // Add markers
            //   if (originCoords?.[0] && originCoords?.[1]) {
            //       pickupMarkerRef.current = L.marker(originCoords, { icon: L.icon(OriginMarker) }).addTo(mapInstance)
            //           .bindPopup(`Origin: ${origin}`);
            //   }
            //   if (destinationCoords?.[0] && destinationCoords?.[1]) {
            //       dropMarkerRef.current = L.marker(destinationCoords, { icon: L.icon(DestinationMarker) }).addTo(mapInstance)
            //           .bindPopup(`Destination: ${destination}`);
            //   }

            // Only create route if at least 2 waypoints
            if (waypoints.length >= 2) {
                routingControlRef.current = (L as any).Routing.control({
                    waypoints,
                    router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
                    show: false,
                    addWaypoints: false,
                    routeWhileDragging: false,
                    createMarker: () => null,
                }).on('routesfound', (e: any) => {
                    const route = e.routes[0];
                    if (route) {
                        setRouteInfo({ distance: route.summary.totalDistance, duration: route.summary.totalTime });
                        onRouteFound(route.coordinates || []);
                    }
                }).addTo(mapInstance);

                // Fit map bounds
                 const markers = [pickupMarkerRef.current, dropMarkerRef.current].filter(Boolean) as L.Marker[];
                 if (markers.length) {
                     console.log("markers length se")
                     const group = new L.FeatureGroup(markers);
                     // mapInstance.fitBounds(group.getBounds().pad(0.1));
                 }
            } else if (waypoints.length === 1) {
                console.log("waypoints se")
                // mapInstance.setView(waypoints[0], 14);
            }
        };

        updateRoute();
    }, [mapInstance, driverLoc, setRouteInfo, onRouteFound]);


    return null;
};

export default RouteController;
