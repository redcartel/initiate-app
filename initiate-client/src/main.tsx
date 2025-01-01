import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './typography.css'
import './index.css'
import { AppRouter } from './AppRouter.tsx'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from './Context/SessionProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>,
)
