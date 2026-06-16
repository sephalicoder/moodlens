const mongoose = require('mongoose')

const moodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  mood: String,
  emoji: String,
  intensity: String,
  signals: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Mood', moodSchema)