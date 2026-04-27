// =========================
// GRAPE SPACE PROFILE JS
// =========================

// временно (потом заменишь на auth / token)
const USER_ID = localStorage.getItem("userId") || "1";

// =========================
// LOAD PROFILE
// =========================

async function loadProfile() {
    try {
        const res = await fetch(`/api/user/${USER_ID}`);
        const data = await res.json();

        if (!data.success) {
            console.error("Profile load error:", data.error);
            return;
        }

        const user = data.user;

        document.getElementById("username").textContent = user.username;
        document.getElementById("user-year").textContent = "Birth Year: " + user.birthYear;
        document.getElementById("bio").textContent = user.bio || "No signal found...";

        if (user.avatar) {
            document.getElementById("avatar").style.backgroundImage = `url(${user.avatar})`;
            document.getElementById("avatar").style.backgroundSize = "cover";
        }

    } catch (err) {
        console.error("LOAD PROFILE ERROR:", err);
    }
}

// =========================
// EDIT MODE TOGGLE
// =========================

function toggleEdit(state) {
    document.getElementById("view-mode").style.display = state ? "none" : "flex";
    document.getElementById("edit-mode").style.display = state ? "flex" : "none";

    if (state) {
        // заполнение формы текущими данными
        document.getElementById("input-username").value =
            document.getElementById("username").textContent;

        document.getElementById("input-year").value =
            document.getElementById("user-year").textContent.replace("Birth Year: ", "");

        document.getElementById("input-bio").value =
            document.getElementById("bio").textContent;
    }
}

// =========================
// SAVE PROFILE
// =========================

async function saveProfile() {
    const payload = {
        username: document.getElementById("input-username").value,
        birthYear: document.getElementById("input-year").value,
        bio: document.getElementById("input-bio").value
    };

    try {
        const res = await fetch(`/api/user/${USER_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.success) {
            console.error("SAVE ERROR:", data.error);
            return;
        }

        toggleEdit(false);
        loadProfile();

    } catch (err) {
        console.error("SAVE PROFILE ERROR:", err);
    }
}

// =========================
// AVATAR PREVIEW
// =========================

function previewImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("avatar").style.backgroundImage = `url(${e.target.result})`;
        document.getElementById("avatar").style.backgroundSize = "cover";
    };

    reader.readAsDataURL(file);
}

// =========================
// CREATE SIGNAL (POST)
// =========================

async function createSignal() {
    const text = document.getElementById("signal-text").value;
    const type = document.getElementById("signal-type").value;

    if (!text.trim()) return;

    try {
        await fetch("/api/chat/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: USER_ID,
                text,
                type
            })
        });

        document.getElementById("signal-text").value = "";

        // позже можно заменить на WebSocket
        console.log("Signal transmitted");

    } catch (err) {
        console.error("SIGNAL ERROR:", err);
    }
}

// =========================
// INIT
// =========================

loadProfile();
