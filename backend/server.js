const express = require('express');
const path = require('path');
const apiRouter = require('./router');

const app = express();
const PORT = 3000;

//Парсеры чтобы Backend понимал данные из форм и JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Статика раздаем frontend
//Указываем путь к папке frontend, чтобы сервер видел все внутри
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

//Роуты для страниц
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

//Папки из папки html
app.get('/profile', (req, res) => {
    res.sendFile(path.join(frontendPath, 'src/html/profile.html'));
});

app.get('/messages', (req, res) => {
    res.sendFile(path.join(frontendPath, 'src/html/messages.html'));
});

app.get('/friends', (req, res) => {
    res.sendFile(path.join(frontendPath, 'src/html/friends.html'));
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server THEGRAPE is work: http://localhost:${PORT}`);
});
