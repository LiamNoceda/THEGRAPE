import { db } from "./db.js";

export const getHistory = (userId: string) => {
    if (!userId) return [];
    return db.messages.getChat(userId);
};

export const sendMessage = (from: string, to: string, text: string) => {
    if (!from || !to || !text) return null;

    return db.messages.send({
        id: Date.now().toString(),
        from,
        to,
        text,
        time: Date.now()
    });
};
