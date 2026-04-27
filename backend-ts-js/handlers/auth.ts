import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

interface User {
    id: number;
    username: String;
    password?: String;
    friends: number[];
    bio: String;
}

const dbPath = path.join(__dirname, '../db/users.json');

const readDB = (): User[] => {
    if (!fs.existsSync(dbPath)) return [];
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

const saveDB = (data: User[]): void => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const loginOrRegister = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Fill in all the fields" });
    }

    // Basic validation
    if (typeof username !== 'string' || username.trim().length < 3) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }

    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const users = readDB();
    const user = users.find(u => u.username === username);

    if (user) {
        // Support both plain-text and hashed passwords for backward compatibility
        const stored = user.password || '';
        const isPlain = stored && !stored.startsWith('$2a$') && !stored.startsWith('$2b$');

        let passwordMatches = false;
        try {
            if (isPlain) {
                passwordMatches = stored === password;
            } else {
                passwordMatches = bcrypt.compareSync(password, stored as string);
            }
        } catch (err) {
            passwordMatches = false;
        }

        if (passwordMatches) {
            // If it was plain-text, rehash and save
            if (isPlain) {
                const users = readDB();
                const idx = users.findIndex((u: any) => u.id === user.id);
                if (idx !== -1) {
                    users[idx].password = bcrypt.hashSync(password, 10);
                    saveDB(users);
                }
            }

            return res.json({
                success: true,
                message: "Welcome home",
                redirect: "/profile",
                user: { id: user.id, username: user.username }
            });
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
    } else {
        const newUser: User = {
            id: Date.now(),
            username,
            // hash password before saving
            password: bcrypt.hashSync(password, 10),
            friends: [],
            bio: "The new users THEGRAPE"
        };

        users.push(newUser);
        saveDB(users);

        return res.json({
            success: true,
            message: "Account created",
            redirect: "/profile",
            user: { id: newUser.id, username: newUser.username }
        });
    }
};
