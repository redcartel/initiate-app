import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './AppRoutes'
import { AppStateProvider } from './context/AppStateProvider.tsx'
import { BrowserRouter } from 'react-router'
import { initialState } from './context/initialState.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider initialState={initialState}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  </StrictMode>
)
