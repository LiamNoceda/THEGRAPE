import { Router } from "express";

import * as authHandler from './handlers/auth';
import * as profileHandler from './handlers/profile';
import * as messagesHandler from './handlers/messages';
import * as postsHandler from './handlers/posts';

const router: Router = Router();

router.post('/auth', authHandler.loginOrRegister);
router.get('/user/:id', profileHandler.getUserData);
router.post('/user/:id', profileHandler.updateUserData);
router.get('/chat/:id', messagesHandler.getHistory);
router.post('/chat/send', messagesHandler.sendMessage);
router.post('/posts', postsHandler.createPost);

export default router;
