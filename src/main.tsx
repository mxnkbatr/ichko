import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { initTheme } from './lib/theme'
import { I18nProvider } from './lib/i18n'

initTheme('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider defaultLang="mn">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
)
