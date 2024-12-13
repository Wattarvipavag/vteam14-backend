import { Router } from 'express';
import { getAllUsers, getUser, getUserOauth, updateUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/oauth/:id', getUserOauth);
router.post('/:id', updateUser);

export default router;
