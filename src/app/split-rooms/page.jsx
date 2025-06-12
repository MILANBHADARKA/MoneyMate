import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

function page() {
  return (
    <ProtectedRoute>
      <div className='h-screen w-screen'>page</div>
    </ProtectedRoute>
  )
}

export default page