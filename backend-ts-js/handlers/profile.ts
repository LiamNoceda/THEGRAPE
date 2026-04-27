import { Request, Response } from "express";
import * as profileService from "../services/profile.service";

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

    const updated = profileService.updateUser(id, req.body as any);

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
