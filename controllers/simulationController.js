import { getBikeDetails, getChargingStations, getParkingAreas } from '../db/repopulateDbConfig.js';
import City from '../models/cityModel.js';
import User from '../models/userModel.js';
import Simulation from '../simulation/simulationClass.js';

let simulation = null;

export async function startSimulation(req, res) {
    try {
        const cities = await City.find().populate('parkingAreas').populate('chargingStations').populate('bikes');
        const cityIds = cities.map((city) => city._id);
        const parkingAreaIds = cities.flatMap((city) => city.parkingAreas.map((parking) => parking._id));
        const chargingStationIds = cities.flatMap((city) => city.chargingStations.map((station) => station._id));
        const allBikes = cities.flatMap((city) => city.bikes);
        const floatingBikeIds = [];
        allBikes.forEach((bike) => {
            if (!bike.chargingStationId && !bike.parkingAreaId) {
                floatingBikeIds.push(bike._id);
            }
        });
        const floatingBikes = getBikeDetails(cityIds, floatingBikeIds);
        const parkingAreas = getParkingAreas(cityIds, parkingAreaIds);
        const chargingStations = getChargingStations(cityIds, chargingStationIds);
        const customers = await User.find({ role: 'customer' });
        simulation = new Simulation(cities, parkingAreas, chargingStations, allBikes, floatingBikes, customers);
        simulation.startSim();

        return res.status(200).json({ message: 'Simulation started!', simulation });
    } catch (e) {
        console.error('Error starting sim', e);
        return res.status(500).json({ message: e.message });
    }
}

export async function getSimUpdate() {
    const data = simulation.getUpdatedData();
    console.log('Update');
    return data;
}

export async function endSimulation(req, res) {
    simulation = null;
    return res.status(200).json({ message: 'Simulation stopped!', simulation });
}

export async function stopBike(req, res) {
    const id = req.params.id;
    simulation.stopBike(id);
    console.log('Bike stopped: ', id);
}
