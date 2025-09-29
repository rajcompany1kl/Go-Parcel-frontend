import { RouterProvider } from 'react-router'
import { Router } from './Routes'
import AuthProvider from '../shared/context/AuthContext'
import { MapProvider } from '../shared/context/MapContext'

const Provider = () => {
  return <AuthProvider>
    <MapProvider>
      <RouterProvider router={Router}/>
    </MapProvider>
  </AuthProvider>
}

export default Provider