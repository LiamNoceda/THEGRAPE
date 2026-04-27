export type User = {
    id: string;
    username: string;
    year: number;
    bio: string;
    avatar?: string;
};

export type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    time: number;
};

// =========================
// MOCK DATABASE (replace later with MySQL)
// =========================

const users: Record<string, User> = {
    "1": {
        id: "1",
        username: "Spacer_",
        year: 2000,
        bio: "Exploring the cosmos...",
        avatar: ""
    }
};

const messages: Message[] = [];

const friends: Record<string, string[]> = {
    "1": ["2"]
};

// =========================
// DB API (MYSQL READY STYLE)
// =========================

export const db = {
    user: {
        findById: (id: string) => users[id] || null,

        update: (id: string, data: Partial<User>) => {
            if (!users[id]) return null;
            users[id] = { ...users[id], ...data };
            return users[id];
        }
    },

    friends: {
        list: (id: string) => friends[id] || []
    },

    messages: {
        getChat: (userId: string) => {
            return messages.filter(
                m => m.from === userId || m.to === userId
            );
        },

        send: (msg: Message) => {
            messages.push(msg);
            return msg;
        }
    }
};
