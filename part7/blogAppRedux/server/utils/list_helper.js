const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {

    return blogs.reduce((best, blog) => {
        if(!best || best.likes < blog.likes) {
            return blog
        }
        return best
    }, null)
}

const mostBlogs = (blogs) => {

    if(blogs.length === 0){
        return null
    }

    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})

    const authorWithMostBlogs = Object.keys(authorCounts).reduce((most, author) => {
        return !most || authorCounts[most] < authorCounts[author] ? author : most
    }, null)

    return {
        author: authorWithMostBlogs,
        blogs: authorCounts[authorWithMostBlogs]
    }
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) {
        return null
    }

    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + blog.likes
        return counts
    }, {})

    const authorWithMostLikes = Object.keys(authorCounts).reduce((most, author) => {
        return !most || authorCounts[most] < authorCounts[author] ? author : most
    }, null)

    return {
        author: authorWithMostLikes,
        likes: authorCounts[authorWithMostLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}