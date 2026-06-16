const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const moodRouter = require('./routes/mood')

const app = express()
app.use(cors())
app.use(express.json())

// Connect to MongoDB
// Replace your current mongoose.connect line with this:
mongoose.connect(process.env.MONGO_URI, {
  family: 4 // 💡 This forces Node to use IPv4 instead of getting tangled up in IPv6 DNS resolution
})
.then(() => console.log("🚀 Connected to MongoDB successfully!"))
.catch((err) => console.error("❌ MongoDB error:", err.message));

app.get('/', (req, res) => {
  res.json({ message: 'MoodLens backend is running!' })
})

app.use('/api/mood', moodRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})