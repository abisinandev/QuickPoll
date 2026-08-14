// import { Router } from 'express';
// import { PollController } from '../controllers/poll.controller';
// import { PollService } from '../services/poll.service';
// import { PollRepository } from '../repositories/poll.repository';
// import { VoteRepository } from '../repositories/vote.repository';
// import { requireAuth } from '../middlewares/auth.middleware';
// import { SocketService } from '../services/socket.server';
// import app from '../app';
// import { createServer } from 'http';


// // const pollRepository = new PollRepository();
// // const voteRepository = new VoteRepository();
// // const httpServer = createServer(app);
// // const pollService = new PollService(pollRepository, voteRepository, new SocketService(httpServer));
// // const controller = new PollController(pollService);

// const router = Router();

// router.get('/', controller.getPolls.bind(controller));
// router.post('/:pollId/vote', requireAuth, controller.vote.bind(controller));

// export default router;

import { Router } from "express";
import { PollController } from "../controllers/poll.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const createPollRouter = (controller: PollController): Router => {
  const router = Router();
  router.get('/', controller.getPolls.bind(controller));
  router.post('/:pollId/vote', requireAuth, controller.vote.bind(controller));
  return router;
};