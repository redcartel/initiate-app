import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppStateProvider } from '../../init-frontend/src/context/AppStateProvider'
import { BrowserRouter } from 'react-router'
import AppRoutes from './appRoutes'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  </StrictMode>,
)
