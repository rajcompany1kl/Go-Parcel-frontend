import React from 'react'
import ChatSection from './UserComponents/ChatSection'
import { useParams } from 'react-router'

const HomeTemplate = () => {
  const { id: deliveryCode } = useParams();
  console.log("Delivery code from URL:", deliveryCode);

  return (
    
      <div className="w-full h-full flex justify-center items-center ">
       Delivery Info Page
       
       <div className="fixed right-8 bottom-8 z-50">
          <ChatSection />
       </div>
      </div>
    
  )
}

export default HomeTemplate