import express, { Request, Response } from 'express';
import path from 'path';
import apiRouter from './router.js';

const app = express();
const PORT = 3000;

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// STATIC FRONTEND
// =========================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// =========================
// PAGES (FRONTEND ROUTES)
// =========================

// главный вход → профиль
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'profile.html'));
});

// messages page
app.get('/messages', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'messages.html'));
});

// friends page
app.get('/friends', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'friends.html'));
});

// =========================
// API ROUTES
// =========================
app.use('/api', apiRouter);

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server THEGRAPE running: http://localhost:${PORT}`);
});
