import { useContext } from "react";
import { MapContext } from "../context/MapContext";

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};