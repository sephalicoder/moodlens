const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')
const Mood = require('../models/Mood')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Analyze mood + save to DB
router.post('/analyze', async (req, res) => {
  const { message, userId } = req.body

  if (!message) return res.status(400).json({ error: 'No message provided' })

  try {
    const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a mood analysis AI. Analyze the emotional tone of the user's message.
Respond ONLY with valid JSON in this exact format, nothing else:
{
  "mood": "one word mood label",
  "emoji": "one relevant emoji",
  "intensity": "low | medium | high",
  "signals": "one sentence explaining what in their writing revealed this mood",
  "response": "a warm 2-sentence empathetic response to the user"
}`
        },
        { role: 'user', content: message }
      ]
    })

    const raw = completion.choices[0].message.content
    const parsed = JSON.parse(raw)

    // Save to MongoDB if userId provided
    if (userId) {
      await Mood.create({
        userId,
        message,
        mood: parsed.mood,
        emoji: parsed.emoji,
        intensity: parsed.intensity,
        signals: parsed.signals
      })
    }

    res.json(parsed)

  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Mood analysis failed' })
  }
})

// Get mood history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const entries = await Mood.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(entries)
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch history' })
  }
})

module.exports = router