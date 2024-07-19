import { useContext } from 'react'
import NotificationContext from '../contexts/notificationContext'

const Notification = () => {
  const { notification } = useContext(NotificationContext)

  if (!notification) return null

  const color = notification.type === 'error' ? 'red' : 'green'

  return (
    <h1
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: color,
        color: color,
      }}
    >
      {notification.text}
    </h1>
  )
}

export default Notification
