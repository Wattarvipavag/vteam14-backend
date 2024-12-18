import { Router } from 'express';
import { getAllUsers, getUser, getUserOauth, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/oauth/:id', getUserOauth);
router.post('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
