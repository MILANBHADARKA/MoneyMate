import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

function page() {
  return (
    <ProtectedRoute>
      <div className='h-screen w-screen'>page</div>
    </ProtectedRoute>
  )
}

export default page