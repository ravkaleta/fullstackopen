import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const addBlog = (blogData) => {
  console.log(token)
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, blogData, config)
  return request.then((response) => response.data)
}

const updateBlog = (blogData) => {
  const request = axios.put(`${baseUrl}/${blogData.id}`, blogData)
  return request.then((response) => response.data)
}

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then((response) => response.data)
}

export default { setToken, getAll, getById, addBlog, updateBlog, deleteBlog }
