# ​ Feedback & Bug Triage AI Workflow

**Streamlining feedback handling** using Portia AI, MCP-powered services, MongoDB, and GitHub—built for small team, startups and lazy PMs...haha!

---

##  Table of Contents

1. [Problem & Solution](#problem--solution)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Architecture & Workflow](#architecture--workflow)  
5. [Setup & Run](#setup--run)  
6. [Demo & Screenshots](#demo--screenshots)  
7. [Contribution & Future Work](#contribution--future-work)  
8. [Team & Roles](#team--roles)  
9. [License](#license)  

---

## Problem & Solution

**Problem**: User feedback is crucial thing for agile team but it's the one that's getting ignored.
Why?
Lot of human effort and involvement is required.

Bug reports and user feedback often arrive incomplete, duplicated, or without proper context—resulting in lost insights, manual overhead, and delayed issue resolution.

**Solution**: We built an **AI-powered triage pipeline** using Portia and MCP to:

- Classify feedback report as **bug report or product feedback**.
- Validate bug quality and revert back to user if bug report is incomplete.
- Perform semantic duplicate feedbacks detection using MongoDB Atlas Vector Search.
- Automatically fetch potential fixes from the web (via Tavily).
- File GitHub issues for valid bugs with proper bug description, possible fixes and steps to reproduce.
- Store, upvote, and manage feedback with MongoDB.

This reduces human effort, surfaces emerging issues quickly, and ensures consistent quality triage.

---
## AI Agentic Workflow
<img width="10106" height="4705" alt="ai-feedback-2x" src="https://github.com/user-attachments/assets/f881de5c-9f04-4045-91ab-4bcc90b97033" />

---


## Features

- **Adaptive Quality Check**: Ensures bug submissions include all essential information.
- **Semantic Deduplication**: Uses vector embeddings and MongoDB’s vector search.
- **Live Web Insights**: Uses Tavily MCP to fetch and summarize potential solutions.
- **Auto Issue Filing**: Creates GitHub issues with full context and references.
- **Feedback Management**: Stores and upvotes feedback in MongoDB, tracks status and duplicates.

---

## Tech Stack

| Component         | Technology / Tool                                      |
|------------------|--------------------------------------------------------|
| AI Orchestration | [Portia SDK](https://docs.portialabs.ai/)             |
| Embeddings       | OpenAI                    |
| Vector DB        | MongoDB Atlas with Vector Search Index                 |
| MCP Tools        | GitHub MCP, MongoDB MCP, Resend mail, Tavily MCP       |
| Issue Tracking   | GitHub Issues                                          |
| Language         | Python 3.12                                            |
| Hosting          |  Netlify (Frontend) and Render (Backend)


**Note:** Implemented custom tools for semantic search and creating mongo docs with vector embeddings.
---


## Setup & Run

```bash
# Clone project
git clone https://github.com/partheev/agentic-feedback-workflow.git
cd agentic-feedback-workflow

# Run Backend
# Run build script which install dependencies & build mcp servers
sh ./build-script.sh

# Configure environment variables:
# - OPENAI_API_KEY
# - OPENAI_MODEL
# - OPENAI_EMBEDDING_MODEL
# - MONGODB_NAM
# - MONGODB_COLL
# - PORTIA_API_KEY
# - MONGODB_URI
# - GITHUB_OWNER
# - GITHUB_REPO
# - RESEND_API_KEY
# - SENDER_EMAIL_ADDRESS


# Run the FastAPI backend/agent
fastapi dev app/main.py

# Run FastAPI for production
fastapi run app/main.py
