import { db } from "./db";

export const getUser = (id: string) => {
    if (!id) return null;
    return db.user.findById(id);
};

export const updateUser = (id: string, data: any) => {
    if (!id) return null;
    return db.user.update(id, data);
};
