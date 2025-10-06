import type { ReactNode } from "react";

export interface RouteInfo {
  distance: number;
  duration: number;
}

// inside useMap.ts
export type MapContextType = {
  origin: string;
  destination: string;
  originCoords: [number, number] | null;
  destinationCoords: [number, number] | null;
  setOrigin: (val: string) => void;
  setDestination: (val: string) => void;
  setOriginCoords: (coords: [number, number] | null) => void;
  setDestinationCoords: (coords: [number, number] | null) => void;
  clearRoute: () => void;
  routeInfo: { distance: number; duration: number } | null;
  setRouteInfo: (info: { distance: number; duration: number } | null) => void;
};

export interface ExtendedMapContextType extends MapContextType {
  mapInstance: L.Map | null;
  setMapInstance: React.Dispatch<React.SetStateAction<L.Map | null>>;
  geocodeAddress: (address: string) => Promise<[number, number] | null>;
}

export interface MapProviderProps {
  children: ReactNode;
}