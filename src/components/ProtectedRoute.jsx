'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import Loader from '@/components/loader/Loader'

const ProtectedRoute = ({ children, redirectTo = '/sign-in' }) => {
  const { isAuthenticated, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return <Loader text="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default ProtectedRoute
