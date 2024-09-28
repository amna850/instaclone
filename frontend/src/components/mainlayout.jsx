import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidenav'

const MainLayout = ({children}) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
     <div className="w-1/4 bg-white border-r">
         <Sidebar/>
         </div>
         <div className="flex-1">
         <main>{children}</main>
         </div>
        
    </div>
  )
}

export default MainLayout


