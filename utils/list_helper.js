const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs)=>{
    return blogs.reduce((acc, blog)=>{
        acc += blog.likes
        return acc
    }, 0)
}

const favoriteBlog = (blogs) =>{
    return blogs.reduce((favBlog, currBlog) =>{
        if(currBlog.likes > favBlog.likes){
            return currBlog
        }
        else{
            return favBlog
        }
    })
}
  
const mostBlogs = (blogs) =>{
    let authors = blogs.reduce((acc, blog) =>{
        if(acc[blog.author]){
            acc[blog.author] += 1
        }
        else{
            acc[blog.author] = 1
        }
        return acc
    }, {})

    let author = Object.keys(authors)[0]
    Object.keys(authors).forEach(element => {
        if(authors[author] < authors[element]){
            author = element
        }
    });
    return {author: author, blogs: authors[author]}
}

const mostLikes = (blogs) =>{
    let authors = blogs.reduce((acc, blog) =>{
        if(acc[blog.author]){
            acc[blog.author] += blog.likes
        }
        else{
            acc[blog.author] = blog.likes
        }
        return acc
    }, {})

    let author = Object.keys(authors)[0]
    Object.keys(authors).forEach(element => {
        if(authors[author] < authors[element]){
            author = element
        }
    });
    return {author: author, likes: authors[author]}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}