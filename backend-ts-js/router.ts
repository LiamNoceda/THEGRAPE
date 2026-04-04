import { Router } from "express";

import * as authHandler from './handlers/auth';
import * as profileHandler from './handlers/profile';
import * as friendsHandler from './handlers/friends';
import * as messagesHandler from './handlers/messages';

const router: Router = Router();

router.post('/auth', authHandler.loginOrRegister);
router.get('/user/:id', profileHandler.getUserData);
router.get('/friends/list', friendsHandler.getFriends);
router.get('/chat/:id', messagesHandler.getHistory);
router.post('/chat/send', messagesHandler.sendMessage);

export default router;
