import { Router } from 'express';
import { PollController } from '../controllers/poll.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { ROUTES } from '../utils/routes';

export const createPollRouter = (controller: PollController): Router => {
  const router = Router();
  router.get(ROUTES.POLL.GET_ALL, controller.getPolls.bind(controller));
  router.post(ROUTES.POLL.VOTE, requireAuth, controller.vote.bind(controller));
  return router;
};