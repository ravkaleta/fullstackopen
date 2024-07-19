import { Route, Routes } from 'react-router-dom'
import BlogList from './BlogList'
import BlogDetails from './BlogDetails'

const Blogs = () => {
  return (
    <Routes>
      <Route path='/' element={<BlogList />} />
      <Route path=':id' element={<BlogDetails />} />
    </Routes>
  )
}

export default Blogs
