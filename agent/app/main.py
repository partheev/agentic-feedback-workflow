from build import run_setup

run_setup()

from datetime import datetime
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import FeedbackIn, FeedbackItem
from portia_service.workflows import handle_customer_feedback
import asyncio
from mongodb_client import db



app = FastAPI(title="Portia Feedback Backend", version="0.1.0")

# CORS: allow your local frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/feedback", response_model=list[FeedbackItem])
def list_feedback():
    return [{
        "_id": str(item["_id"]),
        "customer_email": item["email"],
        "customer_name": item["name"],
        "feedback_title": item["title"],
        "feedback_description": item["description"],
        "upvotes": item["upvotes"],
        "created_at": item.get("created_at", None)
    } for item in list(db.get_collection("feedback").find({}, {"_id": 1, "email": 1, "name": 1, "title": 1, "description": 1, "upvotes": 1, "created_at": 1, "updated_at": 1}))]

@app.post("/feedback", response_model=FeedbackItem)
async def submit_feedback(payload: FeedbackIn):
    
    # Run handle_customer_feedback in background
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, handle_customer_feedback, payload)
    
    return {
        "message": "Feedback submitted successfully"
    }

