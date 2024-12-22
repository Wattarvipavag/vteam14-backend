import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import Chargingstation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import QRCode from 'qrcode';

export async function getAllBikes(req, res) {
    try {
        const bikes = await Bike.find().exec();
        res.status(200).json(bikes);
    } catch (e) {
        res.status(500).json({ message: `getAllBikes ${e.message}` });
    }
}

export async function getBike(req, res) {
    try {
        const bikeId = req.params.id;
        const bike = await Bike.findById(bikeId);

        if (!bike) {
            return res.status(404).json({ message: `No bike found with ${bikeId}` });
        }

        return res.status(200).json({ message: 'Bike exists', bike: bike });
    } catch (e) {
        res.status(500).json({ message: `getBike ${e.message}` });
    }
}

export async function createBike(req, res) {
    try {
        const city = await City.findById(req.body.cityId);
        const parkingArea = await ParkingArea.findById(req.body.parkingAreaId);

        const newBike = await Bike.create({
            available: req.body.name,
            location: parkingArea.location,
            cityId: req.body.cityId,
            parkingAreaId: req.body.parkingAreaId,
        });

        const qrCodeUrl = newBike._id.toString();
        const qrCode = await QRCode.toDataURL(qrCodeUrl);

        newBike.qrCode = qrCode;
        await newBike.save();

        city.bikes.push(newBike._id);
        parkingArea.bikes.push(newBike._id);
        await city.save();
        await parkingArea.save();
        return res.status(201).json({ message: 'Bike created', bike: newBike });
    } catch (e) {
        res.status(500).json({ message: `createBike ${e.message}` });
    }
}

export async function updateBike(req, res) {
    try {
        const id = req.params.id;
        const available = req.body.available;
        const location = req.body.location;
        const charge = req.body.charge;
        const speed = req.body.speed;
        const bike = await Bike.findOneAndUpdate({ _id: id }, { available, location, charge, speed });
        return res.status(200).json({ message: 'Bike updated', bike: bike });
    } catch (e) {
        res.status(500).json({ message: `updateBike ${e.message}` });
    }
}

export async function deleteBike(req, res) {
    try {
        const id = req.params.id;
        const bike = await Bike.findOneAndDelete({ _id: id });
        const cityId = bike.cityId;
        const city = await City.findById({ _id: cityId });
        city.bikes.pull(bike._id);
        await city.save();

        if (bike.chargingStationId) {
            const chargingStation = await Chargingstation.findById(bike.chargingStationId);
            chargingStation.bikes.pull(bike._id);
            await chargingStation.save();
        }

        if (bike.parkingAreaId) {
            const parkingArea = await ParkingArea.findById(bike.parkingAreaId);
            parkingArea.bikes.pull(bike._id);
            await parkingArea.save();
        }
        return res.status(200).json({ message: 'Bike deleted', bike: bike });
    } catch (e) {
        res.status(500).json({ message: `deleteBike ${e.message}` });
    }
}

export async function deleteAllBikes(req, res) {
    try {
        await Bike.deleteMany();
        return res.status(200).json({ message: 'Bikes deleted' });
    } catch (e) {
        res.status(500).json({ message: `deleteBike ${e.message}` });
    }
}
