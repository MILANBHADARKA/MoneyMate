'use client'

import { Suspense } from 'react'
import ResetPasswordPage from './ResetPasswordPage'

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}
