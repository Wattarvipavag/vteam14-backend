import City from '../models/cityModel.js';

export async function getAllCities(req, res) {
    try {
        const cities = await City.find().exec();
        res.status(200).json(cities);
    } catch (e) {
        res.status(500).json({ message: `getAllCities ${e.message}` });
    }
}

export async function getCityById(req, res) {
    try {
        const cityId = req.params.id;
        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({ message: `No city found with ${cityId}` });
        }

        return res.status(200).json({ message: 'City exists', city: city });
    } catch (e) {
        res.status(500).json({ message: `getCityById ${e.message}` });
    }
}

export async function getCityByName(req, res) {
    try {
        const cityName = req.params.name;
        const city = await City.findOne({ name: cityName });

        if (!city) {
            return res.status(404).json({ message: `No city found with ${cityName}` });
        }

        return res.status(200).json({ message: 'City exists', city: city });
    } catch (e) {
        res.status(500).json({ message: `getCityByName ${e.message}` });
    }
}

export async function createCity(req, res) {
    try {
        const newCity = await City.create({
            name: req.body.name,
            minuteRate: req.body.minuteRate,
            surcharge: req.body.surcharge,
            discount: req.body.discount,
            location: req.body.location,
        });
        return res.status(201).json({ message: 'City created', city: newCity });
    } catch (e) {
        res.status(500).json({ message: `createCity ${e.message}` });
    }
}

export async function deleteCityById(req, res) {
    try {
        const cityId = req.params.id;
        const city = await City.findOneAndDelete({ _id: cityId });

        return res.status(200).json({ message: 'City deleted', city: city });
    } catch (e) {
        res.status(500).json({ message: `deleteCityById ${e.message}` });
    }
}

export async function deleteCityByName(req, res) {
    try {
        const cityName = req.params.name;
        const city = await City.findOneAndDelete({ name: cityName });

        return res.status(200).json({ message: 'City deleted', city: city });
    } catch (e) {
        res.status(500).json({ message: `deleteCityByName ${e.message}` });
    }
}

export async function deleteAllCities(req, res) {
    try {
        await City.deleteMany();

        return res.status(200).json({ message: 'Cities deleted' });
    } catch (e) {
        res.status(500).json({ message: `deleteCityByName ${e.message}` });
    }
}
