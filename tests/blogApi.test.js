const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./blogTestHelper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async ()=>{
    await Blog.deleteMany({})

    await helper.allBlogs()
})

test("correct amount of blogs", async ()=>{
    let response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.length, helper.blogs.length)
})

test("correct id format", async ()=>{
    let response = await api.get('/api/blogs')
    assert(response.body[0].id)
    assert(!response.body[0]._id)
})

test("to create new blog" , async ()=>{
    let newBlog = {
        title:"something",
        author: "someone",
        url:"https://something.someone.com",
        likes: 12
    }
    let response = await api.post("/api/blogs").send(newBlog).expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(response.body, {...newBlog, id:response.body.id})
    let currentBlogs = await api.get("/api/blogs")
    assert.strictEqual(currentBlogs.body.length, helper.blogs.length + 1)
})

test("if blog created without likes, the default number is 0" , async ()=>{
    let newBlog = {
        title:"something",
        author: "someone",
        url:"https://something.someone.com"
    }
    let response = await api.post("/api/blogs").send(newBlog).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
})

test("test for malformed input", async ()=>{
    let noTitle ={
        author: "someone",
        url:"https://something.someone.com"
    }

    let noUrl = {
        title:"something",
        author: "someone",
    }

    await api.post("/api/blogs").send(noTitle).expect(400)
    await api.post("/api/blogs").send(noUrl).expect(400) 
})

after(async () => {
    await mongoose.connection.close()
})