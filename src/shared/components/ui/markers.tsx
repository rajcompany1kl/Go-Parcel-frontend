import type { IconOptions } from "leaflet";

export const DeliveryMarker: IconOptions = {
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1a73e8" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 15.5c-1.25 0-2.45-.78-2.83-1.92L16.2 9H12V4H4v11H2v3h2.3c-.64 1.11-1.02 2.44-1.02 3.7 0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.26-.38-2.59-1.02-3.7H18v-3h3v-2.5zM6 14.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S8.33 16 7.5 16 6 15.33 6 14.5zm9 6c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>'),
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
}