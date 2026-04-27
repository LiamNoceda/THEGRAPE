import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(__dirname, '../db/users.json');

const readDB = () => {
    if (!fs.existsSync(dbPath)) return [];
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

const saveDB = (data: any[]) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const getUser = (id: string) => {
    if (!id) return null;
    const users = readDB();
    return users.find((u: any) => String(u.id) === String(id)) || null;
};

export const updateUser = (id: string, data: any) => {
    if (!id) return null;
    const users = readDB();
    const idx = users.findIndex((u: any) => String(u.id) === String(id));
    if (idx === -1) return null;
    const updated = { ...users[idx], ...data };
    if (data && data.password) {
        // hash incoming password
        updated.password = bcrypt.hashSync(String(data.password), 10);
    }
    users[idx] = updated;
    saveDB(users);
    return users[idx];
};
