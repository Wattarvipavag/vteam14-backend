import { Router } from 'express';
import {
    getAllUsers,
    getUser,
    getUserOauth,
    updateUser,
    deleteUser,
    deleteCustomers,
    createUser,
    getUserHistory,
} from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.get('/oauth/:id', getUserOauth);
router.get('/history/:id', getUserHistory);
router.post('/create', createUser);
router.post('/:id', updateUser);
router.delete('/:id', deleteUser);
router.delete('/role/customer', deleteCustomers);

export default router;
