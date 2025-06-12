'use client'

import { Suspense } from 'react'
import VerifyEmailPage from './VerifyEmailPage'

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
}
