import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from ..core.config import settings

WELCOME_TEMPLATE = """
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #ecfdf5; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { background: #065f46; color: white; padding: 24px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .body { padding: 24px; }
  .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
</style></head>
<body>
<div class="container">
  <div class="header"><h1>Welcome to EcoSort</h1></div>
  <div class="body">
    <h2>Hello {{ name }},</h2>
    <p>Welcome to EcoSort! Take photos of waste items and our AI will tell you exactly how to sort and dispose of them properly.</p>
    <p>Together, let's make the planet greener, one item at a time.</p>
  </div>
  <div class="footer"><p>EcoSort by Humanoid Maker | www.humanoidmaker.com</p></div>
</div>
</body>
</html>
"""

MILESTONE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #ecfdf5; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { background: #065f46; color: white; padding: 24px; text-align: center; }
  .body { padding: 24px; text-align: center; }
  .badge { display: inline-block; width: 80px; height: 80px; background: #22c55e; border-radius: 50%; line-height: 80px; font-size: 32px; color: white; margin: 16px; }
  .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
</style></head>
<body>
<div class="container">
  <div class="header"><h1>EcoSort Achievement</h1></div>
  <div class="body">
    <div class="badge">{{ badge_emoji }}</div>
    <h2>{{ badge_name }}</h2>
    <p>Congratulations {{ name }}! You've sorted {{ count }} items and saved an estimated {{ co2_saved }} kg of CO2!</p>
    <p>Keep up the great work for our planet!</p>
  </div>
  <div class="footer"><p>EcoSort by Humanoid Maker | www.humanoidmaker.com</p></div>
</div>
</body>
</html>
"""


async def send_email(to: str, subject: str, html_body: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[Email] SMTP not configured. Would send to {to}: {subject}")
        return False
    try:
        message = MIMEMultipart("alternative")
        message["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
        message["To"] = to
        message["Subject"] = subject
        message.attach(MIMEText(html_body, "html"))

        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
        )
        return True
    except Exception as e:
        print(f"[Email] Failed: {e}")
        return False


async def send_welcome_email(to: str, name: str):
    html = Template(WELCOME_TEMPLATE).render(name=name)
    await send_email(to, "Welcome to EcoSort!", html)


async def send_milestone_email(to: str, name: str, count: int, co2_saved: float):
    badges = [(10, "Eco Starter", "S"), (50, "Green Warrior", "W"), (100, "Planet Champion", "C"), (500, "Earth Guardian", "G")]
    badge_name = "Eco Hero"
    badge_emoji = "H"
    for threshold, bname, bemoji in badges:
        if count >= threshold:
            badge_name = bname
            badge_emoji = bemoji
    html = Template(MILESTONE_TEMPLATE).render(
        name=name, count=count, co2_saved=round(co2_saved, 2),
        badge_name=badge_name, badge_emoji=badge_emoji,
    )
    await send_email(to, f"EcoSort Achievement: {badge_name}!", html)
