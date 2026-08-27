import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { ROUTES } from '../utils/routes';

export const createUserRouter = (controller: UserController): Router => {
  const router = Router();

  router.post(ROUTES.USER.JOIN, controller.joinGuest.bind(controller));
  router.get(ROUTES.USER.ME, controller.getMe.bind(controller));

  return router;
};
