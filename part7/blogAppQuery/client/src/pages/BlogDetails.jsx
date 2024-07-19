import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useMutation } from '@tanstack/react-query'
import commentService from '../services/comments'

const BlogDetails = () => {
  const id = useParams().id

  const blogQuery = useQuery({
    queryKey: ['blog'],
    queryFn: () => blogService.getById(id),
  })

  const queryClient = useQueryClient()

  const likeBlogMutation = useMutation({
    mutationFn: async (blogId) => {
      const blog = await blogService.getById(blogId)
      const blogUpdate = {
        ...blog,
        likes: blog.likes + 1,
      }
      const updatedBlog = await blogService.updateBlog(blogUpdate)
      return updatedBlog
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blog'], updatedBlog)
    },
  })

  const addBlogMutation = useMutation({
    mutationFn: commentService.addComment,
    onSuccess: (addedComment) => {
      const blog = queryClient.getQueryData(['blog'])
      const updatedBlog = {
        ...blog,
        comments: blog.comments.concat(addedComment),
      }
      queryClient.setQueryData(['blog'], updatedBlog)
    },
  })

  if (blogQuery.isError) {
    return <div>Error fetching data</div>
  }

  if (blogQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const handleBlogLike = () => {
    likeBlogMutation.mutate(blog.id)
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    const comment = {
      text: event.target.comment.value,
      blogId: blog.id,
    }
    addBlogMutation.mutate(comment)
  }

  const blog = blogQuery.data
  console.log(blog)
  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes <button onClick={handleBlogLike}>like</button>
      </p>
      {blog.user && <p>Added by {blog.user.name}</p>}
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <input name='comment' />
        <button type='submit'>add comment</button>
      </form>
    </div>
  )
}

export default BlogDetails
