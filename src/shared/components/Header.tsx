import { useEffect, useState } from 'react'
import { Person } from './ui/Icons'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { user } = useAuth()
  useEffect(()=>{
    if(user) {
      console.log(user)
    }
  },[user])
  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center px-10'>
        <span className="text-white text-2xl font-medium">Commute</span>
        <div className="w-full h-full flex justify-end items-center gap-x-5">
            <div className="w-fit h-12 px-2 text-white text-lg tracking-wide flex justify-center items-center">{user?.firstName} {user?.lastName}</div>
            <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
                <Person className='w-8 h-8 fill-white' />
            </div>
        </div>
    </div>
  )
}

export default Header