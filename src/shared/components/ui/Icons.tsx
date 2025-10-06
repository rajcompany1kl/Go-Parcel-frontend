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

export const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.42-.25.698-.453l.028-.022c.283-.226.568-.46.837-.708l.01-.009.019-.016a1 1 0 00.004-.99c-.004-.005-.008-.009-.013-.014a10.042 10.042 0 00-1.284-1.342A8.042 8.042 0 0110 2a8.042 8.042 0 014.228 11.087 10.042 10.042 0 00-1.283 1.342 1 1 0 00-.013.014.996.996 0 00.004.99l.019.016.01.009c.27.248.554.482.837.708l.028.022c.278.203.512.354.698.453a5.741 5.741 0 00.281.14l.018.008.006.003.002.001s.11.02.308.066l.003-.001z" clipRule="evenodd" />
    <path d="M10 8a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);