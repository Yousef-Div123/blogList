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

test("delete a blog with valid id", async () =>{
    let blog = (await api.get("/api/blogs")).body[0]
    let id = blog.id
    await api.delete(`/api/blogs/${id}`).expect(201)
})

test("try to delete a blog with invalid id", async () =>{
    let id = '15315321'
    await api.delete(`/api/blogs/${id}`).expect(400)
})

test("update a blog with valid id", async () =>{
    let blog = (await api.get("/api/blogs")).body[0]
    let id = blog.id

    let newBlog = {
        title:"something",
        url:"https://something.someone.com",
        likes: 30
    }
    await api.put(`/api/blogs/${id}`).send(newBlog).expect(200)
})

test("try to update a blog with invalid data", async () =>{
    let blog = (await api.get("/api/blogs")).body[0]
    let id = blog.id

    let newBlog = {
        title:"something",
        url:"https://something.someone.com",
        likes: "hi"
    }
    await api.put(`/api/blogs/${id}`).send(newBlog).expect(400)
})

test("try to update a blog with invalid id", async () =>{
    let id = '15315321'

    let newBlog = {
        title:"something",
        url:"https://something.someone.com",
        likes: 30
    }

    await api.put(`/api/blogs/${id}`).send(newBlog).expect(400)
})

after(async () => {
    await mongoose.connection.close()
})