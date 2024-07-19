import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './contexts/notificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './contexts/UserContext'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.scss'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </UserProvider>
  </NotificationProvider>
)
