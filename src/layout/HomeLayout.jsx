import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const HomeLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      {/* Top Header */}
      <Header />

      {/* Main Content */}
      <main className=" overflow-auto  h-[90vh]">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout