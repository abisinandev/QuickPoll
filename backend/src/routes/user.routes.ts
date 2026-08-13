import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const controller = new UserController(userService)

router.post('/join', controller.joinGuest.bind(controller));
router.get('/me', controller.getMe.bind(controller));

export default router;
