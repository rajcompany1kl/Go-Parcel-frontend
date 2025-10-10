import { RouterProvider } from 'react-router'
import { Router } from './Routes'
import AuthProvider from '../shared/context/AuthContext'
import { MapProvider } from '../shared/context/MapContext'
import ToasterProvider from '../shared/context/ToasterContext'

const Provider = () => {
  return <ToasterProvider>
    <MapProvider>
      <AuthProvider>
        <RouterProvider router={Router}/>
      </AuthProvider>
    </MapProvider>
  </ToasterProvider>
}

export default Provider