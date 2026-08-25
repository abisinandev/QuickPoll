import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { ROUTES } from '../utils/routes';

export const createChatRouter = (controller: ChatController): Router => {
  const router = Router();

  router.get(ROUTES.CHAT.GET_MESSAGES, requireAuth, controller.getRecentMessages.bind(controller));

  return router;
};
