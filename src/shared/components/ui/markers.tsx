import type { IconOptions } from "leaflet";
import { destinationIcon, FerrariIcon, originIcon } from "./Icons";

export const DeliveryMarker: IconOptions = {
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(FerrariIcon),
  iconSize: [80, 50],
  iconAnchor: [40, 25],
  popupAnchor: [0, -25],
}

export const OriginMarker: IconOptions = {
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(originIcon),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
};

export const DestinationMarker: IconOptions = {
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(destinationIcon),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
};