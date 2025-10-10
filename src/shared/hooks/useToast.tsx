import { useContext } from "react";
import type { ToasterContextProps } from "../types";
import { ToasterContext } from "../context/ToasterContext";

export const useToaster = (): ToasterContextProps => {
    const context = useContext(ToasterContext);
    if (!context) {
      throw new Error('useToaster must be used within a ToasterProvider');
    }
    return context;
};