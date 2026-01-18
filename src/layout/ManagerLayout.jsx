import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const ManagerLayout = () => {
  return (
    <div className="h-[100vh] overflow-hidden  bg-gray-100">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className=" overflow-auto h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  )
}

export default ManagerLayout