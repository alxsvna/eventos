const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const XLSX = require('xlsx');
const mammoth = require('mammoth');
const QRCode = require('qrcode');

let resend = null;
try {
  const { Resend } = require('resend');
  resend = new Resend('re_6VNE86TK_8zNdCCC7TztZ3YkLgSXhGW4k');
} catch (e) {
  console.log("Resend не установлен, письма отправляться не будут");
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const db = new Database('chat.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, text TEXT, fileUrl TEXT, fileName TEXT, time TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS invite_files (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id TEXT, client_id TEXT, emails TEXT, file_name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});

const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });
app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});

app.post('/api/invite-file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  
  const { eventTitle, eventDate, eventLocation, eventId } = req.body;
  let emails = [];
  const ext = path.extname(req.file.originalname).toLowerCase();
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

  try {
    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      data.forEach(row => { if (row) row.forEach(cell => { if (cell) { const m = String(cell).match(emailRegex); if (m) emails.push(...m); } }); });
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      const matches = result.value.match(emailRegex);
      if (matches) emails = matches;
    } else if (ext === '.txt' || ext === '.csv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const matches = content.match(emailRegex);
      if (matches) emails = matches;
    } else {
      return res.status(400).json({ error: 'Формат не поддерживается. Используйте .xlsx, .csv, .docx или .txt' });
    }

    emails = [...new Set(emails.map(e => e.toLowerCase().trim()))];
    if (emails.length === 0) return res.status(400).json({ error: 'В файле не найдено ни одного email' });

    const link = `http://localhost:3000/#/register/${eventId}`;
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f8fc; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;"><h1 style="color: #3a5a8c; margin: 0;">ИвентОС</h1></div>
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #1e2a3a; margin-top: 0;">Приглашение на мероприятие!</h2>
          <p style="color: #5f7085; font-size: 16px;">Вы приглашены на мероприятие:</p>
          <h3 style="color: #6b9bd1;">${eventTitle}</h3>
          <p style="color: #1e2a3a;"><b>📅 Дата:</b> ${eventDate}</p>
          <p style="color: #1e2a3a;"><b>📍 Место:</b> ${eventLocation || 'Уточняется'}</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${link}" style="background: #3a5a8c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Подтвердить участие</a>
          </div>
        </div>
      </div>
    `;

    let sent = 0;
    let firstError = '';
    if (resend) {
      for (const email of emails.slice(0, 50)) {
        try {
          await resend.emails.send({ from: 'ИвентОС <onboarding@resend.dev>', to: email, subject: `Приглашение: ${eventTitle}`, html: htmlTemplate });
          sent++;
        } catch (err) {
          if (!firstError) firstError = err.message;
        }
      }
    }
    
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    if (sent === 0 && emails.length > 0) {
      return res.status(500).json({ error: firstError || 'Не удалось отправить письма (проверьте настройки Resend)' });
    }

    res.json({ success: true, message: `Найдено ${emails.length} почт. Успешно отправлено: ${sent}.` });
  } catch (error) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Ошибка чтения файла: ' + error.message });
  }
});

app.post('/api/upload-client-list', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  const { eventId, clientId } = req.body;
  const ext = path.extname(req.file.originalname).toLowerCase();
  let emails = [];
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

  try {
    if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      data.forEach(row => { if(row) row.forEach(cell => { if(cell) { const m = String(cell).match(emailRegex); if(m) emails.push(...m); } }); });
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      const matches = result.value.match(emailRegex);
      if (matches) emails = matches;
    } else if (ext === '.txt' || ext === '.csv') {
      const content = fs.readFileSync(req.file.path, 'utf8');
      const matches = content.match(emailRegex);
      if (matches) emails = matches;
    }

    emails = [...new Set(emails.map(e => e.toLowerCase().trim()))];
    if (emails.length === 0) return res.status(400).json({ error: 'Почты не найдены' });

    const stmt = db.prepare('INSERT INTO invite_files (event_id, client_id, emails, file_name) VALUES (?, ?, ?, ?)');
    stmt.run(eventId, clientId, JSON.stringify(emails), req.file.originalname);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, count: emails.length });
  } catch (error) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Ошибка чтения файла' });
  }
});

app.get('/api/get-client-list/:eventId', (req, res) => {
  const row = db.prepare('SELECT * FROM invite_files WHERE event_id = ? ORDER BY id DESC LIMIT 1').get(req.params.eventId);
  if (!row) return res.json({ exists: false });
  res.json({ exists: true, emails: JSON.parse(row.emails), fileName: row.file_name });
});

app.get('/api/qrcode', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).send('Нет текста');
  try {
    const qrImage = await QRCode.toDataURL(text, { width: 300, margin: 2, color: { dark: '#3a5a8c', light: '#ffffff' } });
    res.send(qrImage);
  } catch (err) { res.status(500).send('Ошибка'); }
});

const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  const history = db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 50').all().reverse();
  socket.emit('chat history', history);
  socket.on('chat message', (data) => {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const stmt = db.prepare('INSERT INTO messages (user, text, fileUrl, fileName, time) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(data.user, data.text || '', data.fileUrl || null, data.fileName || null, time);
    io.emit('chat message', { id: info.lastInsertRowid, user: data.user, text: data.text || '', fileUrl: data.fileUrl || null, fileName: data.fileName || null, time: time });
  });
});

app.use(express.static(__dirname));
app.use((req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Сервер запущен на http://localhost:${PORT}`); });
