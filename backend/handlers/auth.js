const fs = require('fs');
const path = require('path');

//путь к файлу который будет нашей DB
const dbPath = path.join(__dirname, '../db/users.json');

//Функция длдя чтения DB
const readDB = () => {
    if (!fs.existsSync(dbPath)) return []; //При отсутствии файла вохвразает пустой список
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

//Функция для записи в DB
const saveDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

exports.loginOrRegister = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Заполни все поля" });
    }

    const users = readDB(); //Читаем всех юзеров
    const user = users.find(u => u.username === username); //Чешем базу

    if (user) {
        if (user.password === password) {
            return res.json({
                success: true,
                message: "Welcome home",
                redirect: "/profile"
            });
        } else {
            return res.status(401).json({ success: false, message: "Неверный пароль"});
        }
    } else {
        const newUser = {
            id: Date.now(),
            username,
            password,
            friends: [],
            bio: "The new users THEGRAPE"
        };

        users.push(newUser);
        saveDB(users);

        return res.json({
            success: true,
            message: "Аккаунт создан",
            redirect: "/profile"
        });
    }
};
