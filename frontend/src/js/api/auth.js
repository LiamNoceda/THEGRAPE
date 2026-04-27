export async function sendAuthRequest(userData) {
    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await res.json();
        // Save username and user id (if returned) for profile page
        if (data && data.success) {
            if (userData.username) localStorage.setItem('currentUser', userData.username);
            if (data.user && data.user.id) localStorage.setItem('currentUserId', String(data.user.id));
        }
        return data;
    } catch (err) {
        return { success: false, message: 'Network error' };
    }
}
