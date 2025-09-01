import os
import logging
from typing import Optional
import asyncio
from telegram import Bot
from datetime import datetime

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        self.default_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        self.bot = None
        
        if self.bot_token:
            self.bot = Bot(token=self.bot_token)
        else:
            logger.warning("Telegram bot token not configured")
    
    def escape_markdown_v2(self, text: str) -> str:
        """Escape special characters for MarkdownV2"""
        if not text:
            return ""
        
        special_chars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']
        for char in special_chars:
            text = text.replace(char, f'\\{char}')
        return text
    
    async def send_guest_request_alert(
        self,
        guest_name: str,
        guest_email: str,
        property_address: str,
        request_type: str,
        priority: str,
        message: str,
        confirmation_number: str,
        photo_count: int = 0,
        chat_id: Optional[str] = None
    ):
        """Send Telegram alert for new guest request."""
        
        if not self.bot:
            logger.warning("Telegram bot not configured, skipping notification")
            return False
            
        target_chat_id = chat_id or self.default_chat_id
        if not target_chat_id:
            logger.warning("No Telegram chat ID configured, skipping notification")
            return False
            
        try:
            # Create formatted message
            message_text = self._create_telegram_message(
                guest_name, guest_email, property_address, request_type,
                priority, message, confirmation_number, photo_count
            )
            
            # Send message (ensure chat_id is integer)
            chat_id_int = int(target_chat_id) if isinstance(target_chat_id, str) else target_chat_id
            await self.bot.send_message(
                chat_id=chat_id_int,
                text=message_text,
                parse_mode='MarkdownV2'
            )
            
            logger.info(f"Telegram alert sent successfully for request {confirmation_number}")
            return True
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to send Telegram alert for request {confirmation_number}: {error_msg}")
            
            # Try with plain text if MarkdownV2 fails
            if "parse" in error_msg.lower() or "markdown" in error_msg.lower():
                try:
                    # Simple text version without formatting
                    simple_message = f"""🏖️ LuxServ 365 - New Guest Request

{priority.upper()} PRIORITY
Confirmation: {confirmation_number}

Guest: {guest_name}
Email: {guest_email}
Property: {property_address}
Type: {request_type}

Message: {message[:200]}{"..." if len(message) > 200 else ""}"""
                    
                    chat_id_int = int(target_chat_id) if isinstance(target_chat_id, str) else target_chat_id
                    await self.bot.send_message(
                        chat_id=chat_id_int,
                        text=simple_message
                    )
                    logger.info(f"Telegram alert sent with plain text for request {confirmation_number}")
                    return True
                except Exception as e2:
                    logger.error(f"Plain text Telegram also failed: {str(e2)}")
            
            return False
    
    def _create_telegram_message(
        self, guest_name, guest_email, property_address, request_type,
        priority, message, confirmation_number, photo_count
    ):
        """Create formatted Telegram message."""
        
        # Priority emoji and formatting
        priority_emoji = {
            'urgent': '🚨',
            'high': '⚠️',
            'normal': '📋'
        }.get(priority, '📋')
        
        # Request type display
        request_type_display = {
            'property-issues': '🏠 Property Issues',
            'housekeeping-requests': '🧹 Housekeeping Requests',
            'pre-arrival-grocery-stocking': '🛒 Pre\\-Arrival Grocery \\& Beverage Stocking',
            'concierge-services': '🎯 Concierge Services',
            'beach-recreation-gear': '🏖️ Beach/Recreation Gear',
            'transportation-assistance': '🚗 Transportation Assistance',
            'celebration-services': '🎉 Celebration Services',
            'emergency-urgent': '🆘 Emergency/Urgent',
            'general-inquiry': '💬 General Inquiry'
        }.get(request_type, self.escape_markdown_v2(request_type))
        
        # Response time
        response_time = {
            'urgent': '2 hours',
            'high': '4 hours',
            'normal': '24 hours'
        }.get(priority, '24 hours')
        
        # Escape text content
        guest_name_escaped = self.escape_markdown_v2(guest_name)
        guest_email_escaped = self.escape_markdown_v2(guest_email)
        property_address_escaped = self.escape_markdown_v2(property_address)
        message_escaped = self.escape_markdown_v2(message[:200] + "..." if len(message) > 200 else message)
        confirmation_escaped = self.escape_markdown_v2(confirmation_number)
        
        # Build message
        telegram_message = f"""🏖️ *LuxServ 365 \\- New Guest Request*

{priority_emoji} *{self.escape_markdown_v2(priority.upper())} PRIORITY*
*Confirmation:* `{confirmation_escaped}`
*Response Time:* {self.escape_markdown_v2(response_time)}

📋 *Request Details:*
• *Type:* {request_type_display}
• *Property:* {property_address_escaped}

👤 *Guest:*
• *Name:* {guest_name_escaped}
• *Email:* {guest_email_escaped}"""

        if photo_count > 0:
            telegram_message += f"\n• *Photos:* {photo_count} attached"

        telegram_message += f"""

💬 *Message:*
_{message_escaped}_

⏰ _{self.escape_markdown_v2(datetime.now().strftime('%B %d, %Y at %I:%M %p'))}_"""

        return telegram_message
    
    async def get_bot_info(self):
        """Get bot information for testing."""
        if not self.bot:
            return None
            
        try:
            bot_info = await self.bot.get_me()
            return {
                'id': bot_info.id,
                'username': bot_info.username,
                'first_name': bot_info.first_name
            }
        except Exception as e:
            logger.error(f"Failed to get bot info: {str(e)}")
            return None
    
    async def get_chat_id_from_updates(self):
        """Get chat ID from recent bot updates (for setup purposes)."""
        if not self.bot:
            return None
            
        try:
            updates = await self.bot.get_updates()
            if updates:
                # Get the most recent chat ID
                latest_update = updates[-1]
                if latest_update.message:
                    return latest_update.message.chat_id
            return None
        except Exception as e:
            logger.error(f"Failed to get updates: {str(e)}")
            return None

# Create global Telegram service instance
telegram_service = TelegramService()