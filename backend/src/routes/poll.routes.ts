import { Router } from 'express';
import { PollController } from '../controllers/poll.controller';
import { PollService } from '../services/poll.service';
import { PollRepository } from '../repositories/poll.repository';
import { VoteRepository } from '../repositories/vote.repository';
import { requireAuth } from '../middlewares/auth.middleware';

const pollRepository = new PollRepository();
const voteRepository = new VoteRepository();
const pollService = new PollService(pollRepository, voteRepository);
const controller = new PollController(pollService);

const router = Router();

router.get('/', controller.getPolls.bind(controller));
router.post('/:pollId/vote', requireAuth, controller.vote.bind(controller));

export default router;
