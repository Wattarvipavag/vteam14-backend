import User from '../models/userModel.js';
import Rental from '../models/rentalModel.js';
import City from '../models/cityModel.js';
import Bike from '../models/bikeModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import ChargingStation from '../models/chargingStationModel.js';
import { getRentalPrice, isWithinArea } from '../helpers/rentalPrice.js';

export async function getAllRentals(req, res) {
    try {
        const rentals = await Rental.find().exec();
        res.status(200).json({ message: 'Rentals exists', rentals });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getUserRentals(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('rentalHistory');

        if (!user) {
            return res.status(404).json({ message: `No user found with ${userId}` });
        }

        // This returns an array of rental objects tied to the user
        return res.status(200).json({ message: 'User exists, here is the rental history', rentals: user.rentalHistory });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function getOneRental(req, res) {
    try {
        const rentalId = req.params.id;
        const rental = await Rental.findById(rentalId);

        if (!rental) {
            return res.status(404).json({ message: `No rental found with ${rentalId}` });
        }

        return res.status(200).json({ message: 'Rental exists', rental });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function createRental(req, res) {
    try {
        const userId = req.body.userId;
        const bikeId = req.body.bikeId;

        const bike = await Bike.findById({ _id: bikeId });
        const user = await User.findById({ _id: userId });

        const newRental = await Rental.create({
            userId: req.body.userId,
            bikeId: req.body.bikeId,
            active: true,
            startLocation: bike.location,
        });

        if (!newRental) {
            return res.status(404).json({ message: 'No new rental created' });
        }

        user.rentalHistory.push(newRental._id);
        await user.save();

        if (bike.parkingAreaId) {
            const parkingArea = await ParkingArea.findOne({ _id: bike.parkingAreaId });
            parkingArea.bikes = parkingArea.bikes.filter((id) => id.toString() !== bikeId);
            await parkingArea.save();
        }

        if (bike.chargingStationId) {
            const chargingStation = await ChargingStation.findOne({ _id: bike.chargingStationId });
            chargingStation.bikes = chargingStation.bikes.filter((id) => id.toString() !== bikeId);
            await chargingStation.save();
        }

        bike.available = false;
        bike.parkingAreaId = undefined;
        bike.chargingStationId = undefined;

        await bike.save();

        if (!res) {
            return { rental: newRental };
        }

        return res.status(200).json({ message: 'Rental created', rental: newRental });
    } catch (e) {
        if (!res) {
            return;
        }

        res.status(500).json({ message: e.message });
    }
}

export async function endRental(req, res) {
    try {
        const rentalId = req.params.id;
        const endLocation = { latitude: req.body.latitude, longitude: req.body.longitude };
        const charge = req.body.charge;

        const rental = await Rental.findById(rentalId);

        const bike = await Bike.findById(rental.bikeId);
        const city = await City.findOne({ bikes: rental.bikeId }).populate('parkingAreas').populate('chargingStations');

        let isInParkingArea = false;
        let isInChargingStation = false;

        for (const area of city.parkingAreas) {
            if (isWithinArea(endLocation, area.location)) {
                area.bikes.push(bike._id);
                await area.save();
                isInParkingArea = true;
                bike.parkingAreaId = area._id;

                break;
            }
        }

        for (const station of city.chargingStations) {
            if (isWithinArea(endLocation, station.location)) {
                station.bikes.push(bike._id);
                await station.save();
                isInChargingStation = true;
                bike.chargingStationId = station._id;
                break;
            }
        }

        rental.active = false;
        rental.endLocation = endLocation;
        await rental.save();

        if (charge >= 10) {
            bike.available = true;
        } else {
            bike.available = false;
        }
        bike.charge = charge;
        bike.location = endLocation;
        await bike.save();

        const startTime = rental.createdAt;
        const endTime = rental.updatedAt;

        const totalCost = await getRentalPrice(
            rental.startLocation,
            endLocation,
            [...city.parkingAreas, ...city.chargingStations],
            startTime,
            endTime,
            city.surcharge,
            city.discount,
            city.minuteRate,
            bike
        );

        rental.totalCost = totalCost;
        await rental.save();

        const user = await User.findById(rental.userId);
        user.balance -= totalCost;
        if (!user.rentalHistory.includes(rentalId)) {
            user.rentalHistory.push(rentalId);
        }
        await user.save();

        return res.status(200).json({ message: 'Rental ended', rental });
    } catch (e) {
        console.error(`Error in endRental: ${e.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function deleteRental(req, res) {
    try {
        const id = req.params.id;
        const rental = await Rental.findByIdAndDelete({ _id: id });

        if (!rental) {
            return res.status(404).json({ message: `No rental found with id: ${id}` });
        }

        return res.status(200).json({ message: 'Rental deleted', rental });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function deleteAllRentals(req, res) {
    try {
        await Rental.deleteMany();

        return res.status(200).json({ message: 'Rentals deleted' });
    } catch (e) {
        res.status(500).json({ message: `deleteAllRentals ${e.message}` });
    }
}
