import { createContext, useState } from "react";
import type { ExtendedMapContextType, MapProviderProps, RouteInfo } from "../../modules/Home/types";

export const MapContext = createContext<ExtendedMapContextType | undefined>(undefined);

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
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
      clearRoute
    }}>
      {children}
    </MapContext.Provider>
  );
};