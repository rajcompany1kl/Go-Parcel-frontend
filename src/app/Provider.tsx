import { RouterProvider } from 'react-router'
import { Router } from './Routes'
import AuthProvider from '../shared/context/AuthContext'
import { MapProvider } from '../shared/context/MapContext'
import ToasterProvider from '../shared/context/ToasterContext'
import SocketProvider from '../shared/context/SocketContext'

const Provider = () => {
  return <ToasterProvider>
    <MapProvider>
      <AuthProvider>
        <SocketProvider>
        <RouterProvider router={Router}/>
        </SocketProvider>
    </AuthProvider>
    </MapProvider>
  </ToasterProvider>
}

export default Provider