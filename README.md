# GenDoc AI – Generative AI-Based Technical Documentation Generator

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/example/gendoc-ai)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.13-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **“Turn Code Into Clear Documentation with AI.”**  
> An enterprise-grade, modern AI SaaS web application suitable for **CSE Mini-Projects, Final-Year Project Demonstrations, and Professional Portfolios**.

---

## 🌟 Executive Summary

**GenDoc AI** is an automated technical documentation generation platform powered by **Generative AI** and multi-language **AST (Abstract Syntax Tree)** semantic analysis. It automatically ingests source code files and repository ZIP archives, parses language structures (classes, functions, decorators, parameters, return types, and REST API routes), and synthesizes professional, publication-ready technical manuals, GitHub READMEs, and OpenAPI specifications.

Documents can be customized, edited with an interactive AI Copilot, and exported directly into **PDF (with custom ReportLab covers & page numbering)**, **DOCX (Microsoft Word)**, or **Markdown**.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      Presentation Layer (Frontend)                      │
│        React.js (v18) + Tailwind CSS + Lucide Icons + Recharts          │
│   Landing Page │ AI Dashboard │ AST Analyzer │ Markdown Live Editor     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST APIs & File Uploads (Port 8000)
┌────────────────────────────────────▼────────────────────────────────────┐
│                    API Gateway & Routing Layer (Backend)                │
│             FastAPI + Pydantic Request Validation + Uvicorn             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  Code Analysis   │       │ Generative AI    │       │ Document Export  │
│  AST Parser      │       │ Service Engine   │       │ Engine           │
│  - Python AST    │       │ - Prompt Models  │       │ - ReportLab PDF  │
│  - JS/TS Regex   │       │ - Gemini / OpenAI│       │ - python-docx    │
│  - Java/Spring   │       │ - AST Heuristics │       │ - Markdown (.md) │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Persistence Layer (Database)                        │
│          SQLite Storage (MySQL / PostgreSQL Ready Architecture)         │
│  Users │ Projects │ SourceFiles │ CodeElements │ Docs │ DocVersions     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **🎨 Premium Dark Navy / Blue / Purple AI SaaS UI:** Designed with frosted glass cards, soft glow gradients, responsive typography, and smooth transitions.
2. **⚡ Multi-Language AST Analysis:** Extracts classes, functions, arguments, return type annotations, docstrings, imports, dependencies, cyclomatic complexity, and REST endpoints (Flask, FastAPI, Express, Spring Boot).
3. **✨ Generative AI Technical Documentation:** Synthesizes 14 complete chapters including Architecture, Project Structure, Function Tables, and Future Scope.
4. **💬 Floating AI Assistant (“Ask GenDoc AI”):** Context-aware drawer with quick prompts (*"Make Simpler"*, *"Make More Technical"*, *"Add API Examples"*, *"Add Mermaid Sequence Diagram"*).
5. **📑 Multi-Format Export Engine:**
   - **PDF:** Custom header, footer with `"Page X of Y"`, syntax-highlighted code boxes, styled tables via ReportLab.
   - **DOCX:** Executive typography and heading hierarchy via `python-docx`.
   - **Markdown:** Clean GitHub Flavored Markdown.
6. **🌐 REST API Documentation Generator:** Auto-detects endpoints (`GET`, `POST`, `PUT`, `DELETE`), parameters, request bodies, responses, and status codes.
7. **📝 AI README Generator:** Produces production-ready `README.md` files with shields.io badges and installation guides.
8. **🔍 Interactive Code Explainer:** Split-screen sandbox providing algorithmic breakdown, complexity analysis, and auto-generated docstrings.
9. **📊 Telemetry & Analytics Dashboard:** Visualized using Recharts (language distribution pie charts, monthly documentation velocity, processing speed curves).
10. **📦 Pre-Seeded Realistic Demo:** Includes **Student Management System** (18 files, 47 functions, 12 classes, 15 APIs) ready to explore immediately with 1-click Demo Login.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18.3, Vite 5.4, Tailwind CSS 3.4 | Responsive AI SaaS Web Application |
| **Icons & Charts** | Lucide React, Recharts 2.12 | UI Icons, Telemetry Visualizations |
| **Backend** | Python 3.12, FastAPI, Uvicorn | High-performance Asynchronous REST Server |
| **Code Parser** | Python AST, Regex Heuristics | Abstract Syntax Tree Element Extraction |
| **Generative AI** | Prompt Engineering + Gemini / OpenAI / Local AST | Non-hallucinated Technical Documentation |
| **Document Export** | ReportLab 5.0, python-docx 1.2 | PDF and DOCX Document Generation |
| **Database** | SQLite3 (MySQL Dialect Ready) | Relational Schema & Version Control |

---

## 💻 Installation & Setup Guide

### 1. Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** or modern npm environment

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python backend dependencies
pip install fastapi uvicorn python-multipart pydantic python-docx reportlab requests

# Initialize SQLite database and seed demo dataset
python database.py

# Start FastAPI server (Port 8000)
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI server will be running at: `http://127.0.0.1:8000`  
Interactive OpenAPI Swagger documentation: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

Frontend application will be accessible at: `http://localhost:5173`

---

### 4. One-Click Windows Launcher

On Windows systems, double-click **`start_app.bat`** from the root folder to automatically launch both backend and frontend servers simultaneously.

---

## 🧭 Step-by-Step Workflow & Usage

1. **Access Application:** Open `http://localhost:5173` in your browser.
2. **Sign In:** Click **Login** and use **1-Click Instant Demo Login (Alex Rivera)** to enter the workspace immediately.
3. **Upload Code / Project:** Navigate to **Upload Code** and drag-and-drop a ZIP archive or individual Python, JavaScript, Java, or C++ files.
4. **Analyze Code:** Navigate to **AI Code Analyzer** to watch the real-time AST analysis pipeline extract classes, functions, and endpoints. Click on any function to view its purpose and time complexity.
5. **Generate Documentation:** Navigate to **Generate Documentation**, check desired chapters, pick a tone (*Professional, Technical, Simple, Academic*), and click **✨ Generate Documentation with AI**.
6. **Live Edit & AI Copilot:** Open the **Documentation Editor**, customize sections, and open **✨ Ask GenDoc AI** to apply real-time modifications.
7. **Export Document:** Click **PDF**, **DOCX**, or **Markdown** to download the generated specification.
8. **Explore Specialized Tools:** Try the **README Generator**, **API Documentation Generator**, **Code Explainer**, and **Analytics Dashboard**.

---

## 🛡️ Security & Quality Standards

- **Zero Exposure of API Keys:** All AI API credentials are saved server-side via environment variables or settings.
- **Strict File Type Validation:** Disallows malicious executable extensions.
- **Non-Hallucinatory Documentation:** Built using deterministic AST extraction to ensure generated parameter names and class definitions match the exact source code.
- **Developer Review Disclaimer:** All generated documentation explicitly prompts developer review before production deployment.

---

## 👥 Academic & Portfolio Demonstration

| Attribute | Details |
| :--- | :--- |
| **Project Title** | GenDoc AI – Generative AI-Based Technical Documentation Generator |
| **Course Domain** | Artificial Intelligence, Software Engineering, NLP & Compilers |
| **Target Platforms** | Web, Cloud, Docker-ready |
| **Presentation Scope** | Complete end-to-end working system with interactive live demo |

---

*Developed with ❤️ by the GenDoc AI Team.*
