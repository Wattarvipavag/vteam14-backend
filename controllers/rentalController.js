import User from '../models/userModel.js';
import Rental from '../models/rentalModel.js';
import City from '../models/cityModel.js';
import Bike from '../models/bikeModel.js';
import { getRentalPrice } from '../helpers/rentalPrice.js';

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
            return res.status(404).json({ message: `No new rental created` });
        }

        user.rentalHistory.push(newRental._id);
        await user.save();
        bike.available = false;
        bike.parkingAreaId = null;
        bike.chargingStationId = null;
        await bike.save();

        return res.status(200).json({ message: 'Rental created', rental: newRental });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export async function endRental(req, res) {
    try {
        const rentalId = req.params.id;
        const rental = await Rental.findByIdAndUpdate({ _id: rentalId }, { active: false });

        if (!rental) {
            return res.status(404).json({ message: `No rental found with ${rentalId}` });
        }

        const city = await City.findOne({ bikes: rental.bikeId }).populate('parkingAreas').populate('chargingStations');

        if (!city) {
            return res.status(404).json({ message: `No city holds a bike with bikeId: ${rental.bikeId}` });
        }

        const startLocation = rental.startLocation;
        const bike = await Bike.findById({ _id: rental.bikeId });
        const endLocation = bike.location;
        const startTime = new Date(rental.createdAt);
        const endTime = new Date(rental.updatedAt);
        const surcharge = city.surcharge;
        const discount = city.discount;
        const minuteRate = city.minuteRate;
        const stations = [...city.chargingStations, ...city.parkingAreas];
        const totalCost = await getRentalPrice(
            startLocation,
            endLocation,
            stations,
            startTime,
            endTime,
            surcharge,
            discount,
            minuteRate,
            bike
        );
        rental.totalCost = totalCost;
        await rental.save();
        bike.available = true;
        await bike.save();
        return res.status(200).json({ message: 'Rental ended', rental });
    } catch (e) {
        res.status(500).json({ message: e.message });
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
