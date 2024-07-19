import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

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
