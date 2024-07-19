import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setTempNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      console.log('like')
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      dispatch(setTempNotification('error', 'Failed to fetch blogs', 5))
    }
  }
}

export const appendBlog = (blogData) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.addBlog(blogData)
      dispatch(addBlog(newBlog))
      dispatch(
        setTempNotification(
          'success',
          `Added new blog ${newBlog.title} by ${newBlog.author}`,
          5
        )
      )
    } catch (error) {
      dispatch(setTempNotification('error', 'Failed to add new blog', 5))
    }
  }
}

export const likeBlog = (blogId) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.getById(blogId)
      const blogUpdate = {
        ...blog,
        likes: blog.likes + 1,
      }
      const updatedBlog = await blogService.updateBlog(blogUpdate)
      dispatch(updateBlog(updatedBlog))
    } catch (error) {
      setTempNotification('error', 'Failed to like blog', 5)
    }
  }
}

export const removeBlog = (blogId) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blogId)
      dispatch(deleteBlog(blogId))
    } catch (error) {
      setTempNotification('error', 'Failed to delete blog', 5)
    }
  }
}

export default blogSlice.reducer
