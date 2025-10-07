import { RouterProvider } from 'react-router'
import { Router } from './Routes'
import AuthProvider from '../shared/context/AuthContext'
import { MapProvider } from '../shared/context/MapContext'

const Provider = () => {
  return <MapProvider>
    <AuthProvider>
      <RouterProvider router={Router}/>
    </AuthProvider>
  </MapProvider>
}

export default Provider