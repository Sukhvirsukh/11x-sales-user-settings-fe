import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient.ts'
import { Toaster } from './components/ui/toast.tsx'
import RootErrorBoundary from './components/shared/RootErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <App />
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>,
)
