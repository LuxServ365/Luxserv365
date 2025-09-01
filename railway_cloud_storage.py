import os
import logging
import cloudinary
import cloudinary.uploader
from typing import Optional, List
from fastapi import UploadFile

logger = logging.getLogger(__name__)

class CloudinaryStorage:
    def __init__(self):
        # Configure Cloudinary from environment variables
        cloudinary.config(
            cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
            api_key=os.environ.get('CLOUDINARY_API_KEY'),
            api_secret=os.environ.get('CLOUDINARY_API_SECRET')
        )
        
    async def upload_guest_photo(self, photo: UploadFile, request_id: str) -> dict:
        """Upload guest request photo to Cloudinary."""
        try:
            # Create unique filename
            original_name = photo.filename or "photo.jpg"
            file_extension = original_name.split('.')[-1] if '.' in original_name else 'jpg'
            unique_filename = f"guest_photos/{request_id}_{photo.filename}"
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                photo.file,
                public_id=unique_filename,
                folder="luxserv365/guest_requests",
                resource_type="image",
                format=file_extension
            )
            
            return {
                "filename": result["public_id"],
                "url": result["secure_url"],
                "original_name": original_name
            }
            
        except Exception as e:
            logger.error(f"Error uploading photo to Cloudinary: {str(e)}")
            raise e
    
    async def upload_inspection_report(self, file: UploadFile, property_id: str) -> dict:
        """Upload inspection report to Cloudinary."""
        try:
            unique_filename = f"inspection_reports/{property_id}_{file.filename}"
            
            result = cloudinary.uploader.upload(
                file.file,
                public_id=unique_filename,
                folder="luxserv365/inspection_reports",
                resource_type="raw"  # For PDFs and documents
            )
            
            return {
                "filename": result["public_id"],
                "url": result["secure_url"],
                "original_name": file.filename
            }
            
        except Exception as e:
            logger.error(f"Error uploading inspection report: {str(e)}")
            raise e
    
    async def upload_property_photo(self, photo: UploadFile, property_id: str) -> dict:
        """Upload property photo to Cloudinary."""
        try:
            unique_filename = f"property_photos/{property_id}_{photo.filename}"
            
            result = cloudinary.uploader.upload(
                photo.file,
                public_id=unique_filename,
                folder="luxserv365/property_photos",
                resource_type="image"
            )
            
            return {
                "filename": result["public_id"],
                "url": result["secure_url"],
                "original_name": photo.filename
            }
            
        except Exception as e:
            logger.error(f"Error uploading property photo: {str(e)}")
            raise e
    
    def get_photo_url(self, filename: str) -> str:
        """Get URL for a photo stored in Cloudinary."""
        return cloudinary.utils.cloudinary_url(filename)[0]
    
    async def delete_photo(self, filename: str) -> bool:
        """Delete photo from Cloudinary."""
        try:
            result = cloudinary.uploader.destroy(filename)
            return result.get("result") == "ok"
        except Exception as e:
            logger.error(f"Error deleting photo: {str(e)}")
            return False

# Global instance
cloud_storage = CloudinaryStorage()