'use client'

import { Suspense } from 'react'
import SignInPage from './SignInPage'

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInPage />
    </Suspense>
  )
}
