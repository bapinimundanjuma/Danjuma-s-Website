require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const nodemailer = require('nodemailer');

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const dataDirectory = path.join(root, '.data');
const messagesFile = path.join(dataDirectory, 'messages.json');
const contactRecipient = process.env.CONTACT_RECIPIENT || 'bapinimundanjuma@gmail.com';

const mailer = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null;

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function send(response, status, body, type = 'text/plain; charset=utf-8') {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(body)
    });
    response.end(body);
}

function sendJson(response, status, data) {
    send(response, status, JSON.stringify(data), 'application/json; charset=utf-8');
}

function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => {
            body += chunk;
            if (body.length > 10000) {
                request.destroy();
                reject(new Error('Request body is too large.'));
            }
        });
        request.on('end', () => resolve(new URLSearchParams(body)));
        request.on('error', reject);
    });
}

function saveMessage(message) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    let messages = [];

    if (fs.existsSync(messagesFile)) {
        try {
            messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
        } catch {
            messages = [];
        }
    }

    messages.push(message);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

async function sendMessageEmail(message) {
    if (!mailer) {
        throw new Error('SMTP settings are not configured.');
    }

    await mailer.sendMail({
        from: process.env.SMTP_USER,
        to: contactRecipient,
        replyTo: message.email,
        subject: `New website message from ${message.name}`,
        text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`
    });
}

async function handleContact(request, response) {
    try {
        const form = await readRequestBody(request);
        const name = (form.get('name') || '').trim();
        const email = (form.get('email') || '').trim();
        const message = (form.get('message') || '').trim();
        const errors = [];

        if (!name) errors.push('Please enter your name.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address.');
        }
        if (!message) errors.push('Please write a message.');

        if (errors.length) {
            sendJson(response, 400, { ok: false, errors });
            return;
        }

        const submittedMessage = {
            name,
            email,
            message,
            submittedAt: new Date().toISOString()
        };

        await sendMessageEmail(submittedMessage);
        saveMessage(submittedMessage);
        sendJson(response, 200, { ok: true, name });
    } catch (error) {
        console.error('Contact email failed:', error.message);
        sendJson(response, 500, { ok: false, errors: ['The message could not be sent. Please try again later.'] });
    }
}

function serveFile(request, response, pathname) {
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const safePath = path.normalize(requestedPath).replace(/^([.][.][/\\])+/, '');
    const filePath = path.join(root, safePath);

    if (!filePath.startsWith(root) || path.basename(filePath) === 'messages.json' || path.extname(filePath) === '.php') {
        send(response, 404, 'Page not found.');
        return;
    }

    fs.readFile(filePath, (error, file) => {
        if (error) {
            send(response, error.code === 'ENOENT' ? 404 : 500, error.code === 'ENOENT' ? 'Page not found.' : 'Could not read that file.');
            return;
        }
        send(response, 200, file, contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
    });
}

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

    if (request.method === 'POST' && requestUrl.pathname === '/api/contact') {
        handleContact(request, response);
        return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/contact.php') {
        response.writeHead(302, { Location: '/contact.html' });
        response.end();
        return;
    }

    if (request.method !== 'GET') {
        send(response, 405, 'Method not allowed.');
        return;
    }

    serveFile(request, response, requestUrl.pathname);
});

server.listen(port, () => {
    console.log(`Danjuma's WebPage is running at http://localhost:${port}`);
});
