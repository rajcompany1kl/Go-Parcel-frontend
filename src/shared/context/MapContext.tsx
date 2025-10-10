import { createContext, useCallback, useMemo, useState } from "react";
import type { ExtendedMapContextType, MapProviderProps, RouteInfo } from "../../modules/Home/types";
import useService from "../hooks/useServices";
import { useToaster } from "../hooks/useToast";

export const MapContext = createContext<ExtendedMapContextType | undefined>(undefined);

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const toast = useToaster()
  const services = useMemo(() => useService(toast.addToast), [toast.addToast])

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [driverLoc, setDriverLoc] = useState<[number, number]>([0,0]);

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
      geocodeAddress,
      driverLoc, setDriverLoc
    }}>
      {children}
    </MapContext.Provider>
  );
};