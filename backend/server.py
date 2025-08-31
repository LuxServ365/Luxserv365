from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, max_length=20, description="Phone number")
    propertyAddress: Optional[str] = Field(None, max_length=200, description="Property address")
    currentlyManaging: Optional[str] = Field(None, description="Current management status")
    message: Optional[str] = Field(None, max_length=1000, description="Message")

    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        if v:
            # Remove common phone formatting characters
            cleaned = ''.join(filter(str.isdigit, v))
            if len(cleaned) < 10:
                raise ValueError('Phone number must be at least 10 digits')
        return v

class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    propertyAddress: Optional[str] = None
    currentlyManaging: Optional[str] = None
    message: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

class OwnerMessageCreate(BaseModel):
    subject: str = Field(..., min_length=1, max_length=200, description="Message subject")
    message: str = Field(..., min_length=1, max_length=2000, description="Message content")
    priority: str = Field(default="normal", description="Message priority")
    ownerEmail: EmailStr = Field(..., description="Owner email address")
    ownerName: str = Field(..., min_length=1, max_length=100, description="Owner name")
    propertyAddress: str = Field(..., description="Property address")

    @validator('priority')
    def validate_priority(cls, v):
        allowed_priorities = ['low', 'normal', 'high', 'urgent']
        if v not in allowed_priorities:
            raise ValueError(f'Priority must be one of: {", ".join(allowed_priorities)}')
        return v

class OwnerMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subject: str
    message: str
    priority: str
    ownerEmail: str
    ownerName: str
    propertyAddress: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")
    readAt: Optional[datetime] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/contact", response_model=dict)
async def submit_contact_form(submission: ContactSubmissionCreate):
    try:
        # Create contact submission object
        contact_dict = submission.dict()
        contact_obj = ContactSubmission(**contact_dict)
        
        # Insert into database
        result = await db.contact_submissions.insert_one(contact_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Contact form submitted: {contact_obj.email}")
            return {
                "success": True,
                "data": contact_obj.dict(),
                "message": "Contact form submitted successfully"
            }
        else:
            raise Exception("Failed to insert contact submission")
            
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        return {
            "success": False,
            "error": "Unable to submit contact form",
            "message": str(e)
        }

@api_router.get("/contact")
async def get_contact_submissions():
    try:
        submissions = await db.contact_submissions.find().sort("createdAt", -1).to_list(1000)
        return {
            "success": True,
            "data": [ContactSubmission(**submission).dict() for submission in submissions]
        }
    except Exception as e:
        logger.error(f"Error retrieving contact submissions: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve contact submissions",
            "message": str(e)
        }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
