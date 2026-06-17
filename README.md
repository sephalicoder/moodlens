# 🧠 MoodLens

**MoodLens** is a full-stack AI-powered journaling app that detects the emotional tone of what you write in real time, saves your mood history, and visualizes your emotional trends over time.

🔗 **Live Demo:** [moodlens-two.vercel.app](https://moodlens-two.vercel.app/)

---

## ✨ Features

- **AI Mood Detection** — Powered by Llama 3.3 (via Groq API), analyzes text for mood, intensity, and emotional signals in real time
- **User Authentication** — Secure sign up, login, and password reset via Firebase Auth
- **Mood History** — Every entry is saved and timestamped, linked to your account
- **Insights Dashboard** — Visual trends including mood-over-time line chart, mood frequency breakdown, average mood score, and weekly mood summary
- **Responsive Chat Interface** — Conversational UI with live mood badges and explainable AI signals

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Recharts |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| AI / NLP | Groq API — Llama 3.3 70B |
| Authentication | Firebase Auth |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🧩 Architecture

```
React Frontend (Vercel)
        │
        ▼
Express Backend (Render) ──► Groq API (mood analysis)
        │
        ▼
   MongoDB Atlas (mood history storage)

Firebase Auth handles user identity across the frontend
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A free [Groq API key](https://console.groq.com)
- A free [MongoDB Atlas](https://mongodb.com/atlas) cluster
- A [Firebase](https://console.firebase.google.com) project with Email/Password auth enabled

### 1. Clone the repo
```bash
git clone https://github.com/sephalicoder/moodlens.git
cd moodlens
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Add your Firebase config in `frontend/src/firebase.js`.

Run the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📊 How Mood Detection Works

When a user sends a message, the backend sends it to the Groq API with a structured system prompt instructing the model to analyze:

- **Mood** — primary emotional state detected
- **Intensity** — low / medium / high
- **Signals** — what specifically in the writing (word choice, punctuation, tone) revealed the mood
- **Empathetic response** — a warm, context-aware reply

The result is stored in MongoDB linked to the user's Firebase UID, enabling historical tracking and trend analysis on the dashboard.

---

## 📁 Project Structure

```
moodlens/
├── backend/
│   ├── models/
│   │   └── Mood.js
│   ├── routes/
│   │   └── mood.js
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth.jsx
    │   │   ├── Chat.jsx
    │   │   ├── History.jsx
    │   │   └── Dashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── firebase.js
    │   └── App.jsx
    └── package.json
```

---

## 🔮 Future Improvements

- Multi-layer sentiment analysis combining VADER/TextBlob with LLM output for comparison
- Export mood history as PDF/CSV
- Weekly email summaries of mood trends
- Dark/light theme toggle

---

## 👤 Author

Built by [Sephali](https://github.com/sephalicoder) as a final year project demonstrating full-stack development, AI/LLM integration, and cloud deployment.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
