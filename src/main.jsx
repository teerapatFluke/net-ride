import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

export const LIFF_ID = '2011538034-u50VZuPm'

// Initialize LINE LIFF SDK
if (typeof window !== 'undefined' && window.liff) {
  window.liff
    .init({ liffId: LIFF_ID })
    .then(() => {
      console.log('LINE LIFF initialized successfully')
    })
    .catch((err) => {
      console.warn('LINE LIFF init warning:', err)
    })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

