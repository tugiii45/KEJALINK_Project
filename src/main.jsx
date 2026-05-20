/**
 * Application Entry Point
 * 
 * This is the first file that runs when the app starts.
 * It:
 * 1. Creates the React root in the HTML div#root element
 * 2. Wraps the app with StrictMode (for development warnings)
 * 3. Wraps the app with Redux Provider (makes store available to all components)
 * 4. Renders the App component which sets up routing
 */

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './App/Store.js'

// Mount React app to the DOM and enable Redux + routing
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

