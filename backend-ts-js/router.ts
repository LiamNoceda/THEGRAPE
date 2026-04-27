import { Router } from "express";

import * as authHandler from './handlers/auth.js';
import * as profileHandler from './handlers/profile.js';
import * as messagesHandler from './handlers/messages.js';
import * as postsHandler from './handlers/posts.js';

const router: Router = Router();

router.post('/auth', authHandler.loginOrRegister);
router.get('/user/:id', profileHandler.getUserData);
router.get('/chat/:id', messagesHandler.getHistory);
router.post('/chat/send', messagesHandler.sendMessage);
router.post('/posts', postsHandler.createPost);

export default router;
