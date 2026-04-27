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
        return data;
    } catch (err) {
        return { success: false, message: 'Network error' };
    }
}
