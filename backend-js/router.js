const express = require('express');
const router = express.Router();

//Имитируем мозги
const authHandler = require('./handlers/auth');
const profileHandler = require('./handlers/profile');
const friendsHandler = require('./handlers/friends');
const messagesHandler = require('./handlers/messages');

//Маршруты Routes

//Auth: вход и регистрация для index.html
router.post('/auth', authHandler.loginOrRegister);

//Profile: получение данных
router.get('/user/:id', profileHandler.getUserData);

//Friend: список друзей
router.get('/friends/list', friendsHandler.getFriends);

//Message: Chat
router.get('/chat/:id', messagesHandler.getHistory);
router.post('/chat/send', messagesHandler.sendMessage);

module.exports = router;
