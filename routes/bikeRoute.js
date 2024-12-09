import { Router } from 'express';
import { getAllBikes, getBike, createBike, updateBike, deleteBike, deleteAllBikes } from '../controllers/bikeController.js';

const router = Router();

router.get('/', getAllBikes);
router.get('/:id', getBike);
router.post('/', createBike);
router.put('/:id', updateBike);
router.delete('/:id', deleteBike);
router.delete('/', deleteAllBikes);

export default router;
