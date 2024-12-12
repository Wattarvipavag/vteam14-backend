import Bike from '../models/bikeModel.js';
import ChargingStation from '../models/chargingStationModel.js';
import City from '../models/cityModel.js';

export async function getAllChargingStations(req, res) {
    try {
        const chargingStations = await ChargingStation.find().exec();
        res.status(200).json(chargingStations);
    } catch (e) {
        res.status(500).json({ message: `getAllChargingStations ${e.message}` });
    }
}

export async function getChargingStation(req, res) {
    try {
        const chargingStationId = req.params.id;
        const chargingStation = await ChargingStation.findById(chargingStationId);

        if (!chargingStation) {
            return res.status(404).json({ message: `No chargingStation found with ${chargingStationId}` });
        }

        return res.status(200).json({ message: 'chargingStation exists', chargingStation });
    } catch (e) {
        res.status(500).json({ message: `getChargingStation ${e.message}` });
    }
}

export async function createChargingStation(req, res) {
    try {
        const city = await City.findById(req.body.cityId);
        const newChargingStation = await ChargingStation.create({
            name: req.body.name,
            location: req.body.location,
            cityId: req.body.cityId,
            bikes: req.body.bikes,
        });
        city.chargingStations.push(newChargingStation._id);
        await city.save();
        return res.status(201).json({ message: 'ChargingStation created', newChargingStation });
    } catch (e) {
        res.status(500).json({ message: `createChargingStation ${e.message}` });
    }
}

export async function updateChargingStation(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const location = req.body.location;
        const cityId = req.body.cityId;
        const bikes = req.body.bikes;

        const chargingStation = await ChargingStation.findOneAndUpdate({ _id: id }, { name, location, cityId, bikes });
        return res.status(200).json({ message: 'Charging station updated', chargingStation });
    } catch (e) {
        res.status(500).json({ message: `updateChargingStation ${e.message}` });
    }
}

export async function addBikeToChargingStation(req, res) {
    try {
        const id = req.params.id;
        const bikeId = req.body.bikeId;
        const chargingStation = await ChargingStation.findById(id);
        const bike = await Bike.findById(bikeId);
        chargingStation.bikes.push(bikeId);
        await chargingStation.save();
        bike.chargingStationId = id;
        await bike.save();
        return res.status(200).json({ message: 'Bike added to charging station', chargingStation });
    } catch (e) {
        res.status(500).json({ message: `addBikeToChargingStation ${e.message}` });
    }
}

export async function deleteBikeFromChargingStation(req, res) {
    try {
        const id = req.params.id;
        const bikeId = req.body.bikeId;

        const chargingStation = await ChargingStation.findById(id);
        const bike = await Bike.findById(bikeId);
        chargingStation.bikes.pull(bikeId);
        await chargingStation.save();
        bike.chargingStationId = undefined;
        await bike.save();
        return res.status(200).json({ message: 'Bike deleted from charging station', chargingStation });
    } catch (e) {
        res.status(500).json({ message: `deleteBikeFromChargingStation ${e.message}` });
    }
}

export async function deleteChargingStation(req, res) {
    try {
        const id = req.params.id;
        const chargingStation = await ChargingStation.findOneAndDelete({ _id: id });
        const cityId = chargingStation.cityId;
        const city = await City.findById({ _id: cityId });

        city.chargingStations.pull(id);
        await city.save();

        if (chargingStation.bikes.length > 0) {
            chargingStation.bikes.forEach(async (bikeId) => {
                const bike = await Bike.findById(bikeId);
                bike.chargingStationId = undefined;
                await bike.save();
            });
        }

        return res.status(200).json({ message: 'Charging station deleted', chargingStation });
    } catch (e) {
        res.status(500).json({ message: `deleteChargingStation ${e.message}` });
    }
}

export async function deleteAllChargingStations(req, res) {
    try {
        await ChargingStation.deleteMany();
        return res.status(200).json({ message: 'Chargingstations deleted' });
    } catch (e) {
        res.status(500).json({ message: `deleteAllChargingStations ${e.message}` });
    }
}
