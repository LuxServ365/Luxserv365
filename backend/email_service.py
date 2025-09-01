import os
import logging
from typing import List, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from datetime import datetime

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_username = os.environ.get('SMTP_USERNAME')
        self.smtp_password = os.environ.get('SMTP_PASSWORD')
        self.email_from = os.environ.get('EMAIL_FROM')
        self.email_from_name = os.environ.get('EMAIL_FROM_NAME', 'LuxServ 365')
        
    async def send_guest_request_notification(
        self,
        guest_name: str,
        guest_email: str,
        guest_phone: Optional[str],
        property_address: str,
        request_type: str,
        priority: str,
        message: str,
        confirmation_number: str,
        photo_count: int = 0,
        to_emails: List[str] = None
    ):
        """Send email notification when a new guest request is submitted."""
        
        if not to_emails:
            to_emails = [self.email_from]  # Send to company email by default
            
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"New Guest Request - {priority.upper()} Priority - {confirmation_number}"
            msg['From'] = f"{self.email_from_name} <{self.email_from}>"
            msg['To'] = ', '.join(to_emails)
            
            # Create HTML content
            html_content = self._create_guest_request_html(
                guest_name, guest_email, guest_phone, property_address,
                request_type, priority, message, confirmation_number, photo_count
            )
            
            # Create plain text content
            text_content = self._create_guest_request_text(
                guest_name, guest_email, guest_phone, property_address,
                request_type, priority, message, confirmation_number, photo_count
            )
            
            # Attach parts
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Send email
            await self._send_email(msg, to_emails)
            
            logger.info(f"Guest request notification sent successfully for {confirmation_number}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send guest request notification: {str(e)}")
            return False
    
    def _create_guest_request_html(
        self, guest_name, guest_email, guest_phone, property_address,
        request_type, priority, message, confirmation_number, photo_count
    ):
        """Create HTML email content for guest request notification."""
        
        priority_color = {
            'urgent': '#ef4444',  # red
            'high': '#f97316',    # orange
            'normal': '#3b82f6'   # blue
        }.get(priority, '#3b82f6')
        
        request_type_display = {
            'property-issues': '🏠 Property Issues',
            'housekeeping-requests': '🧹 Housekeeping Requests',
            'pre-arrival-grocery-stocking': '🛒 Pre-Arrival Grocery & Beverage Stocking',
            'concierge-services': '🎯 Concierge Services',
            'beach-recreation-gear': '🏖️ Beach/Recreation Gear',
            'transportation-assistance': '🚗 Transportation Assistance',
            'celebration-services': '🎉 Celebration Services',
            'emergency-urgent': '🆘 Emergency/Urgent',
            'general-inquiry': '💬 General Inquiry'
        }.get(request_type, request_type)
        
        response_time = {
            'urgent': '2 hours',
            'high': '4 hours',
            'normal': '24 hours'
        }.get(priority, '24 hours')
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Guest Request - {confirmation_number}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }}
                .priority-badge {{ display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-weight: bold; background: {priority_color}; }}
                .info-row {{ margin: 10px 0; }}
                .label {{ font-weight: bold; color: #1f2937; }}
                .message-box {{ background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid {priority_color}; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏖️ LuxServ 365 - New Guest Request</h1>
                </div>
                <div class="content">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span class="priority-badge">{priority.upper()} PRIORITY</span>
                        <p><strong>Confirmation Number:</strong> {confirmation_number}</p>
                        <p><strong>Response Required Within:</strong> {response_time}</p>
                    </div>
                    
                    <h3>📋 Request Details</h3>
                    <div class="info-row"><span class="label">Request Type:</span> {request_type_display}</div>
                    <div class="info-row"><span class="label">Property:</span> {property_address}</div>
                    
                    <h3>👤 Guest Information</h3>
                    <div class="info-row"><span class="label">Name:</span> {guest_name}</div>
                    <div class="info-row"><span class="label">Email:</span> <a href="mailto:{guest_email}">{guest_email}</a></div>
                    {f'<div class="info-row"><span class="label">Phone:</span> <a href="tel:{guest_phone}">{guest_phone}</a></div>' if guest_phone else ''}
                    
                    {f'<div class="info-row"><span class="label">Photos Attached:</span> {photo_count} photo(s)</div>' if photo_count > 0 else ''}
                    
                    <h3>💬 Message</h3>
                    <div class="message-box">
                        {message.replace(chr(10), '<br>')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p><strong>Next Steps:</strong></p>
                        <p>1. Review the request details above</p>
                        <p>2. Contact the guest if needed: <a href="mailto:{guest_email}">{guest_email}</a></p>
                        <p>3. Update request status in admin dashboard</p>
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated notification from LuxServ 365 Guest Portal</p>
                    <p>Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_guest_request_text(
        self, guest_name, guest_email, guest_phone, property_address,
        request_type, priority, message, confirmation_number, photo_count
    ):
        """Create plain text email content for guest request notification."""
        
        request_type_display = {
            'property-issues': 'Property Issues',
            'housekeeping-requests': 'Housekeeping Requests',
            'pre-arrival-grocery-stocking': 'Pre-Arrival Grocery & Beverage Stocking',
            'concierge-services': 'Concierge Services',
            'beach-recreation-gear': 'Beach/Recreation Gear',
            'transportation-assistance': 'Transportation Assistance',
            'celebration-services': 'Celebration Services',
            'emergency-urgent': 'Emergency/Urgent',
            'general-inquiry': 'General Inquiry'
        }.get(request_type, request_type)
        
        response_time = {
            'urgent': '2 hours',
            'high': '4 hours',
            'normal': '24 hours'
        }.get(priority, '24 hours')
        
        text = f"""
LuxServ 365 - New Guest Request

PRIORITY: {priority.upper()}
Confirmation Number: {confirmation_number}
Response Required Within: {response_time}
Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

========================================

REQUEST DETAILS:
Request Type: {request_type_display}
Property: {property_address}

GUEST INFORMATION:
Name: {guest_name}
Email: {guest_email}
"""
        
        if guest_phone:
            text += f"Phone: {guest_phone}\n"
            
        if photo_count > 0:
            text += f"Photos Attached: {photo_count} photo(s)\n"
            
        text += f"""
MESSAGE:
{message}

========================================

NEXT STEPS:
1. Review the request details above
2. Contact the guest if needed: {guest_email}
3. Update request status in admin dashboard

This is an automated notification from LuxServ 365 Guest Portal.
        """
        
        return text.strip()
    
    async def _send_email(self, message: MIMEMultipart, to_emails: List[str]):
        """Send email using aiosmtplib."""
        
        smtp = aiosmtplib.SMTP(hostname=self.smtp_host, port=self.smtp_port)
        
        try:
            await smtp.connect()
            if not smtp.is_connected:
                raise Exception("Failed to connect to SMTP server")
            
            # Only start TLS if not already using it
            if not smtp.is_ehlo_or_helo_needed:
                await smtp.ehlo()
            
            if smtp.supports_extension("STARTTLS") and not smtp.is_tls:
                await smtp.starttls()
                await smtp.ehlo()  # Re-identify after STARTTLS
            
            await smtp.login(self.smtp_username, self.smtp_password)
            await smtp.send_message(message, recipients=to_emails)
            logger.info(f"Email sent successfully to {', '.join(to_emails)}")
            
        except Exception as e:
            logger.error(f"SMTP error: {str(e)}")
            raise
        finally:
            try:
                await smtp.quit()
            except:
                pass

# Create global email service instance
email_service = EmailService()