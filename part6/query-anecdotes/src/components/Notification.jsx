import { useContext } from "react"
import NotificationContext from "../providers/NotificationContext"

const Notification = () => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5
    }

    const { notification } = useContext(NotificationContext)
    console.log(notification)
  
    if (!notification) return null

    return (
        <div style={style}>
            {notification}
        </div>
    )
}

export default Notification
