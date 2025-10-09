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
      <Header />
      <div className="w-full h-[90vh] flex relative">
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800 text-white"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

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
              className="w-14 h-14 rounded-full shadow-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all"
              aria-label="Toggle Chat"
            >
              💬
            </button>
          ) : (
            <ChatSection />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;