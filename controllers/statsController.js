import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import Chargingstation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';

export async function getStats(req, res) {
    try {
        const [bikes, cities, chargingstations, users, parkingAreas] = await Promise.all([
            Bike.find().exec(),
            City.find().exec(),
            Chargingstation.find().exec(),
            User.find().exec(),
            ParkingArea.find().exec(),
        ]);

        res.status(200).json({
            bikes: bikes.length,
            cities: cities.length,
            chargingstations: chargingstations.length,
            users: users.length,
            parkingAreas: parkingAreas.length,
        });
    } catch (e) {
        res.status(500).json({ message: `getStats ${e.message}` });
    }
}
