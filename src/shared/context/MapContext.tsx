import { createContext, useCallback, useState } from "react";
import type { ExtendedMapContextType, MapProviderProps, RouteInfo } from "../../modules/Home/types";
import useService from "../hooks/useServices";

export const MapContext = createContext<ExtendedMapContextType | undefined>(undefined);

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const services = useService()

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const clearRoute = () => {
    setOrigin('');
    setDestination('');
    setRouteInfo(null);
    setOriginCoords(null);
    setDestinationCoords(null);
  };

  const geocodeAddress = useCallback(async (address: string): Promise<[number, number] | null> => {
      if (!address.trim()) return null;
      try {
          const {data:results} = await services.home.getCoordinates(address)
          const primaryResult = Array.isArray(results) ? results[0] : results;

          if (primaryResult && primaryResult.lat && primaryResult.lon) {
              const lat = parseFloat(primaryResult.lat);
              const lon = parseFloat(primaryResult.lon);
              if (!isNaN(lat) && !isNaN(lon)) {
                  return [lat, lon];
              }
          }
          return null;
      } catch (error) {
          console.error('Geocoding error:', error);
          return null;
      }
  }, [services.home]);

  return (
    <MapContext.Provider value={{
      origin, destination,
      originCoords, destinationCoords,
      routeInfo,
      mapInstance,
      setOrigin, setDestination,
      setOriginCoords, setDestinationCoords,
      setRouteInfo,
      setMapInstance,
      clearRoute,
      geocodeAddress
    }}>
      {children}
    </MapContext.Provider>
  );
};