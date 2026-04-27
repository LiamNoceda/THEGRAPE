import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const dbPath = path.join(__dirname, '../db/posts.json');

const readDB = () => {
    if (!fs.existsSync(dbPath)) return [];
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

const saveDB = (data: any[]) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const createPost = (req: Request, res: Response) => {
    const { author, text } = req.body;

    if (!author || !text) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const posts = readDB();
    const post = {
        id: Date.now(),
        author,
        text,
        time: Date.now()
    };

    posts.push(post);
    saveDB(posts);

    return res.json({ success: true, post });
};
