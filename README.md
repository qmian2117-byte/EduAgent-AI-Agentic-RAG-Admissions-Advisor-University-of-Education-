# EduAgent-AI-Agentic-RAG-Admissions-Advisor-University-of-Education-

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2%2B-blueviolet.svg)](https://github.com/langchain-ai/langgraph)
[![Groq Cloud](https://img.shields.io/badge/LLM-Groq%20Cloud-orange.svg)](https://groq.com/)
[![FAISS](https://img.shields.io/badge/VectorStore-FAISS-green.svg)](https://github.com/facebookresearch/faiss)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**EduAgent AI** is an enterprise-grade **Agentic RAG Admissions Advisor** custom-built for **University of Education (UE)**. Orchestrated via **LangGraph** and powered by **Groq Cloud LLMs**, it combines dense semantic retrieval, deterministic AST safe mathematical fee calculations, multi-turn conversational session memory, and strict zero-hallucination institutional guardrails.

---

## 🏛️ Architecture Blueprint

```
+---------------------------------------------------------------------------------+
|                                 STUDENT / USER                                  |
+---------------------------------------------------------------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   LangGraph Agent State       |
                         |   (Messages + Session State)  |
                         +-------------------------------+
                                         |
                                         +<=============> [ MemorySaver Checkpointer ]
                                         |                (Thread-scoped Session Memory)
                                         v
                         +-------------------------------+
                         |      Groq Cloud LLM           |
                         |      (LLM Reasoning Cycle)    |
                         +-------------------------------+
                                         |
                     +-------------------+-------------------+
                     | (Needs Tool)                          | (Direct / Guardrail Answer)
                     v                                       v
         +-----------------------+                    +--------------+
         |      ToolNode         |                    |  Final User  |
         +-----------------------+                    |   Response   |
           /         |         \                     +--------------+
          /          |          \
         v           v           v
  +-------------+ +----------+ +-------------------------+
  |  FAISS RAG  | |   AST    | | Structured Fast Lookup  |
  |  Retrieval  | | Safe Math| |  (Programs & Campuses)  |
  +-------------+ +----------+ +-------------------------+
```

---

## 🚀 Key Features

1. **Autonomous ReAct Agent (LangGraph State Machine)**:
   - Reasons over user intent dynamically, executing targeted tools before formulating verified answers.
   - Dynamic model discovery with auto-retry exponential backoff to handle token limits seamlessly.

2. **Dense Semantic RAG Retrieval (`university_rag_search`)**:
   - Indexes official University of Education policy documents and admissions handbook.
   - Fuzzy synonym matching with bilingual support for **English** and **Roman Urdu** (`"dakhla"`, `"kahan"`, `"fees"`, `"choro"`, `"bhai/sister"`).
   - High-precision coverage of all UE campuses (Jauharabad, Township, Lower Mall, Multan, Faisalabad, etc.) and public sector chartered status.

3. **Deterministic AST-Safe Calculator (`safe_calculator`)**:
   - Prevents LLM arithmetic hallucinations by routing mathematical calculations through an Abstract Syntax Tree (AST) evaluator.
   - Computes complex fee breakdowns, sibling discounts (10%), merit scholarships (50%), and credit hours reliably.

4. **Stateful Conversational Memory (`MemorySaver`)**:
   - Retains context across multi-turn dialogues.
   - Accurately resolves contextual references like *"what about that program?"* or *"if my sister also enrolls?"* without re-asking for program details.

5. **Strict Institutional Scope Guardrails**:
   - Specializes exclusively in University of Education admissions, eligibility, fees, campuses, and scholarships.
   - Zero hallucination policy: Politely declines unrelated external topics (general news, politics, other universities, unsupported medical degrees like MBBS/BDS) and redirects students to official resources.

6. **Full-Stack Glassmorphism Web Interface**:
   - Modern, responsive Dark-Themed UI with animated background meshes, real-time ReAct tool traces, interactive fee estimation calculator, quick-topic chips, and multi-thread session management.

---

## 📂 Project Structure

```
EduAgent-AI-Agentic-RAG-Admissions-Advisor-University-of-Education-/
├── .gitignore                           # Git ignore rules for Python & environments
├── README.md                            # Comprehensive project documentation
├── requirements.txt                     # Core dependencies for LangGraph & RAG
├── run_web.bat                          # One-click Windows startup script
├── server.py                            # Production HTTP server & API bridge
├── Agentic.ipynb                        # End-to-end LangGraph RAG notebook & benchmarks
├── HIST_Admissions_Knowledge_Base.pdf   # Official institutional PDF handbook
├── HIST_knowledge_base.json             # Structured chunk repository with metadata
├── faiss_index/                         # Pre-built FAISS dense vector store
│   ├── index.faiss                      # Vector index binary
│   └── index.pkl                        # Document store mappings
└── web/                                 # Enterprise Web Client
    ├── index.html                       # Responsive HTML5 chat arena & sidebar
    ├── style.css                        # Glassmorphic CSS design system
    └── app.js                           # Client-side agent controller & memory
```

---

## ⚡ Quick Start Guide

### Option 1: Run the Interactive Web Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/qmian2117-byte/EduAgent-AI-Agentic-RAG-Admissions-Advisor-University-of-Education-.git
   cd EduAgent-AI-Agentic-RAG-Admissions-Advisor-University-of-Education-
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the local server**:
   - On Windows: Double-click `run_web.bat` or run:
     ```bash
     python server.py
     ```
   - Open your browser at: **`http://localhost:8000`**

### Option 2: Run via Jupyter / Google Colab

1. Open `Agentic.ipynb` in **Jupyter Lab** or upload to **Google Colab**.
2. Run the notebook cells sequentially to initialize:
   - Dynamic Groq Model Discovery
   - PDF Loading & FAISS Vector Indexing
   - LangGraph StateGraph Compilation with `MemorySaver`
   - Complete 4-Scenario Benchmark Suite

---

## 🧪 Benchmark Suite & Verification Scenarios

| Scenario | Focus | Description | Result |
|---|---|---|---|
| **Scenario 1** | Single-Hop RAG | BSCS & BSAI eligibility criteria and HAT test waiver verification | ✅ Verified |
| **Scenario 2** | Multi-Step Reasoning | RAG BSCS fee retrieval + AST `safe_calculator` 50% Merit Aid | ✅ Verified |
| **Scenario 3** | Conversational Memory | Contextual follow-up for 10% sibling discount on the active program | ✅ Verified |
| **Scenario 4** | Guardrails & Refusal | Unsupported degree check (MBBS/BDS) and politics/out-of-scope queries | ✅ Verified |

---

## 🛡️ License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Contributions
Developed with precision for **University of Education (UE)** admissions advisory automation. Contributions and pull requests are welcome!
