import { Router } from 'express';
import { createRental, endRental, getAllRentals, getOneRental, getUserRentals, deleteRental } from '../controllers/rentalController.js';

const router = Router();

router.get('/', getAllRentals);
router.get('/:id', getOneRental);
router.get('/userrentals/:id', getUserRentals);
router.post('/', createRental);
router.put('/:id', endRental);
router.delete('/', deleteRental);

export default router;
