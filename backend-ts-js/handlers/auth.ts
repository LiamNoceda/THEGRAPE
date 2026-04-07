import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

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

    const users = readDB();
    const user = users.find(u => u.username === username);

    if (user) {
        if (user.password === password) {
            return res.json({
                success: true,
                message: "Welcome home",
                redirect: "/profile"
            });
        } else {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
    } else {
        const newUser: User = {
            id: Date.now(),
            username,
            password,
            friends: [],
            bio: "The new users THEGRAPE"
        };

        users.push(newUser);
        saveDB(users);

        return res.json({
            success: true,
            message: "Account created",
            redirect: "/profile"
        });
    }
};
