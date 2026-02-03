## 🏰 Wonderland Theme Park Chatbot

An AI-powered, full-stack chatbot designed to provide accurate, friendly, and real-time information about WonderWorld Theme Park.

This project showcases clean software architecture, separation of concerns, modern frontend practices, and responsible AI integration using OpenAI.

---

## ✨ Overview

The Wonderland Theme Park Chatbot acts as a virtual customer support agent for park visitors.
It answers questions about:

- 🎟️ Ticket prices & passes
- 🕰️ Park hours & schedules
- 🎢 Rides & attractions by age group
- 🍽️ Dining & hotels
- 🎉 Shows, events, and accessibility services
  All responses are grounded in **official park documentation** and strictly avoid hallucinated information.

---

## 🚀 Live Demo:

👉 **coming soon**

---

## 🧠 Key Features

🤖 AI-Powered Conversations

- Uses **OpenAIResponses API**
- Maintain conversational context per user
- Deterministic output (low temperature)
- Never invents information outside the park guide

🧱 Clean Architecture (Backend)

- Controllers → Services → Repositories
- Clear validation boundaries (Zod)
- Single responsibility per layer
- No business logic in controllers

💬 Modern Chat UI (Frontend)

- Real-time chat experience
- Typing indicator animation
- Message sounds for UX feedback
- Auto-scrolling chat history
- Markdown-rendered responses

🔒 Input Validation & Safety

- Server-side request validation
- Prompt length limits
- Graceful error handling
- Controlled AI instructions

---

## 🏗️ Architecture

Monorepo Structure

```
Wonderland-Theme-Park-Chatbot/
├── packages/
│   ├── client/        # React + Vite frontend
│   └── server/        # Express + OpenAI backend
```

---

Backend Architecture (`packages/server`)

```
server/
├── controllers/       # HTTP layer (Express)
│   └── chat.controller.ts
├── services/          # Business & AI logic
│   └── chat.service.ts
├── repositories/      # Conversation state
│   └── conversation.repository.ts
├── prompts/           # AI prompt sources
│   ├── chatbot.txt
│   └── WonderWorld.md
├── index.ts           # Server entry point
├── routes.ts          # API routes
```

Layer Responsibilities
| Layer | Responsibiltity |
|-------|-----------------|
| Controller | Request validation & HTTP responses |
| Service | AI interaction & conversation flow |
| Repository | Conversation state management |
| Prompts | Source-of-truth domain knowledge |

🧠 Design goal: predictable behavior, testability, and maintainability.

---

Frontend Architecture (`packages/client`)

```
client/src/
├── components/
│   └── chat/
│       ├── ChatBot.tsx
│       ├── ChatInput.tsx
│       ├── ChatMessages.tsx
│       └── TypingIndicator.tsx
├── assets/
│   └── sounds/
```

Component Responsibilty
| Component | Responsibiltity |
|-------|-----------------|
| ChatBot | State orchestration and API calls |
| ChatInput | Form handling & keyboard UX |
| ChatMessages | Message rendering and auto-scrool|
| TypingIndicator | Visual feedback during AI response |

---

## 📸 Screenshots

![Wonderland Chatbot UI](./pictures/chat-ui.png)
![Wonderland Chatbot UI](./pictures/chat-ui1.png)

---

## 🧠 AI Prompt Strategy

**Controlled Prompt Injection**

- `WonderWorld.md` acts as the **single source of truth**
- `chatbot.txt`enforces strict responses rules:
   - No hallucinations
   - Cheerful, concise tone
   - Clarifying questions when needed
   - Official ticket link for pricing questions

```
Use the park information below as the only source of truth.
Do not invent information.
```

This ensures **trustworthy, production-style AI behaviour.**

---

## 🔄 Conversation Continuity

- Each user session generates a unique **conversationId**
- Previous response IDs are stored in memory
- Enables contextual follow-up questions

Note: In-memory storage resets on server restart (intentional simplicity for demo purposes)

---

## 🛠️ Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Axios
- React Markdown

**Backend**

- Node.js + TypeScript
- Express
- Zod (validation)
- OpenAI Responses API
- File-based prompt loading

**Tooling**

- Bun
- ESLint

---

## 🚀 Getting Started

1️⃣ Clone the repository

```
git clone https://github.com/your-username/Wonderland-Theme-Park-Chatbot.git
cd Wonderland-Theme-Park-Chatbot
```

2️⃣ Setup environment variables

```
cp packages/server/.env.example packages/server/.env
```

Add your OpenAI API key:

```
OPENAI_API_KEY=your_key_here
```

3️⃣ Install dependencies

```
bun install
```

4️⃣ Run the app

```
bun run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:300`

## 👤 Author

Lina Chioma Anaso Software Engineering Student | Full-Stack Developer

📍 Germany

GitHub: https://github.com/Chiomalina

LinkedIn: https://linkedin.com/in/lina-chioma-anaso
