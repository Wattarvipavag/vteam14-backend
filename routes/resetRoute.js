import { Router } from 'express';
import { deleteAll, recreateAll } from '../controllers/resetController.js';

const router = Router();

router.delete('/', deleteAll);
router.post('/', recreateAll);

export default router;
