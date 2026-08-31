import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Inject Paystack inline script
const script = document.createElement('script')
script.src = 'https://js.paystack.co/v1/inline.js'
script.async = true
document.head.appendChild(script)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
