import { Router } from 'express';
import {
    getAllParkingAreas,
    getParkingArea,
    addBikeToParkingArea,
    createParkingArea,
    deleteBikeFromParkingArea,
    updateParkingArea,
    deleteParkingArea,
    deleteAllParkingAreas,
} from '../controllers/parkingAreaController.js';

const router = Router();

router.get('/', getAllParkingAreas);
router.get('/:id', getParkingArea);
router.post('/addbike/:id', addBikeToParkingArea);
router.post('/', createParkingArea);
router.put('/deletebike/:id', deleteBikeFromParkingArea);
router.put('/:id', updateParkingArea);
router.delete('/:id', deleteParkingArea);
router.delete('/', deleteAllParkingAreas);

export default router;
