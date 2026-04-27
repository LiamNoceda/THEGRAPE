import { Request, Response } from "express";
import * as messagesService from "../services/messages.service";

// =========================
// CHAT HISTORY
// =========================

export const getHistory = (req: Request, res: Response) => {
    const rawId = req.params.id;
    const userId = (Array.isArray(rawId) ? rawId[0] : rawId) || "";

    const messages = messagesService.getHistory(userId);

    return res.json({
        success: true,
        messages
    });
};

// =========================
// SEND MESSAGE
// =========================

export const sendMessage = (req: Request, res: Response) => {
    const { from, to, text } = req.body;

    const msg = messagesService.sendMessage(from, to, text);

    if (!msg) {
        return res.status(400).json({
            success: false,
            error: "INVALID_MESSAGE"
        });
    }

    return res.json({
        success: true,
        message: msg
    });
};
