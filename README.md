# ​ Feedback & Bug Triage AI Workflow

**Streamlining feedback handling** using Portia AI, MCP-powered services, MongoDB, and GitHub—built for small team, startups and lazy PMs...haha!

---
#### Frontend Deployment link: https://ai-feedback.netlify.app/ (live)
#### Backend deployement link: https://agentic-feedback-workflow.onrender.com 
- Note: Backend will be down if there's no activity. And server will take time to respond in these scenarios
---

##  Table of Contents

1. [Problem & Solution](#problem--solution)
2. [AI Agentic Workflow](#ai-agentic-workflow)  
3. [Features](#features)  
4. [Tech Stack](#tech-stack)  
5. [Screenshots](#screenshots)  
6. [Run Project](#run-project)  

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


#### **Note:** Implemented custom tools for semantic search and creating mongo docs with vector embeddings.
---

# Screenshots

## For valid bug submission
<img width="1154" height="859" alt="Screenshot 2025-08-24 at 10 06 58 AM" src="https://github.com/user-attachments/assets/fe1e395f-3785-43e9-93be-a25a284fcf8c" />
<img width="1158" height="616" alt="Screenshot 2025-08-24 at 10 04 27 AM" src="https://github.com/user-attachments/assets/003436a3-6046-4143-9c53-0c28416b7ba4" />
<img width="1509" height="857" alt="Screenshot 2025-08-24 at 10 07 52 AM" src="https://github.com/user-attachments/assets/97d16b27-d32b-42df-a4a9-5daaaf9c94b3" />

### Check github issues here - https://github.com/partheev/agentic-feedback-workflow/issues
<img width="1512" height="909" alt="Screenshot 2025-08-24 at 10 08 31 AM" src="https://github.com/user-attachments/assets/ab449e08-8a44-40c2-9946-1c2bca31278b" />

<img width="1079" height="594" alt="Screenshot 2025-08-24 at 10 08 51 AM" src="https://github.com/user-attachments/assets/6e532533-857b-4835-bd8b-7153f00e9b8c" />

## For invalid bug summission
<img width="1142" height="847" alt="Screenshot 2025-08-24 at 3 01 28 PM" src="https://github.com/user-attachments/assets/ec95927a-3752-4c82-8292-0df2a51c400d" />
<img width="1186" height="385" alt="Screenshot 2025-08-24 at 3 30 52 PM" src="https://github.com/user-attachments/assets/6baa22a1-c602-4383-9f4c-98004f8bf8a5" />

## Feedback submission
<img width="1066" height="852" alt="Screenshot 2025-08-24 at 3 37 50 PM" src="https://github.com/user-attachments/assets/63257a75-9399-4a01-a632-a8fcde0f9799" />

#### Semantically simiar feedback
<img width="1076" height="850" alt="Screenshot 2025-08-24 at 3 37 27 PM" src="https://github.com/user-attachments/assets/0efe0051-4243-4880-9d7f-6c2435d7e506" />

#### Saved feedback document with upvotes 2
<img width="1075" height="196" alt="Screenshot 2025-08-24 at 3 47 38 PM" src="https://github.com/user-attachments/assets/70dcf0aa-cb15-4c8e-a45a-8b7e24474624" />


# Run Project
## Setup & Run Backend/Agent

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
# - MONGODB_NAME
# - MONGODB_COLL
# - PORTIA_API_KEY
# - MONGODB_URI
# - GITHUB_OWNER
# - GITHUB_REPO
# - RESEND_API_KEY
# - SENDER_EMAIL_ADDRESS
# - RECEIVER_EMAIL_ADDRESS ( we need to remove this field from env and code once we upgrade email service to premium, right now it only sends mails to verified emails )


# Run the FastAPI backend/agent
fastapi dev app/main.py

# Run FastAPI for production
fastapi run app/main.py
```

## Run Frontend

```bash
# Go to frontend directory
cd frontend-ui

# Install deps
npm run install

# Run the project
npm run dev

# Configure the env
# - VITE_API_URL
