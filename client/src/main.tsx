import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
// import './index_copy.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
// <Provider store={store}>
    // <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    // </BrowserRouter>
  // </Provider>
)
