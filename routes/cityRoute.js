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
router.get('/cityId/:id', getCityById);
router.get('/cityName/:name', getCityByName);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/cityId/:id', deleteCityById);
router.delete('/cityName/:name', deleteCityByName);
router.delete('/', deleteAllCities);

export default router;
