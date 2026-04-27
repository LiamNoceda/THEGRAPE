const API = "/api";

const currentUser = "1";
let activeChat = "2";

// =========================
// LOAD CHATS (TEMP MOCK UI)
// =========================

async function loadChats() {
    const container = document.getElementById("chats-container");

    // пока мок — потом заменишь на /friends + /chat list
    const mockChats = [
        { id: "2", name: "User_Alpha" },
        { id: "3", name: "User_Beta" }
    ];

    container.innerHTML = "";

    mockChats.forEach(chat => {
        const div = document.createElement("div");
        div.className = "chat-item";
        div.innerText = chat.name;

        div.onclick = () => {
            activeChat = chat.id;
            loadMessages();
        };

        container.appendChild(div);
    });
}

// =========================
// LOAD MESSAGES
// =========================

async function loadMessages() {
    const res = await fetch(`${API}/chat/${currentUser}`);
    const data = await res.json();

    const box = document.getElementById("message-flow");

    box.innerHTML = "";

    data.messages
        .filter(m =>
            (m.from === currentUser && m.to === activeChat) ||
            (m.from === activeChat && m.to === currentUser)
        )
        .forEach(msg => {
            const div = document.createElement("div");
            div.className = msg.from === currentUser ? "msg mine" : "msg";

            div.innerText = msg.text;

            box.appendChild(div);
        });

    box.scrollTop = box.scrollHeight;
}

// =========================
// SEND MESSAGE
// =========================

document.getElementById("chat-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("message-input");

    const text = input.value;
    if (!text) return;

    await fetch(`${API}/chat/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: currentUser,
            to: activeChat,
            text
        })
    });

    input.value = "";
    loadMessages();
});

// =========================
// INIT
// =========================

loadChats();
loadMessages();
