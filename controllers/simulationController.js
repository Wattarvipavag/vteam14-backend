import { getBikeDetails, getChargingStations, getParkingAreas } from '../db/repopulateDbConfig.js';
import City from '../models/cityModel.js';
import User from '../models/userModel.js';
import Simulation from '../simulation/simulationClass.js';

let simulation = null;

/**
 * Function that starts the simulation by calling the simulation class
 * using all the objects it can find from the database and getting their routes from repopulateDbConfig.js
 */
export async function startSimulation(req, res) {
    try {
        // Find all cities from the database and populate their parking areas, charging stations and bikes
        // This is needed because we store them as mongoose reference ids
        const cities = await City.find().populate('parkingAreas').populate('chargingStations').populate('bikes');
        const cityIds = cities.map((city) => city._id);
        const parkingAreaIds = cities.flatMap((city) => city.parkingAreas.map((parking) => parking._id));
        const chargingStationIds = cities.flatMap((city) => city.chargingStations.map((station) => station._id));
        const allBikes = cities.flatMap((city) => city.bikes);
        const floatingBikes = [];
        // Separate the bikes not connected to a charging station or parking area, these will get custom details
        allBikes.forEach((bike) => {
            if (!bike.chargingStationId && !bike.parkingAreaId) {
                floatingBikes.push(bike);
            }
        });
        const updatedFloatingBikes = getBikeDetails(cityIds, floatingBikes);
        const parkingAreas = getParkingAreas(cityIds, parkingAreaIds);
        const chargingStations = getChargingStations(cityIds, chargingStationIds);
        const customers = await User.find({ role: 'customer' });
        simulation = new Simulation(cities, parkingAreas, chargingStations, allBikes, updatedFloatingBikes, customers);
        simulation.startSim();
        console.log('Sim started');

        return res.status(200).json({ message: 'Simulation started!', simulation });
    } catch (e) {
        console.error('Error starting sim', e);
        return res.status(500).json({ message: e.message });
    }
}

/**
 * Function that returns the current state of the simulation
 * @returns a response and a json object with the data of a running simulations state if the simulation is running
 */
export async function getSimUpdate(req, res) {
    if (simulation) {
        const data = await simulation.getUpdatedData();
        console.log('Updated data');
        return res.status(200).json({ message: 'Data updated', data });
    }

    return res.status(404).json({ message: 'Sim is not running' });
}

/**
 * Function that stops the simulation
 * @returns a response and a json object message
 */
export async function endSimulation(req, res) {
    if (simulation) {
        try {
            await simulation.stopSim();
            simulation = null;
            console.log('Simulation ending, stopping all bikes');
            return res.status(200).json({ message: 'Simulation stopped!', simulation });
        } catch (e) {
            console.error('Error ending sim', e);
            return res.status(500).json({ message: e.message });
        }
    }
    return res.status(404).json({ message: 'No simulation to stop' });
}

/**
 * Function that stops a single bike in the simulation
 * @param {Request} req a request holding the mongoose id of the bike
 * in it's parameters
 */
export async function stopBike(req) {
    const id = req.params.id;
    simulation.stopBike(id);
    console.log('Bike stopped: ', id);
}
