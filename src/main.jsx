import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import the event listener and the new overlay component
import './eventRouter'; 
import TaskOverlayApp from './components/TaskOverlayApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Inject the custom workspace overlay pages */}
    <TaskOverlayApp />
  </StrictMode>,
)