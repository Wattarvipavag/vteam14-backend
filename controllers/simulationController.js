import { getBikeDetails, getChargingStations, getParkingAreas } from '../db/repopulateDbConfig.js';
import Bike from '../models/bikeModel.js';
import City from '../models/cityModel.js';
import User from '../models/userModel.js';
import Simulation from '../simulation/simulationClass.js';

let simulation = null;

export async function startSimulation() {
    const cities = await City.find().exec();
    const cityIds = cities.map((city) => city._id);
    const parkingAreas = getParkingAreas(cityIds);
    const chargingStations = getChargingStations(cityIds);
    const allBikes = await Bike.find().exec();
    const freeFloatingBikes = getBikeDetails(cityIds);
    const customers = await User.find({ role: 'customer' });
    const simulation = new Simulation(cities, parkingAreas, chargingStations, allBikes, freeFloatingBikes, customers);
    simulation.startSim();
    console.log('Simulation started', simulation);
}

export async function getSimUpdate() {
    const data = simulation.getUpdatedData();
    console.log('Update');
    return data;
}

export async function endSimulation() {
    simulation = null;
    console.log('Simulation ended');
}

export async function stopBike(req, res) {
    const id = req.params.id;
    simulation.stopBike(id);
    console.log('Bike stopped: ', id);
}
