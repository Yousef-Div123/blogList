const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require("./utils/config")
const blogRoutes = require("./controllers/blogs")
const logger = require("./utils/logger")

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

app.use("/api/blogs", blogRoutes)


module.exports = app