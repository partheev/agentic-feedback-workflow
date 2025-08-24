from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID, uuid4


# ----- API payloads -----

class FeedbackIn(BaseModel):

    customer_email: str = Field(min_length=3, max_length=140)
    customer_name: str = Field(min_length=3, max_length=140)
    feedback_description: str = Field(min_length=5)
    feedback_title: str = Field(min_length=5)



class FeedbackTriage(BaseModel):
    category: Literal["bug", "feature", "other"]
    severity: Literal["low", "medium", "high", "critical"]
    summary: str
    tags: List[str] = []

class FeedbackItem(BaseModel):
    _id: str
    customer_email: str
    customer_name: str
    feedback_title: str
    feedback_description: str
    upvotes: int
    created_at: Optional[datetime] = None

class FeedbackPayload(BaseModel):
    customer_email: str
    customer_name: str
    feedback_title: str
    feedback_description: str

class FeedbackSubmitResponse(BaseModel):
    message: str

