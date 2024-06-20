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

blogRouter.delete("/:id", async (req, res)=>{
    try{
        await Blog.findByIdAndDelete(req.params.id)
        res.status(201).end()
    }
    catch(error){
        res.status(400).json({error: error.message})
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