const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({})
    response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    try{        
        let result = await blog.save()
        response.status(201).json(result)
    }
    catch(error){
        if(error.name === "ValidationError"){
            response.status(400).json({error: error.message})
        }
    }

})

module.exports = blogRouter