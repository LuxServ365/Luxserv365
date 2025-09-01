import os
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

class SimpleEmailService:
    def __init__(self):
        # Using a simple webhook service for immediate testing
        self.webhook_url = "https://hooks.zapier.com/hooks/catch/test/"  # Example
        
    async def send_simple_notification(
        self,
        guest_name: str,
        guest_email: str, 
        property_address: str,
        request_type: str,
        priority: str,
        message: str,
        confirmation_number: str,
        to_email: str = "850realty@gmail.com"
    ):
        """Send simple email notification via webhook service."""
        
        try:
            # Create simple email content
            email_content = f"""
🏖️ LuxServ 365 - New Guest Request

PRIORITY: {priority.upper()}
Confirmation: {confirmation_number}

GUEST: {guest_name} ({guest_email})
PROPERTY: {property_address}
REQUEST TYPE: {request_type}

MESSAGE:
{message}

Please check your admin dashboard for full details and to respond.
            """
            
            # For now, just log the email content so you can see what would be sent
            logger.info(f"EMAIL NOTIFICATION FOR {confirmation_number}:")
            logger.info(email_content)
            
            # TODO: Send via actual email service when Gmail is configured
            return True
            
        except Exception as e:
            logger.error(f"Failed to send simple email notification: {str(e)}")
            return False

# Create global simple email service instance
simple_email_service = SimpleEmailService()