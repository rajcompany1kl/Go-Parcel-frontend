import React, { createContext, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<{socket: Socket | null}>({
    socket: null
})

const SocketProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const socket = io("http://localhost:8080", { transports: ["websocket"] });
    return (
        <SocketContext.Provider value={{socket}}>{ children }</SocketContext.Provider>
    )
}

export default SocketProvider