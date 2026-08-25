# Danjuma's WebPage

## Run the website

1. Install Node.js from https://nodejs.org/ if it is not installed.
2. Open PowerShell in this folder.
3. Run:

```powershell
npm start
```

4. Open http://localhost:3000 in your browser.

The Contact form sends messages through SMTP and also saves successful submissions in `.data/messages.json`. Configure the mail account before starting the server. For Gmail, use an App Password rather than your normal account password:

```powershell
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "587"
$env:SMTP_SECURE = "false"
$env:SMTP_USER = "your-gmail-address@gmail.com"
$env:SMTP_PASS = "your-16-character-app-password"
$env:CONTACT_RECIPIENT = "bapinimundanjuma@gmail.com"
node server.js
```

Opening `contact.html` directly from File Explorer or using a static preview will not provide the API required by the form. The SMTP variables must be set again whenever a new PowerShell window is opened.
