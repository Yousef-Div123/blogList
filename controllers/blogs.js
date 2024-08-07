const blogRouter = require("express").Router()
const jwt = require('jsonwebtoken')
const middleware = require("../utils/middleware")
const Blog = require("../models/blog")
const User = require("../models/user")

blogRouter.get('/', async (request, response) => {
    let blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    return response.json(blogs)
})
  
blogRouter.post('/', middleware.userExtractor ,async (request, response) => {
    
    try{
        const blog = new Blog(request.body)
        const user = request.user
        blog.user = user._id        
        let result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result)
    }
    catch(error){
        if(error.name === "ValidationError"){
            response.status(400).end()
        }
    }

})

blogRouter.delete("/:id", middleware.userExtractor, async (req, res)=>{
    try{
        let blog = await Blog.findById(req.params.id)

        if(req.user.id === blog.user.toString()){
            await blog.deleteOne()
            res.status(201).end()
        }else{
            res.status(401).end()
        }
    }
    catch(error){
        res.status(401)
    }
})

blogRouter.put("/:id", async (req, res) => {
    const body = req.body
  
    const blog = {
      title: body.title,
      url: body.url,
      likes: body.likes
    }
    try{
        let updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new:true, runValidators: true, context:"query"})
        updatedBlog = res.status(200).json(updatedBlog)
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
  })

module.exports = blogRouter