import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

if (!fs.existsSync(path.dirname(CONTACTS_FILE))) {
  fs.mkdirSync(path.dirname(CONTACTS_FILE), { recursive: true });
}

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  let contacts: Record<string, unknown>[] = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    try {
      contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
    } catch {
      contacts = [];
    }
  }

  contacts.push({
    name,
    email,
    phone: phone || '',
    service: service || 'Not specified',
    message,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

  res.json({ success: true, message: 'Thank you. We will contact you shortly.' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
