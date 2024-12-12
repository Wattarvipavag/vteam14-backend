import Bike from '../models/bikeModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import City from '../models/cityModel.js';

export async function getAllParkingAreas(req, res) {
    try {
        const parkingAreas = await ParkingArea.find().exec();
        res.status(200).json(parkingAreas);
    } catch (e) {
        res.status(500).json({ message: `getAllParkingAreas ${e.message}` });
    }
}

export async function getParkingArea(req, res) {
    try {
        const parkingAreaId = req.params.id;
        const parkingArea = await ParkingArea.findById(parkingAreaId);

        if (!parkingArea) {
            return res.status(404).json({ message: `No parkingArea found with ${parkingAreaId}` });
        }

        return res.status(200).json({ message: 'parkingArea exists', parkingArea });
    } catch (e) {
        res.status(500).json({ message: `getParkingArea ${e.message}` });
    }
}

export async function createParkingArea(req, res) {
    try {
        const city = await City.findById(req.body.cityId);
        const newParkingArea = await ParkingArea.create({
            name: req.body.name,
            location: req.body.location,
            cityId: req.body.cityId,
            bikes: req.body.bikes,
        });
        city.parkingAreas.push(newParkingArea._id);
        await city.save();
        return res.status(201).json({ message: 'ParkingArea created', newParkingArea });
    } catch (e) {
        res.status(500).json({ message: `createParkingArea ${e.message}` });
    }
}

export async function updateParkingArea(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const location = req.body.location;
        const cityId = req.body.cityId;
        const bikes = req.body.bikes;

        const parkingArea = await ParkingArea.findOneAndUpdate({ _id: id }, { name, location, cityId, bikes });
        return res.status(200).json({ message: 'ParkingArea updated', parkingArea });
    } catch (e) {
        res.status(500).json({ message: `updateParkingArea ${e.message}` });
    }
}

export async function addBikeToParkingArea(req, res) {
    try {
        const id = req.params.id;
        const bikeId = req.body.bikeId;
        const parkingArea = await ParkingArea.findById(id);
        const bike = await Bike.findById(bikeId);
        parkingArea.bikes.push(bikeId);
        await parkingArea.save();
        bike.parkingAreaId = id;
        await bike.save();
        return res.status(200).json({ message: 'Bike added to parking area', parkingArea });
    } catch (e) {
        res.status(500).json({ message: `addBikeToParkingArea ${e.message}` });
    }
}

export async function deleteBikeFromParkingArea(req, res) {
    try {
        const id = req.params.id;
        const bikeId = req.body.bikeId;

        const parkingArea = await ParkingArea.findById(id);
        const bike = await Bike.findById(bikeId);
        parkingArea.bikes.pull(bikeId);
        await parkingArea.save();
        bike.parkingAreaId = undefined;
        await bike.save();
        return res.status(200).json({ message: 'Bike deleted from parking area', parkingArea });
    } catch (e) {
        res.status(500).json({ message: `deleteBikeFromParkingArea ${e.message}` });
    }
}

export async function deleteParkingArea(req, res) {
    try {
        const id = req.params.id;
        const parkingArea = await ParkingArea.findOneAndDelete({ _id: id });
        const cityId = parkingArea.cityId;
        const city = await City.findById({ _id: cityId });

        city.parkingAreas.pull(id);
        await city.save();

        if (parkingArea.bikes.length > 0) {
            parkingArea.bikes.forEach(async (bikeId) => {
                const bike = await Bike.findById(bikeId);
                bike.parkingAreaId = undefined;
                await bike.save();
            });
        }

        return res.status(200).json({ message: 'Parking area deleted', parkingArea });
    } catch (e) {
        res.status(500).json({ message: `deleteParkingArea ${e.message}` });
    }
}

export async function deleteAllParkingAreas(req, res) {
    try {
        await ParkingArea.deleteMany();
        return res.status(200).json({ message: 'Parking areas deleted' });
    } catch (e) {
        res.status(500).json({ message: `deleteAllParkingAreas ${e.message}` });
    }
}
