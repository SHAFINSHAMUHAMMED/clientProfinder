import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { Store,persistor } from './Redux/Store.jsx'
import {PersistGate} from 'redux-persist/integration/react'
import {GoogleOAuthProvider} from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId='477195637822-hkjon90c49srlbf75o58v11r5438or4e.apps.googleusercontent.com'>
    <App />
    </GoogleOAuthProvider>
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
