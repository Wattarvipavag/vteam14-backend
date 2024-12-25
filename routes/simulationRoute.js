import { Router } from 'express';
import { startSimulation, endSimulation, stopBike, getSimUpdate } from '../controllers/simulationController.js';

const router = Router();

router.get('/start', startSimulation);
router.get('/stop', endSimulation);
router.get('/bike/stop', stopBike);
router.get('/update', getSimUpdate);

export default router;
