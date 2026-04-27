import { Request, Response } from "express";
import * as profileService from "../services/profile.service.js";

export const getUserData = (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) || "";

    const user = profileService.getUser(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            error: "USER_NOT_FOUND"
        });
    }

    return res.json({
        success: true,
        user
    });
};

export const updateUserData = (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) || "";

    const body = req.body as any;

    // Validate if username or password are provided
    if (body.username && (typeof body.username !== 'string' || body.username.trim().length < 3)) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters' });
    }

    if (body.password && (typeof body.password !== 'string' || body.password.length < 6)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const updated = profileService.updateUser(id, body);

    if (!updated) {
        return res.status(404).json({
            success: false,
            error: "USER_NOT_FOUND"
        });
    }

    return res.json({
        success: true,
        user: updated
    });
};
