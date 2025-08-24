

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

DB_NAME = os.getenv("MONGODB_NAME")


mongo_client = MongoClient(MONGODB_URI)
db = mongo_client.get_database(DB_NAME)






