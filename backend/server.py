from fastapi import FastAPI, APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import services after loading environment variables
from email_service import email_service
from telegram_service import telegram_service

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
REPORTS_DIR = UPLOAD_DIR / "reports"
REPORTS_DIR.mkdir(exist_ok=True)
PHOTOS_DIR = UPLOAD_DIR / "photos"
PHOTOS_DIR.mkdir(exist_ok=True)
GUEST_PHOTOS_DIR = UPLOAD_DIR / "guest_photos"
GUEST_PHOTOS_DIR.mkdir(exist_ok=True)

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

class InspectionReportCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Report title")
    notes: str = Field(..., min_length=1, max_length=5000, description="Inspection notes")
    ownerEmail: EmailStr = Field(..., description="Owner email address")
    propertyAddress: str = Field(..., description="Property address")
    inspectionDate: datetime = Field(default_factory=datetime.utcnow, description="Inspection date")

class InspectionReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    notes: str
    ownerEmail: str
    propertyAddress: str
    inspectionDate: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    reportFile: Optional[str] = None

class PhotoUpload(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    originalName: str
    ownerEmail: str
    propertyAddress: str
    caption: Optional[str] = None
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class GuestRequestCreate(BaseModel):
    guestName: str = Field(..., min_length=1, max_length=100, description="Guest full name")
    guestEmail: EmailStr = Field(..., description="Guest email address")
    guestPhone: Optional[str] = Field(None, max_length=20, description="Guest phone number")
    numberOfGuests: Optional[int] = Field(None, ge=1, le=20, description="Number of guests")
    propertyAddress: str = Field(..., min_length=1, max_length=200, description="Property address or name")
    checkInDate: str = Field(..., description="Check-in date")
    checkOutDate: str = Field(..., description="Check-out date")
    unitNumber: Optional[str] = Field(None, max_length=50, description="Unit or room number")
    requestType: str = Field(..., description="Type of request")
    priority: str = Field(default="normal", description="Request priority")
    message: str = Field(..., min_length=1, max_length=2000, description="Detailed request message")

    @validator('requestType')
    def validate_request_type(cls, v):
        allowed_types = [
            'property-issues',
            'housekeeping-requests',
            'pre-arrival-grocery-stocking',
            'concierge-services',
            'beach-recreation-gear',
            'transportation-assistance',
            'celebration-services',
            'emergency-urgent',
            'general-inquiry'
        ]
        if v not in allowed_types:
            raise ValueError(f'Request type must be one of: {", ".join(allowed_types)}')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        allowed_priorities = ['urgent', 'high', 'normal']
        if v not in allowed_priorities:
            raise ValueError(f'Priority must be one of: {", ".join(allowed_priorities)}')
        return v

class GuestRequestPhoto(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    originalName: str
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platformBookingId: str  # Airbnb/VRBO booking ID
    platform: str  # airbnb, vrbo, direct, etc.
    propertyId: str
    propertyAddress: str
    guestName: str
    guestEmail: str
    guestPhone: Optional[str] = None
    guestCount: int
    checkInDate: str
    checkOutDate: str
    bookingAmount: Optional[float] = None
    specialRequests: Optional[str] = None
    bookingStatus: str = Field(default="confirmed")
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class Property(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ownerId: str
    address: str
    propertyType: str  # condo, house, etc.
    bedrooms: int
    bathrooms: int
    maxGuests: int
    platformListings: dict = Field(default_factory=dict)  # {airbnb: "listing123", vrbo: "property456"}
    serviceLevel: str = Field(default="essential")  # essential, premium, elite
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class GuestRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bookingId: Optional[str] = None  # Link to booking
    guestName: str
    guestEmail: str
    guestPhone: Optional[str] = None
    numberOfGuests: Optional[int] = None
    propertyAddress: str
    checkInDate: str
    checkOutDate: str
    unitNumber: Optional[str] = None
    requestType: str
    priority: str
    message: str
    photos: List[GuestRequestPhoto] = Field(default_factory=list)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")
    respondedAt: Optional[datetime] = None
    internalNotes: List[str] = Field(default_factory=list)
    adminPhotos: List[GuestRequestPhoto] = Field(default_factory=list)
    lastUpdatedBy: Optional[str] = None
    lastUpdatedAt: Optional[datetime] = None

class AdminAuth(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    loginAt: datetime = Field(default_factory=datetime.utcnow)
    ipAddress: Optional[str] = None

class GuestRequestUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    internalNote: Optional[str] = None
    adminUsername: str

class AdminReply(BaseModel):
    requestId: str
    subject: str
    message: str
    adminUsername: str

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

@api_router.post("/messages", response_model=dict)
async def submit_owner_message(message: OwnerMessageCreate):
    try:
        # Create message object
        message_dict = message.dict()
        message_obj = OwnerMessage(**message_dict)
        
        # Insert into database
        result = await db.owner_messages.insert_one(message_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Owner message submitted: {message_obj.ownerEmail} - {message_obj.subject}")
            return {
                "success": True,
                "data": message_obj.dict(),
                "message": "Message sent successfully"
            }
        else:
            raise Exception("Failed to insert owner message")
            
    except Exception as e:
        logger.error(f"Error submitting owner message: {str(e)}")
        return {
            "success": False,
            "error": "Unable to send message",
            "message": str(e)
        }

@api_router.get("/messages/owner/{owner_email}")
async def get_owner_messages(owner_email: str):
    try:
        messages = await db.owner_messages.find({"ownerEmail": owner_email}).sort("createdAt", -1).to_list(100)
        return {
            "success": True,
            "data": [OwnerMessage(**message).dict() for message in messages]
        }
    except Exception as e:
        logger.error(f"Error retrieving owner messages: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve messages",
            "message": str(e)
        }

@api_router.get("/messages")
async def get_all_messages():
    try:
        messages = await db.owner_messages.find().sort("createdAt", -1).to_list(1000)
        return {
            "success": True,
            "data": [OwnerMessage(**message).dict() for message in messages]
        }
    except Exception as e:
        logger.error(f"Error retrieving all messages: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve messages",
            "message": str(e)
        }

@api_router.post("/inspections", response_model=dict)
async def create_inspection_report(
    title: str = Form(...),
    notes: str = Form(...),
    ownerEmail: str = Form(...),
    propertyAddress: str = Form(...),
    inspectionDate: str = Form(...),
    reportFile: Optional[UploadFile] = File(None)
):
    try:
        # Create inspection report object
        inspection_data = {
            "title": title,
            "notes": notes,
            "ownerEmail": ownerEmail,
            "propertyAddress": propertyAddress,
            "inspectionDate": datetime.fromisoformat(inspectionDate.replace('Z', '+00:00'))
        }
        
        inspection_obj = InspectionReport(**inspection_data)
        
        # Handle file upload if provided
        if reportFile and reportFile.filename:
            file_extension = reportFile.filename.split('.')[-1]
            unique_filename = f"{inspection_obj.id}_{reportFile.filename}"
            file_path = REPORTS_DIR / unique_filename
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(reportFile.file, buffer)
            
            inspection_obj.reportFile = unique_filename
        
        # Insert into database
        result = await db.inspection_reports.insert_one(inspection_obj.dict())
        
        if result.inserted_id:
            logger.info(f"Inspection report created: {inspection_obj.id}")
            return {
                "success": True,
                "data": inspection_obj.dict(),
                "message": "Inspection report created successfully"
            }
        else:
            raise Exception("Failed to create inspection report")
            
    except Exception as e:
        logger.error(f"Error creating inspection report: {str(e)}")
        return {
            "success": False,
            "error": "Unable to create inspection report",
            "message": str(e)
        }

@api_router.get("/inspections/owner/{owner_email}")
async def get_owner_inspections(owner_email: str):
    try:
        inspections = await db.inspection_reports.find({"ownerEmail": owner_email}).sort("inspectionDate", -1).to_list(100)
        return {
            "success": True,
            "data": [InspectionReport(**inspection).dict() for inspection in inspections]
        }
    except Exception as e:
        logger.error(f"Error retrieving owner inspections: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve inspections",
            "message": str(e)
        }

@api_router.get("/inspections/file/{filename}")
async def download_inspection_file(filename: str):
    try:
        file_path = REPORTS_DIR / filename
        if file_path.exists():
            return FileResponse(path=file_path, filename=filename)
        else:
            return {"error": "File not found"}
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        return {"error": "Unable to download file"}

@api_router.post("/photos/upload", response_model=dict)
async def upload_photos(
    ownerEmail: str = Form(...),
    propertyAddress: str = Form(...),
    caption: Optional[str] = Form(None),
    photos: List[UploadFile] = File(...)
):
    try:
        uploaded_photos = []
        
        for photo in photos:
            if photo.filename:
                # Generate unique filename
                file_extension = photo.filename.split('.')[-1]
                unique_filename = f"{str(uuid.uuid4())}_{photo.filename}"
                file_path = PHOTOS_DIR / unique_filename
                
                # Save file
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(photo.file, buffer)
                
                # Create photo record
                photo_obj = PhotoUpload(
                    filename=unique_filename,
                    originalName=photo.filename,
                    ownerEmail=ownerEmail,
                    propertyAddress=propertyAddress,
                    caption=caption
                )
                
                # Insert into database
                await db.property_photos.insert_one(photo_obj.dict())
                uploaded_photos.append(photo_obj.dict())
        
        logger.info(f"Uploaded {len(uploaded_photos)} photos for {ownerEmail}")
        return {
            "success": True,
            "data": uploaded_photos,
            "message": f"Successfully uploaded {len(uploaded_photos)} photos"
        }
        
    except Exception as e:
        logger.error(f"Error uploading photos: {str(e)}")
        return {
            "success": False,
            "error": "Unable to upload photos",
            "message": str(e)
        }

@api_router.get("/photos/owner/{owner_email}")
async def get_owner_photos(owner_email: str):
    try:
        photos = await db.property_photos.find({"ownerEmail": owner_email}).sort("uploadedAt", -1).to_list(200)
        return {
            "success": True,
            "data": [PhotoUpload(**photo).dict() for photo in photos]
        }
    except Exception as e:
        logger.error(f"Error retrieving owner photos: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve photos",
            "message": str(e)
        }

@api_router.get("/photos/file/{filename}")
async def get_photo_file(filename: str):
    try:
        file_path = PHOTOS_DIR / filename
        if file_path.exists():
            return FileResponse(path=file_path)
        else:
            return {"error": "Photo not found"}
    except Exception as e:
        logger.error(f"Error retrieving photo: {str(e)}")
        return {"error": "Unable to retrieve photo"}

@api_router.post("/guest-requests", response_model=dict)
async def submit_guest_request(
    guestName: str = Form(...),
    guestEmail: str = Form(...),
    guestPhone: Optional[str] = Form(None),
    numberOfGuests: Optional[int] = Form(None),
    propertyAddress: str = Form(...),
    checkInDate: str = Form(...),
    checkOutDate: str = Form(...),
    unitNumber: Optional[str] = Form(None),
    requestType: str = Form(...),
    priority: str = Form(default="normal"),
    message: str = Form(...),
    photos: List[UploadFile] = File(default=[])
):
    try:
        # Create base request data
        request_data = {
            "guestName": guestName,
            "guestEmail": guestEmail,
            "guestPhone": guestPhone,
            "numberOfGuests": numberOfGuests,
            "propertyAddress": propertyAddress,
            "checkInDate": checkInDate,
            "checkOutDate": checkOutDate,
            "unitNumber": unitNumber,
            "requestType": requestType,
            "priority": priority,
            "message": message
        }
        
        # Validate using Pydantic model first
        validated_data = GuestRequestCreate(**request_data)
        
        # Create guest request object
        request_obj = GuestRequest(**validated_data.dict())
        
        # Handle photo uploads
        uploaded_photos = []
        for photo in photos:
            if photo.filename:
                # Validate image file
                if not photo.content_type.startswith('image/'):
                    continue
                
                file_extension = photo.filename.split('.')[-1] if '.' in photo.filename else 'jpg'
                unique_filename = f"{request_obj.id}_{uuid.uuid4().hex[:8]}.{file_extension}"
                file_path = GUEST_PHOTOS_DIR / unique_filename
                
                # Save photo file
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(photo.file, buffer)
                
                # Create photo record
                photo_record = GuestRequestPhoto(
                    filename=unique_filename,
                    originalName=photo.filename
                )
                uploaded_photos.append(photo_record)
        
        # Add photos to request
        request_obj.photos = uploaded_photos
        
        # Insert into database
        result = await db.guest_requests.insert_one(request_obj.dict())
        
        if result.inserted_id:
            confirmation_number = request_obj.id[:8].upper()
            logger.info(f"Guest request submitted: {request_obj.guestEmail} - {request_obj.requestType} with {len(uploaded_photos)} photos")
            
            # Send email notification
            try:
                email_sent = await email_service.send_guest_request_notification(
                    guest_name=request_obj.guestName,
                    guest_email=request_obj.guestEmail,
                    guest_phone=request_obj.guestPhone,
                    property_address=request_obj.propertyAddress,
                    request_type=request_obj.requestType,
                    priority=request_obj.priority,
                    message=request_obj.message,
                    confirmation_number=confirmation_number,
                    photo_count=len(uploaded_photos)
                )
                if email_sent:
                    logger.info(f"Email notification sent for request {confirmation_number}")
                else:
                    logger.warning(f"Email notification failed for request {confirmation_number}")
            except Exception as e:
                logger.error(f"Email notification error for request {confirmation_number}: {str(e)}")
                # Don't fail the request if email fails
            
            # Send Telegram notification
            try:
                telegram_sent = await telegram_service.send_guest_request_alert(
                    guest_name=request_obj.guestName,
                    guest_email=request_obj.guestEmail,
                    property_address=request_obj.propertyAddress,
                    request_type=request_obj.requestType,
                    priority=request_obj.priority,
                    message=request_obj.message,
                    confirmation_number=confirmation_number,
                    photo_count=len(uploaded_photos)
                )
                if telegram_sent:
                    logger.info(f"Telegram alert sent for request {confirmation_number}")
                else:
                    logger.warning(f"Telegram alert failed for request {confirmation_number}")
            except Exception as e:
                logger.error(f"Telegram alert error for request {confirmation_number}: {str(e)}")
                # Don't fail the request if Telegram fails
            
            return {
                "success": True,
                "data": request_obj.dict(),
                "message": "Guest request submitted successfully",
                "confirmationNumber": confirmation_number
            }
        else:
            raise Exception("Failed to insert guest request")
            
    except Exception as e:
        logger.error(f"Error submitting guest request: {str(e)}")
        return {
            "success": False,
            "error": "Unable to submit request",
            "message": str(e)
        }

@api_router.get("/guest-requests")
async def get_all_guest_requests():
    try:
        requests = await db.guest_requests.find().sort("createdAt", -1).to_list(1000)
        return {
            "success": True,
            "data": [GuestRequest(**request).dict() for request in requests]
        }
    except Exception as e:
        logger.error(f"Error retrieving guest requests: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve guest requests",
            "message": str(e)
        }

@api_router.get("/guest-requests/{confirmation_number}")
async def get_guest_request_status(confirmation_number: str):
    try:
        # Find request by confirmation number (first 8 chars of ID)
        requests = await db.guest_requests.find().to_list(1000)
        for request in requests:
            if request['id'][:8].upper() == confirmation_number.upper():
                return {
                    "success": True,
                    "data": GuestRequest(**request).dict()
                }
        
        return {
            "success": False,
            "error": "Request not found",
            "message": "No request found with this confirmation number"
        }
    except Exception as e:
        logger.error(f"Error retrieving guest request status: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve request status",
            "message": str(e)
        }

@api_router.get("/guest-photos/{filename}")
async def get_guest_photo(filename: str):
    try:
        file_path = GUEST_PHOTOS_DIR / filename
        if file_path.exists():
            return FileResponse(path=file_path)
        else:
            return {"error": "Photo not found"}
    except Exception as e:
        logger.error(f"Error retrieving guest photo: {str(e)}")
        return {"error": "Unable to retrieve photo"}

@api_router.get("/telegram/bot-info")
async def get_telegram_bot_info():
    """Get Telegram bot information for testing."""
    try:
        bot_info = await telegram_service.get_bot_info()
        if bot_info:
            return {
                "success": True,
                "bot_info": bot_info,
                "message": "Bot is configured and accessible"
            }
        else:
            return {
                "success": False,
                "error": "Bot not configured or inaccessible"
            }
    except Exception as e:
        logger.error(f"Error getting bot info: {str(e)}")
        return {
            "success": False,
            "error": "Unable to get bot information",
            "message": str(e)
        }

@api_router.get("/telegram/get-chat-id")
async def get_telegram_chat_id():
    """Get chat ID from recent bot messages (for setup)."""
    try:
        chat_id = await telegram_service.get_chat_id_from_updates()
        if chat_id:
            return {
                "success": True,
                "chat_id": chat_id,
                "message": "Chat ID found from recent messages"
            }
        else:
            return {
                "success": False,
                "error": "No recent messages found",
                "message": "Please send a message to the bot first"
            }
    except Exception as e:
        logger.error(f"Error getting chat ID: {str(e)}")
        return {
            "success": False,
            "error": "Unable to get chat ID",
            "message": str(e)
        }

# Admin Authentication and Management Endpoints

@api_router.post("/admin/login")
async def admin_login(credentials: AdminAuth):
    """Admin login endpoint."""
    try:
        admin_username = os.environ.get('ADMIN_USERNAME')
        admin_password = os.environ.get('ADMIN_PASSWORD')
        
        if not admin_username or not admin_password:
            return {
                "success": False,
                "error": "Admin credentials not configured"
            }
        
        if credentials.username == admin_username and credentials.password == admin_password:
            # Log the login
            login_record = AdminLogin(
                username=credentials.username,
                ipAddress="system"  # In real implementation, get from request
            )
            await db.admin_logins.insert_one(login_record.dict())
            
            return {
                "success": True,
                "message": "Login successful",
                "token": "admin_authenticated",  # Simple token for demo
                "username": credentials.username
            }
        else:
            return {
                "success": False,
                "error": "Invalid credentials"
            }
    except Exception as e:
        logger.error(f"Admin login error: {str(e)}")
        return {
            "success": False,
            "error": "Login failed",
            "message": str(e)
        }

@api_router.get("/admin/guest-requests")
async def get_admin_guest_requests(
    page: int = 1,
    limit: int = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    request_type: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """Get guest requests for admin dashboard with filtering and pagination."""
    try:
        # Build filter query
        filter_query = {}
        
        if search:
            filter_query["$or"] = [
                {"guestName": {"$regex": search, "$options": "i"}},
                {"guestEmail": {"$regex": search, "$options": "i"}},
                {"propertyAddress": {"$regex": search, "$options": "i"}},
                {"message": {"$regex": search, "$options": "i"}}
            ]
        
        if status:
            filter_query["status"] = status
            
        if priority:
            filter_query["priority"] = priority
            
        if request_type:
            filter_query["requestType"] = request_type
            
        if date_from or date_to:
            date_filter = {}
            if date_from:
                date_filter["$gte"] = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
            if date_to:
                date_filter["$lte"] = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
            filter_query["createdAt"] = date_filter
        
        # Get total count
        total_count = await db.guest_requests.count_documents(filter_query)
        
        # Get paginated results
        skip = (page - 1) * limit
        requests = await db.guest_requests.find(filter_query).sort("createdAt", -1).skip(skip).limit(limit).to_list(limit)
        
        return {
            "success": True,
            "data": {
                "requests": [GuestRequest(**request).dict() for request in requests],
                "pagination": {
                    "current_page": page,
                    "total_pages": (total_count + limit - 1) // limit,
                    "total_count": total_count,
                    "per_page": limit
                }
            }
        }
    except Exception as e:
        logger.error(f"Error getting admin guest requests: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve requests",
            "message": str(e)
        }

@api_router.put("/admin/guest-requests/{request_id}")
async def update_guest_request(request_id: str, update_data: GuestRequestUpdate):
    """Update guest request status, priority, or add internal notes."""
    try:
        # Find the request
        existing_request = await db.guest_requests.find_one({"id": request_id})
        if not existing_request:
            return {
                "success": False,
                "error": "Request not found"
            }
        
        # Prepare update data
        update_fields = {
            "lastUpdatedBy": update_data.adminUsername,
            "lastUpdatedAt": datetime.utcnow()
        }
        
        if update_data.status:
            update_fields["status"] = update_data.status
            if update_data.status in ["completed", "resolved"]:
                update_fields["respondedAt"] = datetime.utcnow()
        
        if update_data.priority:
            update_fields["priority"] = update_data.priority
        
        # Handle internal notes
        if update_data.internalNote:
            current_notes = existing_request.get("internalNotes", [])
            new_note = f"[{datetime.utcnow().strftime('%Y-%m-%d %H:%M')} - {update_data.adminUsername}] {update_data.internalNote}"
            current_notes.append(new_note)
            update_fields["internalNotes"] = current_notes
        
        # Update the request
        result = await db.guest_requests.update_one(
            {"id": request_id},
            {"$set": update_fields}
        )
        
        if result.modified_count > 0:
            # Get updated request
            updated_request = await db.guest_requests.find_one({"id": request_id})
            return {
                "success": True,
                "data": GuestRequest(**updated_request).dict(),
                "message": "Request updated successfully"
            }
        else:
            return {
                "success": False,
                "error": "No changes made"
            }
    except Exception as e:
        logger.error(f"Error updating guest request: {str(e)}")
        return {
            "success": False,
            "error": "Unable to update request",
            "message": str(e)
        }

@api_router.post("/admin/guest-requests/{request_id}/reply")
async def reply_to_guest_request(request_id: str, reply_data: AdminReply):
    """Send email reply to guest for specific request."""
    try:
        # Find the request
        existing_request = await db.guest_requests.find_one({"id": request_id})
        if not existing_request:
            return {
                "success": False,
                "error": "Request not found"
            }
        
        request_obj = GuestRequest(**existing_request)
        
        # Send email reply
        email_sent = await email_service.send_admin_reply_email(
            to_email=request_obj.guestEmail,
            guest_name=request_obj.guestName,
            subject=reply_data.subject,
            message=reply_data.message,
            confirmation_number=request_obj.id[:8].upper(),
            admin_username=reply_data.adminUsername
        )
        
        if email_sent:
            # Add internal note about the reply
            current_notes = existing_request.get("internalNotes", [])
            reply_note = f"[{datetime.utcnow().strftime('%Y-%m-%d %H:%M')} - {reply_data.adminUsername}] Email reply sent: {reply_data.subject}"
            current_notes.append(reply_note)
            
            # Update request with reply info
            await db.guest_requests.update_one(
                {"id": request_id},
                {"$set": {
                    "internalNotes": current_notes,
                    "lastUpdatedBy": reply_data.adminUsername,
                    "lastUpdatedAt": datetime.utcnow(),
                    "respondedAt": datetime.utcnow()
                }}
            )
            
            return {
                "success": True,
                "message": "Reply sent successfully"
            }
        else:
            return {
                "success": False,
                "error": "Failed to send email reply"
            }
    except Exception as e:
        logger.error(f"Error sending admin reply: {str(e)}")
        return {
            "success": False,
            "error": "Unable to send reply",
            "message": str(e)
        }

@api_router.get("/admin/analytics")
async def get_admin_analytics():
    """Get analytics data for admin dashboard."""
    try:
        # Get basic counts
        total_requests = await db.guest_requests.count_documents({})
        pending_requests = await db.guest_requests.count_documents({"status": "pending"})
        completed_requests = await db.guest_requests.count_documents({"status": {"$in": ["completed", "resolved"]}})
        urgent_requests = await db.guest_requests.count_documents({"priority": "urgent"})
        
        # Get request types breakdown
        request_types_pipeline = [
            {"$group": {"_id": "$requestType", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        request_types = await db.guest_requests.aggregate(request_types_pipeline).to_list(100)
        
        # Get requests by status
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        status_breakdown = await db.guest_requests.aggregate(status_pipeline).to_list(100)
        
        # Get recent activity (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        recent_requests = await db.guest_requests.count_documents({
            "createdAt": {"$gte": seven_days_ago}
        })
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_requests": total_requests,
                    "pending_requests": pending_requests,
                    "completed_requests": completed_requests,
                    "urgent_requests": urgent_requests,
                    "recent_requests": recent_requests
                },
                "request_types": request_types,
                "status_breakdown": status_breakdown
            }
        }
    except Exception as e:
        logger.error(f"Error getting analytics: {str(e)}")
        return {
            "success": False,
            "error": "Unable to retrieve analytics",
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
