//Login && Password
/**
 * Функция для отправки данных авторизации на бэкенд
 * @param {Object} userData - Объект с username и password
 * @returns {Promise<Object>} - Ответ от сервера (success, message, redirect)
 */
export async function sendAuthRequest(userData) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Превращаем JS-объект в строку JSON для передачи по сети
            body: JSON.stringify(userData)
        });

        // Получаем JSON ответ от нашего handlers/auth.js
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Ошибка при связи с сервером:', error);
        return { 
            success: false, 
            message: "Сервер недоступен. Проверьте соединение." 
        };
    }
}
