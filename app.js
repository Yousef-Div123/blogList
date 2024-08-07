const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogRoutes = require("./controllers/blogs")
const userRoutes = require("./controllers/users")
const loginRouter = require('./controllers/login')
const logger = require("./utils/logger")
const usersRouter = require('./controllers/users')
const middleware = require("./utils/middleware")

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
})


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use("/api/blogs", blogRoutes)
app.use("/api/users", usersRouter)

app.use(middleware.errorHandler)


module.exports = app