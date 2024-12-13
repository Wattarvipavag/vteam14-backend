import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import Chargingstation from '../models/chargingStationModel.js';
import ParkingArea from '../models/parkingAreaModel.js';
import User from '../models/userModel.js';

export async function getStats(req, res) {
    try {
        const bikes = await Bike.find().exec();
        const cities = await City.find().exec();
        const chargingstations = await Chargingstation.find().exec();
        const users = await User.find().exec();
        const parkingAreas = await ParkingArea.find().exec();

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
