import express, { Request, Response } from 'express';
import path from 'path';
import apiRouter from './router';

const app = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'profile.html'));
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'messages.html'));
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'friends'));
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server THEGRAPE is working: http://localhost:${PORT}`);
});
