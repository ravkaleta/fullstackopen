import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const setTempNotification = (type, text, seconds) => {
    notificationDispatch({ type: 'SET', payload: { type, text } })
    setTimeout(() => {
      notificationDispatch({ type: 'RESET' })
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch, setTempNotification }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
