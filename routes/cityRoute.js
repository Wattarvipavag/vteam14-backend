import { Router } from 'express';
import {
    getAllCities,
    getCityById,
    getCityByName,
    createCity,
    updateCity,
    deleteCityByName,
    deleteCityById,
    deleteAllCities,
} from '../controllers/cityController.js';

const router = Router();

router.get('/', getAllCities);
router.get('/cityid/:id', getCityById);
router.get('/cityname/:name', getCityByName);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/cityid/:id', deleteCityById);
router.delete('/cityname/:name', deleteCityByName);
router.delete('/', deleteAllCities);

export default router;
