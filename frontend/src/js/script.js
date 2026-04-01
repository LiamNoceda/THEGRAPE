// Импортируем курьера из папки api
import { sendAuthRequest } from './api/auth.js';

const loginForm = document.getElementById('login-form');

loginForm.onsubmit = async (e) => {
    e.preventDefault(); // Чтобы страница не перезагрузилась

    // 1. Собираем данные (username и password)
    const formData = new FormData(loginForm);
    const userData = Object.fromEntries(formData.entries());

    // 2. Отправляем курьера на backend
    const result = await sendAuthRequest(userData);

    // 3. Обрабатываем ответ
    if (result.success) {
        // Сохраняем имя, чтобы профиль знал, кого рисовать
        localStorage.setItem('currentUser', userData.username);
        
        // Улетаем на страницу профиля (путь из корня)
        window.location.href = 'src/html/profile.html';
    } else {
        alert('Access Denied: ' + result.message);
    }
};
