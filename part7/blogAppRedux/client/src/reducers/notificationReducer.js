import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
  },
})

export const { changeNotification } = notificationSlice.actions

export const setTempNotification = (type, text, seconds) => {
  return async (dispatch) => {
    dispatch(changeNotification({ type, text }))
    setTimeout(() => {
      dispatch(changeNotification(''))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
