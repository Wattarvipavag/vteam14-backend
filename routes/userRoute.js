import { Router } from 'express';
import {
    getAllUsers,
    getUser,
    getUserOauth,
} from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/oauth/:id', getUserOauth);

export default router;
