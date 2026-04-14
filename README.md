# LawGuide India ⚖️

> A production-grade RAG platform for Indian Law — simplifying legal access for citizens with semantic search, dual-LLM routing, multilingual support, and strict safety guardrails.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.15.0-339933?logo=node.js)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10.11-3776AB?logo=python)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🧭 Overview

Legal information in India is often inaccessible due to complex legal jargon, language barriers, and lack of affordable consultation. Citizens struggle to understand their rights, file FIRs, or navigate the justice system without professional help.

**LawGuide India** bridges that gap. Any citizen can type a question in plain English or any Indian language and receive a grounded, cited, safety-validated legal explanation — powered by the actual text of Indian law (BNS, BNSS, CrPC, IPC, and more).

This is **not** a chatbot wrapping a generic LLM. It is a proper **Retrieval-Augmented Generation (RAG)** system with a multi-stage pipeline: retrieve → rerank → generate → validate → translate.

---

## ✨ Features

- 🔍 **Semantic Legal Search** — Query Indian law in natural language; retrieves exact legal sections from a vector database
- 🤖 **Dual-LLM Routing** — Llama-3 on Groq for fast intent classification; GPT-4o-mini for precise, safe answer generation
- 🔄 **Cross-Encoder Reranking** — Refines vector retrieval results for higher precision
- 🛡️ **Safety Guardrails** — Built-in validation layer flags high-risk responses and prevents hallucinations
- 🌐 **Multilingual Support** — Translates answers into Indian languages via a dedicated translation layer
- 🔐 **JWT Authentication** — Secure user sessions with access & refresh token rotation
- 💬 **Persistent Chat Sessions** — Full conversation history stored per user

---

## 🏗️ Architecture

```
Browser (React + Vite)
       │  HTTPS / JSON (Axios + JWT Bearer)
       ▼
Backend API (Node.js + Express + TypeScript)
       │  Prisma ORM
       ├──► PostgreSQL  (Users, Sessions, Messages, LegalSections)
       │
       │  Internal HTTP
       ▼
AI Microservice (Python + FastAPI)
       │  SentenceTransformer encode
       ├──► Qdrant Vector DB  (legal section embeddings)
       │
       ├──► Groq API   (Llama-3 — intent classification)
       └──► OpenAI API (GPT-4o-mini — answer generation)
```

The backend is a **Node.js monolith** handling auth, session management, and acting as a gateway to the AI microservice. The AI microservice is a fully separate **Python FastAPI service** that owns all intelligence: embedding, retrieval, reranking, generation, validation, and translation.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React + Vite | 19.2.0 / 7.2.4 |
| Styling | Tailwind CSS | 3.4.18 |
| Backend | Node.js + Express | 22.15.0 / 4.18.2 |
| Language | TypeScript | 5.3 |
| ORM | Prisma | 5.22.0 |
| Database | PostgreSQL | (via `pg` 8.11) |
| AI Service | Python + FastAPI | 3.10.11 / 0.110.0 |
| Embeddings | Sentence-Transformers (`all-MiniLM-L6-v2`) | 2.7.0 |
| Vector DB | Qdrant | 1.9.0 |
| LLM | OpenAI (GPT-4o-mini) + Groq (Llama-3) | ≥1.55.0 |
| Translation | deep-translator | — |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v22+
- Python 3.10+
- PostgreSQL (local or Docker)
- Qdrant (local or Docker)
- OpenAI API Key
- Groq API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/Dacchu2004/lawGuide.git
cd lawGuide
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lawguide"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
AI_MICROSERVICE_URL=http://localhost:8000
PORT=3001
```

Run database migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

---

### 3. AI Microservice Setup

```bash
cd ai-microservice
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `ai-microservice/`:

```env
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=legal_sections
```

Start the AI microservice:

```bash
uvicorn main:app --reload --port 8000
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 📁 Project Structure

```
lawGuide/
├── frontend/               # React + Vite + Tailwind CSS
│   └── src/
│       ├── pages/          # HomePage, ChatPage, AuthPage, etc.
│       ├── components/     # Reusable UI components
│       ├── api/            # Axios client + endpoint wrappers
│       └── context/        # AuthContext, ChatContext
│
├── backend/                # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/         # Auth, Chat, Session routes
│       ├── controllers/    # Business logic
│       ├── middleware/      # JWT auth, error handling
│       └── prisma/         # Schema + migrations
│
└── ai-microservice/        # Python + FastAPI
    ├── core/
    │   └── pipeline.py     # Full RAG pipeline (embed → retrieve → rerank → generate → validate)
    ├── services/
    │   ├── llm.py          # Dual-LLM routing (Groq + OpenAI)
    │   ├── embeddings.py   # SentenceTransformer encoding
    │   ├── reranker.py     # Cross-encoder reranking
    │   └── translation.py  # Multilingual output
    └── config.py           # Centralised configuration
```

---

## ⚙️ RAG Pipeline (How It Works)

```
User Query
    │
    ▼
1. EMBED      — Encode query with all-MiniLM-L6-v2
    │
    ▼
2. RETRIEVE   — Semantic search in Qdrant (hybrid: state + central law filters)
    │
    ▼
3. RERANK     — Cross-encoder reranks top results for precision
    │
    ▼
4. GENERATE   — GPT-4o-mini generates answer grounded in retrieved sections
    │
    ▼
5. VALIDATE   — Second LLM pass checks for high-risk / hallucinated content
    │
    ▼
6. TRANSLATE  — deep-translator converts output to user's language
    │
    ▼
Cited, Safe, Multilingual Legal Answer
```

---

## 🔒 Authentication Flow

- JWT-based auth with **access token** (short-lived) + **refresh token** (long-lived)
- Refresh token rotation on every silent re-auth
- All protected routes validated via Express middleware
- Passwords hashed with `bcrypt`

---

## 🌐 Supported Legal Domains

- Criminal Law (BNS / IPC)
- Family Law
- Consumer Protection Law
- Property Law
- Cyber & IT Law
- Constitutional Law
- Civil Law
- Labour Law

---

## 🔮 Roadmap

- [ ] **Docker Compose** — Single command to spin up all services
- [ ] **Offline LLM** — Local Llama 3 (quantized) to reduce OpenAI dependency
- [ ] **Automated Testing** — `pytest` for AI service, `Jest` for backend
- [ ] **FIR Filing Guide** — Step-by-step procedural assistant
- [ ] **Lawyer Directory** — Connect users to verified legal aid near them

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss any significant changes.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Dacchu2004**
- GitHub: [@Dacchu2004](https://github.com/Dacchu2004)

---

> **Disclaimer:** LawGuide India provides legal *information*, not legal *advice*. Always consult a qualified lawyer for matters requiring professional legal counsel.
