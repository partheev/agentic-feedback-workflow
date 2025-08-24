import datetime
import os
from pathlib import Path
import json
from pydantic import BaseModel, Field
from portia.tool import Tool, ToolRunContext
from openai import OpenAI
from dotenv import load_dotenv
from bson.objectid import ObjectId

from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_NAME")
COLL_NAME = os.getenv("MONGODB_COLL")

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL")

SIMILARITY_THRESHOLD=0.80

# MongoDB
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client.get_database(DB_NAME)
coll = db.get_collection(COLL_NAME)


class InsertFeedbackSchema(BaseModel):
    """Schema defining the inputs for the InsertFeedback."""

    email: str = Field(...,
        description="The email of the user",
    )
    name: str = Field(...,
        description="The name of the user",
    )
    title: str = Field(...,
        description="The title of the feedback",
    )
    description: str = Field(...,
        description="The description of the feedback",
    )

class SemanticSearchForFeedbackSchema(BaseModel):
    """Schema defining the inputs for the SemanticSearchForFeedback."""

    title: str = Field(...,
        description="The title of the feedback",
    )
    description: str = Field(...,
        description="The description of the feedback",
    )

class UpvoteFeedbackSchema(BaseModel):
    """Schema defining the inputs for the UpvoteFeedback."""

    feedback_id: str = Field(...,
        description="The id of the feedback to upvote",
    )

class Utils:
    @staticmethod
    def generate_feedback_embedding(title: str, description: str) -> list[float]:
        """Generates an embedding for the feedback"""
        response = openai_client.embeddings.create(
            model=OPENAI_EMBEDDING_MODEL,
            input=f"{title}\n{description}"
        )

        embedding_vector = response.data[0].embedding
        return embedding_vector


class InsertFeedback(Tool[str]):
    """Inserts feedback into the mongodb database"""

    id: str = "insert_feedback"
    name: str = "Insert feedback"
    description: str = "Inserts feedback into the mongodb database"
    args_schema: type[BaseModel] = InsertFeedbackSchema
    output_schema: tuple[str, str] = ("str", "A string of the insertion status")

    def run(self, _: ToolRunContext, email: str, name: str, title: str, description: str) -> str:
        """Run the InsertFeedback."""

        embedding_vector = Utils.generate_feedback_embedding(title, description)
        # Insert the feedback into the database
        feedback = {
            "email": email,
            "name": name,
            "title": title,
            "description": description,
            "embedding": embedding_vector,
            "upvotes": 1,
            "created_at": datetime.datetime.now(datetime.UTC),
            "updated_at": datetime.datetime.now(datetime.UTC)
        }

        coll.insert_one(feedback)

        
        return "Feedback inserted successfully"



class SemanticSearchForFeedback(Tool[str]):
    """Performs semantic search for feedback in the mongodb database"""
    id: str = "semantic_search_for_feedback"
    name: str = "Semantic search for feedback"
    description: str = "Performs semantic search for feedback in the mongodb database"
    args_schema: type[BaseModel] = SemanticSearchForFeedbackSchema
    output_schema: tuple[dict, str] = ("dict", "Returns $semantic_search_result which is a dictionary containing the fields - found, found_id if similar feedback was found, otherwise found field is False and found_id is None")

    def run(self, _: ToolRunContext, title: str, description: str) -> bool:
        """Run the SemanticSearchForFeedback."""
        embedding_vector = Utils.generate_feedback_embedding(title, description)
        # Perform semantic search for the feedback
        pipeline = [
        {
            "$vectorSearch": {
                "index": "feedback_vector_index",
                "path": "embedding",
                "queryVector": embedding_vector,
                "numCandidates": 100,
                "limit": 1,
            }
        },
        {
            # Project vectorSearchScore into "score"
            "$project": {
                "_id": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        }]
        
        results = list(coll.aggregate(pipeline))

        top = results[0] if results else None

        print('top',results[0].get('score',None) if results else None)

        if top and float(top.get("score", 0.0)) >= SIMILARITY_THRESHOLD:
            return {
                "found": True,
                "found_id": str(top.get("_id"))
            }
        else:
            return {
                "found": False,
                "found_id": None
            }

class UpvoteFeedback(Tool[str]):
    """Upvotes a feedback document in the mongodb database"""
    id: str = "upvote_feedback"
    name: str = "Upvote feedback"
    description: str = "Upvotes a feedback document in the mongodb database"
    args_schema: type[BaseModel] = UpvoteFeedbackSchema
    output_schema: tuple[str, str] = ("str", "A string of the upvote status")

    def run(self, _: ToolRunContext, feedback_id: str) -> str:
        """Run the UpvoteFeedback."""
        try:
            object_id = ObjectId(feedback_id)
            
            result = coll.update_one({"_id": object_id}, {"$inc": {"upvotes": 1}})
            
            if result.matched_count == 0:
                return "Error: Feedback ID not found"
            
            return "Feedback upvoted successfully"
            
        except Exception as e:
            return f"Error upvoting feedback: {str(e)}"



