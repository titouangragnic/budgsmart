import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const healthController = new HealthController();

router.get('/health', healthController.getHealth);
router.get('/ready', healthController.getReadiness);
router.get('/live', healthController.getLiveness);

export default router;
