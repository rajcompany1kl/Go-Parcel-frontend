import React, { createContext, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<{socket: Socket | null}>({
    socket: null
})

const SocketProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const server = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const socket = io(server, { transports: ["websocket"] });
    return (
        <SocketContext.Provider value={{socket}}>{ children }</SocketContext.Provider>
    )
}

export default SocketProvider