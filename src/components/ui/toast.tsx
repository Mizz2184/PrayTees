import * as React from "react"

const ToastContext = React.createContext<{}>({})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{}}>
      {children}
    </ToastContext.Provider>
  )
}

export function ToastViewport() {
  return <div id="toast-viewport" />
}

export function Toast() {
  return null
} 