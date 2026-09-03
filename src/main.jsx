import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Research from './pages/Research.jsx'
import BreastCancer from './pages/BreastCancer.jsx'
import LungCancer from './pages/LungCancer.jsx'
import IhcAnalysis from './pages/IhcAnalysis.jsx'
import AiFoundationModel from './pages/AiFoundationModel.jsx'
import AboutOmicMind from './pages/AboutOmicMind.jsx'
import { usePathname } from './router.jsx'
import './index.css'

function Root() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const route = pathname.replace(/\/+$/, '')

  if (route === '/research') return <Research />
  if (route === '/solutions/breast-cancer') return <BreastCancer />
  if (route === '/solutions/lung-cancer') return <LungCancer />
  if (route === '/applications/ihc-analysis') return <IhcAnalysis />
  if (route === '/platform/ai-foundation-model') return <AiFoundationModel />
  if (route === '/company/about') return <AboutOmicMind />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
