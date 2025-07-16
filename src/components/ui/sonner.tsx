import * as React from "react"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          fontSize: '14px',
        },
      }}
    />
  )
} 