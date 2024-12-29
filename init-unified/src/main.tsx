import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppStateProvider } from './context/AppStateProvider'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { dummyState } from './context/dummyState'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider initialState={dummyState}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  </StrictMode>,
)
