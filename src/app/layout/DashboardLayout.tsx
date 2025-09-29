import React, { type JSX, type ReactNode } from 'react'
import Header from '../../shared/components/Header'
import Sidebar from '../../shared/components/Sidebar'

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='w-full h-full overflow-x-hidden max-w-screen'>
        <Header />
        <div className="w-full h-[90vh] flex align-center">
            <Sidebar />
            <div className="w-[80vw] h-[90vh] flex justify-center items-center p-5">
                { children }
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout