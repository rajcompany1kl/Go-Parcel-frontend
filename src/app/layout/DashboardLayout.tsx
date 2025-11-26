import React, { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Sidebar from '../../shared/components/Sidebar';
import ChatSection from '../../shared/components/ChatSection';
import useAuth from '../../shared/hooks/useAuth';

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='w-full h-full overflow-x-hidden max-w-screen'>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="w-full h-[90vh] flex relative">

        {/* Sidebar */}
        <div
          className={`
            ${isSidebarOpen ? 'block' : 'hidden'} 
            md:block 
            fixed 
            md:static 
            top-0 
            left-0 
            w-full 
            h-full 
            z-40 
            md:w-auto 
            md:h-auto 
            bg-white 
            md:bg-transparent
          `}
        >
          <Sidebar setIsSidebarOpen={setSidebarOpen} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-[80vw] h-[90vh] flex justify-center items-center p-5">
          {children}
        </div>

        {/* Chat Section */}
        <div className="fixed right-8 bottom-8 z-50">
          {role === 'admin' ? (
            <button
              onClick={() => navigate('/adminchat')}
              className="w-14 h-14 rounded-full shadow-xl bg-black text-white flex items-center justify-center hover:bg-gray-700 transition-all"
              aria-label="Toggle Chat"
            >
              💬
            </button>
          ) : ( role !== 'driver' &&
            <ChatSection />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;