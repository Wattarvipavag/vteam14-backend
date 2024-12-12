import { Router } from 'express';
import {
    getAllChargingStations,
    getChargingStation,
    createChargingStation,
    updateChargingStation,
    deleteChargingStation,
    deleteAllChargingStations,
    addBikeToChargingStation,
    deleteBikeFromChargingStation,
} from '../controllers/chargingStationController.js';

const router = Router();

router.get('/', getAllChargingStations);
router.get('/:id', getChargingStation);
router.post('/addbike/:id', addBikeToChargingStation);
router.post('/', createChargingStation);
router.put('/deletebike/:id', deleteBikeFromChargingStation);
router.put('/:id', updateChargingStation);
router.delete('/:id', deleteChargingStation);
router.delete('/', deleteAllChargingStations);

export default router;
