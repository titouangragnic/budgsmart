import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// All routes are protected
router.use(authMiddleware);

router.get('/profile', userController.getUser);
router.put('/profile', userController.updateUser);
router.delete('/profile', userController.deleteUser);
router.get('/stats', userController.getUserStats);

export default router;
