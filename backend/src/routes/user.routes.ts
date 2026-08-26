import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { ROUTES } from '../utils/routes';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const controller = new UserController(userService);

router.post(ROUTES.USER.JOIN, controller.joinGuest.bind(controller));
router.get(ROUTES.USER.ME, controller.getMe.bind(controller));

export default router;
