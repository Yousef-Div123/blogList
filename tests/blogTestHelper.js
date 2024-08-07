require("mongoose")
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]

const allBlogs = async ()=>{
  for(let blog of blogs){
      let newBlog = new Blog(blog)
      newBlog.user = getUser()._id
      await newBlog.save()
  }
}

const createUser = async () =>{
  let passwordHash = await bcrypt.hash("1234", 10)
  let userData = {
    name:"Yousef",
    username:"Yousef",
    passwordHash
  }

  let user = new User(userData)
  await user.save()
}

const getUser = async () =>{
  let user = await User.findOne()
  return user
}

const getToken = async () =>{
  let user = await getUser()
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return "Bearer "+token.toString()
}

module.exports = {
    allBlogs,
    blogs,
    createUser,
    getUser,
    getToken
}