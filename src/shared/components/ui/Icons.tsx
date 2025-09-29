import type { IconType } from "../../types";

export const Person: React.FC<Partial<IconType>> = (props) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z"/>
        </svg>
    )
}


export const CheckCircleIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
);

export const PlayIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

export const PauseIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
);

export const NavigationIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
    </svg>
);

export const ClockIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
);

export const MapPinIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

export const CalendarIcon: React.FC<Partial<IconType>> = (props) => (
    <svg {...props} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
    </svg>
);
