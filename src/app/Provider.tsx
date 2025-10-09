import { RouterProvider } from 'react-router'
import { Router } from './Routes'
import AuthProvider from '../shared/context/AuthContext'
import { MapProvider } from '../shared/context/MapContext'
import SocketProvider from '../shared/context/SocketContext'

const Provider = () => {
  return <MapProvider>
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={Router}/>
      </SocketProvider>
    </AuthProvider>
  </MapProvider>
}

export default Provider