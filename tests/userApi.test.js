const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () =>{
    await User.deleteMany({})
})

test("username length should be bigger than 3", async ()=>{
    let newUser = {
        name: "yousef",
        username: "yo",
        password: "12345"
    }

    await api.post("/api/users").send(newUser).expect(400)
})

test("password length should be bigger than 3", async () =>{
    let newUser = {
        name: "yousef",
        username: "yousef",
        password: "12"
    }

    await api.post("/api/users").send(newUser).expect(400)
})

after(async () => {
    await mongoose.connection.close()
})