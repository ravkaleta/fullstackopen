import axios from 'axios'

const baseUrl = '/api/comments'

const addComment = async (commentData) => {
  const response = await axios.post(baseUrl, commentData)
  return response.data
}

export default { addComment }
