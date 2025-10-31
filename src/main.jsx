import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { AuthProvider } from './components/AuthContext/index.jsx'
import { ConversationProvider } from './components/ConversationContext/index.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <ConversationProvider>
        <App/>
      </ConversationProvider>
    </AuthProvider>
)
